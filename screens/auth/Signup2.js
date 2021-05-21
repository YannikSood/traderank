import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Text, Linking, Alert,  TouchableWithoutFeedback, Keyboard  } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

//redux
import { connect, useDispatch } from 'react-redux';
import * as Analytics from 'expo-firebase-analytics';
import firebase from '../../firebase';
import { authUser } from '../../actions/User.Actions';


const mapStateToProps = state => ({
  user: state.user,
  isLoggedIn: state.isLoggedIn,
});


const Signup2 = ({ props, route, navigation }) => {
  const { username } = route.params;


  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async() => {
    try {
      Analytics.logEvent('sign_up');
      //If this is true, upload the profile pic to storage, then initialize a new user to the database with
      //Username, uid, email, [following, followers, post all 0] and profile pic
      await firebase.auth()
        .createUserWithEmailAndPassword(email.trim().toLowerCase(), password)
        .then(() => addUserToDB())
        .then(() => addUserToUsernames())
        .catch((error) => {
          Alert.alert(
            'error',
            String(error),
            [
              { text: 'OK', onPress: () => console.log('OK Pressed 1') },
            ],
            { cancelable: false },
          );
          setIsLoading(false);
        });
    } catch (error) {
      Alert.alert(
        'error',
        error,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed 2') },
        ],
        { cancelable: false },
      );
      setIsLoading(false);
    }
  };

  const addUserToDB = async() => {
    await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .set({
        username: username.trim().replace(/[^\w\s]/gi, ''),
        email: firebase.auth().currentUser.email,
        profilePic: 'https://firebasestorage.googleapis.com/v0/b/traderank-288df.appspot.com/o/profilePictures%2Fnoimage.jpeg?alt=media&token=873305d1-e583-4c9c-b60a-42cd080ae822',
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        bio: '',
        userLevel: 0,
        score: 0,
        signupDate: new Date(),
      })
      .catch((error) => {
        console.error('Error writing document to user collection: ', error);
      });
  };

  const addUserToUsernames = async() => {
    await firebase.firestore()
      .collection('usernames')
      .doc(username.trim().replace(/[^\w\s]/gi, ''))
      .set({
        uid: firebase.auth().currentUser.uid,
      })
      .catch((error) => {
        console.error('Error writing document to user collection: ', error);
      })
      .then(() => dispatch(authUser(firebase.auth().currentUser.uid, firebase.auth().currentUser.email, username)))
      .then(() => navigation.navigate('Tabs'))
      .then(() => navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      }))
      .then(() => setIsLoading(false));

    const addUserToAlgolia = firebase.functions().httpsCallable('addUserToAlgolia');
    addUserToAlgolia({
      username: username.trim().replace(/[^\w\s]/gi, ''),
      uid: firebase.auth().currentUser.uid,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
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
      <View
        style={styles.container}
      >

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
          onPress={() => handleSignUp()}
        >
          <Text style={styles.buttonText}>sign up</Text>
        </TouchableOpacity>


        <Text style={{ color: '#FFFFFF', paddingTop: 5, paddingBottom: 5 }}>
                            clicking signup means you agree to our
        </Text>

        <Text
          style={{ color: '#5233FF', padding: 4 }}
          onPress={() => Linking.openURL('http://socialtradinginc.com/#terms')}
        >
                        Terms of Service
        </Text>


        <Text
          style={{ color: '#5233FF', padding: 4 }}
          onPress={() => Linking.openURL('http://socialtradinginc.com/#pri')}
        >
                        Privacy Policy
        </Text>
        <KeyboardSpacer />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  thumbnail: {
    width: 200,
    height: 200,
    // resizeMode: "contain",
    borderRadius: 100,
  },
});

export default connect(mapStateToProps)(Signup2);
