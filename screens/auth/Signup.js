import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, TouchableWithoutFeedback, Keyboard, Alert, Linking } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

//redux
import { connect, useDispatch } from 'react-redux';
import Firebase from '../../firebase';


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
        this.props.navigation.navigate('Register', {
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
        await Firebase.firestore()
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

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.headerPartOneText}>trade</Text>
              <Text style={styles.headerPartTwoText}>rank</Text>
            </View>


            <TextInput
              style={styles.inputBox}
              value={this.state.username.trim().replace(/[^\w\s]/gi, '')}
              onChangeText={username => this.setState({ username })}
              placeholder="username"
              placeholderTextColor="#696969"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />

            <Text style={styles.labelText}>💡 pick something anonymous for privacy</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={this.checkUsername}
            >
              <Text style={styles.buttonText}>next</Text>
            </TouchableOpacity>

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
    justifyContent: 'center',
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
  labelText: {
    fontSize: 16,
    color: '#FFFFFF'
},
});

export default connect(mapStateToProps)(Signup);
