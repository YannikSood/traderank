import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer';

//Redux
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { clearUser } from '../../redux/app-redux';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      oldBio: 'Enter Bio',
      newBio: '',
      profilePic: null,
      newProfilePicURL: '',
      newPicPicked: false,
      newPicChanged: false,
      oldProfilePic: 'oldProfilePic', //was getting warning that this (source:uri) cannot be blank
      isLoading: false,
      twitter: '',
      // oldTwitter: "Enter Twitter",
      instagram: '',
      // oldInstagram: "Enter Instagram",

    };
  }

  componentDidMount() {
    this.pullBio();
  }


    //Pull bio from the db, save it to state
    pullBio = async() => {
      await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              oldBio: doc.data().bio,
              oldProfilePic: doc.data().profilePic,
              profilePic: doc.data().profilePic,
              twitter: doc.data().twitter,
              instagram: doc.data().instagram,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        });
    }

    changeBio = async() => {
      this.setState({ isLoading: true });
      // This should take us to the right place, adding a temp uid where we need it
      await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          bio: this.state.newBio,
        }, { merge: true })
        .then(() => this.setState({
          oldBio: this.state.newBio,
          isLoading: false,
        }))
        .catch((error) => {
          console.error('Error storing and retrieving image url: ', error);
        });
    }

    changeTwitter = async() => {
      this.setState({ isLoading: true });
      // This should take us to the right place, adding a temp uid where we need it
      await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          twitter: this.state.twitter,
        }, { merge: true })
        .then(() => this.setState({
          isLoading: false,
        }))
        .catch((error) => {
          console.error('Error changing twitter handle: ', error);
        });
    }

    changeInstagram = async() => {
      this.setState({ isLoading: true });
      // This should take us to the right place, adding a temp uid where we need it
      await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          instagram: this.state.instagram,
        }, { merge: true })
        .then(() => this.setState({
          isLoading: false,
        }))
        .catch((error) => {
          console.error('Error changing instagram handle: ', error);
        });
    }

    changeProfilePic = async() => {
      const response = await fetch(this.state.profilePic);
      const file = await response.blob();
      await firebase
        .storage()
        .ref(`profilePictures/${firebase.auth().currentUser.uid}`)
        .put(file);

      const url = await firebase.storage().ref(`profilePictures/${firebase.auth().currentUser.uid}`).getDownloadURL();
      this.setState({
        newProfilePicURL: url,
      });

      await firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          profilePic: this.state.newProfilePicURL,
        }, { merge: true })
        .then(() => this.setState({ isLoading: false }))
        .then(() => console.log('new profile pic set on frontend'))
        .catch((error) => {
          console.error('Error writing document to user collection: ', error);
        });
    }

    openImagePickerAsync = async() => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });

      try {
        if (pickerResult.cancelled === true) {
          console.log('pickerResult is cancelled');
          this.setState({
            profilePic: this.state.oldProfilePic,
          });
          return;
        }

        if (pickerResult !== null) {
          console.log('pickerResult not null');

          this.setState({
            profilePic: pickerResult.uri,
            newPicPicked: true,
          });

          console.log(this.state.profilePic);
        } else {
          console.log('pickerResult is null');
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    //Function to update all profile info at once excpet image
    saveChanges = async() => {
      this.setState({ isLoading: true });
      if (this.state.newBio !== '') {
        this.changeBio();
      }
      if (this.state.twitter !== ' ') {
        this.changeTwitter();
      }
      if (this.state.instagram !== ' ') {
        this.changeInstagram();
      }
      if (this.state.newPicPicked) {
        this.changeProfilePic();
      }
    }

    render() {
      if (this.state.isLoading) {
        return (
          <View styles={styles.container}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>


            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: this.state.profilePic }}
                style={styles.thumbnail}
              />

              <TouchableOpacity
                onPress={this.openImagePickerAsync}
                style={styles.button}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>change profile picture</Text>
              </TouchableOpacity>

            </View>
            <View style={styles.lineStyle} />

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 5 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, paddingTop: 5 }}> new bio        </Text>

              <TextInput
                style={styles.inputBox}
                value={this.state.newBio}
                onChangeText={newBio => this.setState({ newBio })}
                placeholder={this.state.oldBio}
                multiline
                maxLength={240}
                autoCapitalize="none"
                placeholderTextColor="#696969"
              />
            </View>
            <View style={styles.lineStyle} />


            <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 5 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, paddingTop: 7 }}> twitter       </Text>

              <TextInput
                style={styles.socialInputBox}
                value={this.state.twitter}
                onChangeText={twitter => this.setState({ twitter })}
                placeholder={this.state.twitter === null ? 'Enter Twitter username' : this.state.twitter}
                autoCapitalize="none"
                placeholderTextColor="#696969"
              />
            </View>
            <View style={styles.lineStyle} />


            <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 5 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, paddingTop: 7 }}> instagram</Text>

              <TextInput
                style={styles.socialInputBox}
                value={this.state.instagram}
                onChangeText={instagram => this.setState({ instagram })}
                placeholder={this.state.instagram === null ? 'Enter Instagram username' : this.state.instagram}
                autoCapitalize="none"
                placeholderTextColor="#696969"
              />
            </View>
            <View style={styles.lineStyle} />


            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => { this.saveChanges(); }}
                style={styles.button}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>save changes</Text>
              </TouchableOpacity>
            </View>



            <KeyboardSpacer />
          </View>
        </TouchableWithoutFeedback>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#000000',
  },
  inputBox: {
    width: '85%',
    // margin: 10,
    padding: 15,
    fontSize: 16,
    // borderColor: '#d3d3d3',
    // borderWidth: 1,
    color: '#FFFFFF',
    // textAlign: 'center'
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 15,
    marginBottom: 15,
  },
  button: {
    marginTop: 15,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 15,
  },
  socialInputBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    paddingTop: 15,
    color: '#FFFFFF',
  },
  socialInputBox: {
    width: '35%',
    // marginTop: 10,
    padding: 10,
    fontSize: 14,
    // borderColor: '#d3d3d3',
    // borderWidth: 1,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  lineStyle: {
    borderWidth: 2,
    borderColor: '#121212',
    width: Dimensions.get('window').width,
    // marginBottom: 10,
  },

});

export default connect(mapStateToProps)(EditProfile);
