import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Alert, Dimensions } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//redux
import { connect, useDispatch } from 'react-redux';
import firebase from '../../firebase';
import { authUser } from '../../actions/User.Actions';


const mapStateToProps = state => ({
  user: state.user,
  isLoggedIn: state.isLoggedIn,
});


const ForgotPassword = (props) => {
  // Props
  const { user, navigation } = props;

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

  //Send Forgot Password Email
  const sendForgotPasswordEmail = async() => {
    const docRef = firebase.auth();

    docRef.sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          'password reset email sent',
          String(email),
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
      }).catch((error) => {
        Alert.alert(
          'error',
          String(error),
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
        setIsLoading(false);
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

        <View style={{ flexDirection: 'row', paddingTop: Dimensions.get('window').height / 5, paddingBottom: 25 }}>
          <Text style={styles.headerPartOneText}>forgot password</Text>
        </View>


        <View style={{ flexDirection: 'row', paddingBottom: 25 }}>
          <View style={{ paddingTop: 15 }}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#696969" />
          </View>

          <TextInput
            style={styles.inputBox}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="email"
            placeholderTextColor="#696969"
            autoCapitalize="none"
            autoFocus={false}
          />
        </View>


        <TouchableOpacity
          style={styles.button}
          onPress={() => sendForgotPasswordEmail()}
        >
          <Text style={styles.buttonText}>reset</Text>
        </TouchableOpacity>

        {/* <Button
          title="sign up"
          onPress={() => navigation.navigate('Signup')}
        /> */}

        <KeyboardSpacer />

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#000000',
  },
  inputBox: {
    width: '85%',
    margin: 10,
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 16,
    borderColor: '#696969',
    borderBottomWidth: 1,
    // textAlign: 'center',
    color: '#FFFFFF',
  },
  button: {
    // marginTop: 30,
    marginBottom: 15,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#07dbd1',
    borderRadius: 5,
    width: 150,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121212',
  },
  buttonSignup: {
    fontSize: 12,
  },
  headerPartOneText: {
    fontSize: 24,
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

export default connect(mapStateToProps)(ForgotPassword);
