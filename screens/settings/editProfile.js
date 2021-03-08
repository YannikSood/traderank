import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer'

//Redux
import { connect } from 'react-redux';
import Firebase from '../../firebase'
import { clearUser } from "../../redux/app-redux";

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
      await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    oldBio: doc.data().bio,
                    oldProfilePic: doc.data().profilePic,
                    twitter: doc.data().twitter,
                    instagram: doc.data().instagram
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        });
    }

    changeBio = async() => {
      this.setState({ isLoading: true });
      // This should take us to the right place, adding a temp uid where we need it
      await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
          bio: this.state.newBio,
        }, { merge: true })
        .then(() => this.setState({
          oldBio: this.state.newBio,
          isLoading: false,
        }))
        .catch((error) => {
            console.error("Error storing and retrieving image url: ", error);
        });
    }

    changeTwitter = async() => {
      this.setState({ isLoading: true });
      // This should take us to the right place, adding a temp uid where we need it
      await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
          twitter: this.state.twitter,
        }, { merge: true })
        .then(() => this.setState({
          isLoading: false,
        }))
        .catch((error) => {
            console.error("Error changing twitter handle: ", error);
        });
    }

    changeInstagram = async() => {
      this.setState({ isLoading: true });
      // This should take us to the right place, adding a temp uid where we need it
      await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
          instagram: this.state.instagram,
        }, { merge: true })
        .then(() => this.setState({
          isLoading: false,
        }))
        .catch((error) => {
            console.error("Error changing instagram handle: ", error);
        });
    }

    changeProfilePic = async() => {
      const response = await fetch(this.state.profilePic.uri);
      const file = await response.blob();
      await Firebase
        .storage()
        .ref(`profilePictures/${Firebase.auth().currentUser.uid}`)
        .put(file);

      const url = await Firebase.storage().ref(`profilePictures/${Firebase.auth().currentUser.uid}`).getDownloadURL();
      this.setState({
        newProfilePicURL: url,
      });

      await Firebase.firestore().collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
          profilePic: this.state.newProfilePicURL,
        }, { merge: true })
        .catch((error) => {
            console.error("Error writing document to user collection: ", error);
        })
        .then(() => this.setState({ isLoading: false }));
    }

    openImagePickerAsync = async() => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync()
        
        try {
            if (pickerResult.cancelled === true) {
                console.log("pickerResult is cancelled");
                this.setState({ profilePic: null})
                return;
            }

            if (pickerResult !== null) {

                console.log("pickerResult not null")

                this.setState({
                    isLoading: true,
                    profilePic: pickerResult
                })

                this.changeProfilePic()
            }
            else {
                console.log("pickerResult is null");
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
        if (pickerResult.cancelled === true) {
            console.log("pickerResult is cancelled");
            this.setState({ profilePic: null})
            
        }
        
    };

    //Function to update all profile info at once excpet image
    saveChanges = () => {
      if (this.state.newBio !== ' ') {
        this.changeBio();
      }
      if (this.state.twitter !== ' ') {
        this.changeTwitter();
      }
      if (this.state.instagram !== ' ') {
        this.changeInstagram();
      }
    }

    render() {
      if (this.state.isLoading) {
        return (
              <View styles ={styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E" />
              </View>
        );
      }
      return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>

                  <Image
                      source={{ uri: this.state.oldProfilePic }}
                      style={styles.thumbnail}
                    />

                  <TouchableOpacity
                      onPress={this.openImagePickerAsync}
                      style={styles.button}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>change profile picture</Text>
                    </TouchableOpacity>

                  <View style= {{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, paddingTop: 5 }}>bio   </Text>

                      <TextInput
                          style={styles.inputBox}
                          value={this.state.newBio}
                          onChangeText={newBio => this.setState({ newBio })}
                          placeholder={this.state.oldBio}
                          multiline
                          autoCapitalize="none"
                          placeholderTextColor="#696969"
                        />
                    </View>


                  <View style ={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, paddingTop: 7 }}>twitter   </Text>

                      <TextInput
                          style={styles.socialInputBox}
                          value={this.state.twitter}
                          onChangeText={twitter => this.setState({ twitter })}
                          placeholder={this.state.twitter === null ? 'Enter Twitter username' : this.state.twitter}
                          autoCapitalize="none"
                          placeholderTextColor="#696969"
                        />
                    </View>



                  <View style= {{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18, paddingTop: 7 }}>instagram   </Text>

                      <TextInput
                          style={styles.socialInputBox}
                          value={this.state.instagram}
                          onChangeText={instagram => this.setState({ instagram })}
                          placeholder={this.state.instagram === null ? 'Enter Instagram username' : this.state.instagram}
                          autoCapitalize="none"
                          placeholderTextColor="#696969"
                        />
                    </View>



                  <TouchableOpacity
                      onPress={() => { this.saveChanges(); }}
                      style={styles.button}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>save changes</Text>
                    </TouchableOpacity>


                  <KeyboardSpacer />
                </View>
            </TouchableWithoutFeedback>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#121212',
  },
  inputBox: {
    width: '85%',
    // margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    color: '#FFFFFF',
    // textAlign: 'center'
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 40,
    marginBottom: 30,
  },
  button: {
    // marginTop: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 30,
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
    borderColor: '#d3d3d3',
    borderWidth: 1,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default connect(mapStateToProps)(EditProfile);
