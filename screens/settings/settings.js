import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KeyboardSpacer from 'react-native-keyboard-spacer'

import { connect, useDispatch } from 'react-redux';
import Firebase from '../../firebase'
import { clearUser } from "../../actions/User.Actions";


const mapStateToProps = state => ({
  user: state.UserReducer.user,
});

// const dispatch = useDispatch();


class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      oldBio: '',
      newBio: '',
      profilePic: '',
      isLoading: false,
    };
  }


    //Delete from users, usernames, all posts, following, followers, and likes?
    deleteAccount = async() => {

    }

    logOut = async() => {
      try {
        // this.props.clearUser()
        await Firebase.auth()
          .signOut()
          .then(() => this.props.navigation.navigate('Login'));
      } catch (error) {
        console.log(error);
      }
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }

    render() {
      if (this.state.isLoading) {
        return (
              <View styles= {styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E" />
              </View>
        );
      }
      return (
          <View style={styles.container}>
              <TouchableOpacity
                  onPress={this.logOut}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>
Sign out 🤷
{this.state.user.username}
</Text>
                </TouchableOpacity>
            </View>
      );
    }
}

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
  },
});

export default connect(mapStateToProps)(Settings);
