import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

//redux
import { connect, useDispatch } from 'react-redux';
import firebase from '../../firebase';
import { authUser } from '../../actions/User.Actions';


const mapStateToProps = state => ({
  user: state.user,
  isLoggedIn: state.isLoggedIn,
});


const Login = (props) => {
  // Props
  const { user, navigation } = props;

  //const navigation = props.navigation

  /**
       * The `useDispatch()` hook is given to us from react-redux and it allows us to make calls to our action creators
       */

  // Dispatch
  const dispatch = useDispatch();

  /**
       * We no longer need to use the `constructor` with `super(props)` or as a way to set the initial `this.state`. The `useState()` hook handles that, passing in
       * the initial state as the param
       */

  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    firebase.auth().onAuthStateChanged((authedUser) => {
      if (authedUser) {
        firebase.firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              dispatch(authUser(firebase.auth().currentUser.uid, firebase.auth().currentUser.email, doc.data().username));

              navigation.reset({
                index: 0,
                routes: [{ name: 'Tabs' }],
              });
            }
          })
          .then(() => setIsLoading(false))
          .catch((error) => {
            console.log('Error getting document:', error);
          });
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const handleLogin = async() => {
    try {
      await firebase.auth()
        .signInWithEmailAndPassword(email.trim().toLowerCase(), password)
        .catch((error) => {
          Alert.alert(
            'error',
            String(error),
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
          setIsLoading(false);
        })
        .then(() => getLoginInfo())
        .then(() => navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        }));
    } catch (error) {
      console.log(error);
    }
  };

  const getLoginInfo = async() => {
    const docRef = firebase.firestore().collection('users');

    docRef
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          dispatch(authUser(firebase.auth().currentUser.uid, firebase.auth().currentUser.email, doc.data().username));
        } else {
          console.log('Username not found!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.headerPartOneText}>trade</Text>
          <Text style={styles.headerPartTwoText}>rank</Text>
        </View>


        <TextInput
          style={styles.inputBox}
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="email"
          placeholderTextColor="#696969"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.inputBox}
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="password"
          placeholderTextColor="#696969"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLogin()}
        >
          <Text style={styles.buttonText}>login</Text>
        </TouchableOpacity>

        <Button
          title="no account? sign up"
          onPress={() => navigation.navigate('Signup')}
        />

        <Button
          title="forgot password"
          onPress={() => navigation.navigate('ForgotPassword')}
        />

        <KeyboardSpacer />

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  inputBox: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#5233FF',
    borderRadius: 5,
    width: 200,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonSignup: {
    fontSize: 12,
  },
  headerPartOneText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerPartTwoText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#07dbd1',
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
  },
});

export default connect(mapStateToProps)(Login);
