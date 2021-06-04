import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Text, Linking, Alert,  TouchableWithoutFeedback, Keyboard, Dimensions  } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

//redux
import { connect, useDispatch } from 'react-redux';
import * as Analytics from 'expo-firebase-analytics';
import firebase from '../../firebase';
import { authUser } from '../../actions/User.Actions';


const mapStateToProps = state => ({
  user: state.user,
  isLoggedIn: state.isLoggedIn,
});


const OnboardingScreen1 = (props) => {
  const { route, navigation } = props;

  const returnToNotifications = async() => {
    await firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .set({
        firstOpen: false,
      }, { merge: true });
      
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }],
    });
  };

  const [isLoading, setIsLoading] = useState(false);

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

        <View style={{ flexDirection: 'row', paddingTop: Dimensions.get('window').height / 10, paddingBottom: 50 }}>
          <Text style={styles.headerPartOneText}>trade</Text>
          <Text style={styles.headerPartTwoText}>rank</Text>
        </View>


        <View style={{ padding: 5 }}>
          <Text style={styles.subheaderText}>
yo,
welcome to traderank.

          </Text>

          <Text />

          <Text style={styles.subheaderText}>
      here, you can build a following for posting something as dope as a gain, or hilarious as a loss.
      if you don't trade a lot - don't trip. share your thoughts, funny shit, and moves.
      find your people while you do it - that's what traderank is all about.

          </Text>

          <Text />

          <Text style={styles.subheaderText}>
that being said, if you have any questions, feedback, or issues, please don't hesitate to hit us up on
instagram or twitter [@traderankapp]. thank you so much for being here - you are what traderank is all about.
          </Text>
        </View>


        <TouchableOpacity
          style={styles.createButton}
          onPress={returnToNotifications}
        >
          <AntDesign name="checkcircle" size={70} color="#07dbd1" />
        </TouchableOpacity>
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
    marginBottom: 20,
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
    fontSize: 16,
    // fontWeight: 'bold',
    alignContent: 'center',
    color: 'white',
  },
  createButton: {
    // width: 60,
    // height: 60,
    // borderRadius: 30,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 75,
    right: 25,
  },
});

export default connect(mapStateToProps)(OnboardingScreen1);
