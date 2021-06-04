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


const OnboardingScreen2 = (props) => {

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

        <View style={{ flexDirection: 'row', paddingTop: Dimensions.get('window').height / 5, paddingBottom: 50 }}>
          <Text style={styles.headerPartOneText}>trade</Text>
          <Text style={styles.headerPartTwoText}>rank</Text>
        </View>


        <Text style={styles.subheaderText}>
yo,
          {' '}
          {username}
          {' '}
welcome to traderank. we built this app because other places didn't really give us what we wanted when we posted our trades. here, we allow you to build a following for posting something as dope as a gain or hilarious as a loss. find your people
          {' '}
        </Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
  },
});

export default connect(mapStateToProps)(OnboardingScreen2);
