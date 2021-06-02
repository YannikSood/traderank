import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, TouchableWithoutFeedback, Keyboard, Alert, Linking, Dimensions } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { FontAwesome5 } from '@expo/vector-icons';

//redux
import { connect, useDispatch } from 'react-redux';
import firebase from '../../firebase';


const mapStateToProps = state => ({
  user: state.user,
  isLoggedIn: state.isLoggedIn,
});


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      isLoading: false,
    };
  }

    //Check username is in use/register user as a new user in the db
    handleSignUp = async() => {
    //   console.log(this.state.username);
      try {
        this.props.navigation.navigate('Signup2', {
          username: this.state.username,
        });
      } catch (error) {
        console.log(error);
      }
    }

    checkUsername = async() => {
      this.setState({ isLoading: true });
      //Check for minimum length reached
      if (this.state.username.length < 3) {
        Alert.alert(
          'username too short',
          'minimum username length is 3 characters, only letters, numbers, and underscores allowed',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
        this.setState({ isLoading: false });
      } else {
        await firebase.firestore()
          .collection('usernames')
          .doc(this.state.username.trim().replace(/[^\w\s]/gi, ''))
          .get()
          .then((doc) => {
            if (doc.exists) {
              Alert.alert(
                'username is taken',
                'please choose another username',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
              );
              this.setState({ isLoading: false });
            } else {
              this.handleSignUp();
            }
          });
      }
    }


    render() {
      return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={styles.container}
          >

            <View style={{ flexDirection: 'row', paddingTop: Dimensions.get('window').height / 5, paddingBottom: 50 }}>
              <Text style={styles.headerPartOneText}>trade</Text>
              <Text style={styles.headerPartTwoText}>rank</Text>
            </View>


            <View style={{ flexDirection: 'row', paddingBottom: 25 }}>
              <View style={{ paddingTop: 15 }}>
                <FontAwesome5 name="user-astronaut" size={24} color="#696969" />
              </View>
              <TextInput
                style={styles.inputBox}
                value={this.state.username.trim().replace(/[^\w\s]/gi, '')}
                onChangeText={username => this.setState({ username })}
                placeholder="username"
                placeholderTextColor="#d3d3d3"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
            </View>


            <TouchableOpacity
              style={styles.button}
              onPress={this.checkUsername}
            >
              <Text style={styles.buttonText}>next</Text>
            </TouchableOpacity>

            <Text style={styles.labelText}>💡 pick something anonymous for privacy</Text>

          </View>
        </TouchableWithoutFeedback>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    // justifyContent: 'center',
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
  labelText: {
    // fontSize: 16,
    color: '#d3d3d3',
  },
});

export default connect(mapStateToProps)(Signup);
