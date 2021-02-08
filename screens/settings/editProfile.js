import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Image } from 'react-native'
import Firebase from '../../firebase'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer'

//Redux
import { connect } from 'react-redux';
import { clearUser } from './../../redux/app-redux';

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: (temp) => { dispatch(clearUser(temp))}
     };
}


class EditProfile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            oldBio: "No Bio!",
            newBio: "",
            profilePic: null,
            newProfilePicURL: '',
            oldProfilePic: "",
            isLoading: false,
            twitter: "@",
            instagram: "@",

        }
        
    }

    componentDidMount() {
        this.pullBio()
    }
    
    
    //Pull bio from the db, save it to state
    pullBio = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .get()
        .then(function(doc) {
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
        }.bind(this));
    }

    changeBio = async() => {
        this.setState({ isLoading: true })
        // This should take us to the right place, adding a temp uid where we need it
        await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
            bio: this.state.newBio
        }, { merge: true })
        .then(() => this.setState ({ 
            oldBio: this.state.newBio,
            isLoading: false
        }))
        .catch(function(error) {
            console.error("Error storing and retrieving image url: ", error);
        });
    }

    changeTwitter = async() => {
        this.setState({ isLoading: true })
        // This should take us to the right place, adding a temp uid where we need it
        await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
            twitter: this.state.twitter
        }, { merge: true })
        .then(() => this.setState ({
            isLoading: false
        }))
        .catch(function(error) {
            console.error("Error changing twitter: ", error);
        });
    }

    changeInstagram = async() => {
        this.setState({ isLoading: true })
        // This should take us to the right place, adding a temp uid where we need it
        await Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({
            instagram: this.state.instagram
        }, { merge: true })
        .then(() => this.setState ({
            isLoading: false
        }))
        .catch(function(error) {
            console.error("Error changing twitter: ", error);
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
            newProfilePicURL: url
        })

        await Firebase.firestore().collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set ({
            profilePic: this.state.newProfilePicURL,
        }, { merge: true})
        .catch(function(error) {
            console.error("Error writing document to user collection: ", error);
        })
        .then(() => this.setState({isLoading: false}))
        
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
            return;
        }
        
    };


    render() {
        if(this.state.isLoading){
            return(
              <View styles = {styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    
        if (this.state.profilePic == null) {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
    
                        <Image
                            source={{ uri: this.state.oldProfilePic }}
                            style={styles.thumbnail}
                        />

                        <TouchableOpacity 
                        onPress={this.openImagePickerAsync} 
                        style={styles.button}>
                        <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>change profile picture</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.inputBox}
                            value={this.state.newBio}
                            onChangeText={newBio => this.setState({ newBio })}
                            placeholder={this.state.oldBio}
                            multiline= {true}
                            autoCapitalize='none'
                            placeholderTextColor="#696969" 
                        />

                        <TouchableOpacity 
                            onPress={() => { this.changeBio() }}
                            style={styles.button}>
                            <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>Change Bio</Text>    
                        </TouchableOpacity>

                        <TextInput
                            style={styles.socialInputBox}
                            value={this.state.twitter}
                            onChangeText={twitter => this.setState({ twitter })}
                            placeholder={this.state.twitter}
                            autoCapitalize='none'
                            placeholderTextColor="#696969" 
                        />

                        <TouchableOpacity 
                            onPress={() => { this.changeTwitter() }}
                            style={styles.button}>
                            <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>Change Twitter</Text>    
                        </TouchableOpacity>

                        <TextInput
                            style={styles.socialInputBox}
                            value={this.state.instagram}
                            onChangeText={instagram => this.setState({ instagram })}
                            placeholder={this.state.instagram}
                            autoCapitalize='none'
                            placeholderTextColor="#696969" 
                        />

                        <TouchableOpacity 
                            onPress={() => { this.changeInstagram() }}
                            style={styles.button}>
                            <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>Change Instagram</Text>    
                        </TouchableOpacity>
                        

                        <KeyboardSpacer />
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        else {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                    <Image
                        source={{ uri: this.state.profilePic.uri }}
                        style={styles.thumbnail}
                    />

                    <TouchableOpacity 
                        onPress={this.openImagePickerAsync} 
                        style={styles.button}>
                            <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>pick another photo</Text>
                    </TouchableOpacity>


                    <TextInput
                        style={styles.inputBox}
                        value={this.state.newBio}
                        onChangeText={newBio => this.setState({ newBio })}
                        placeholder={this.state.oldBio}
                        autoCapitalize='none'
                        placeholderTextColor="#696969" 
                    />

                    <TouchableOpacity 
                        onPress={() => { this.changeBio() }}
                        style={styles.button}>
                        <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>Change Bio</Text>    
                    </TouchableOpacity>


                    <KeyboardSpacer />
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderWidth: 1,
        color: '#FFFFFF'
        // textAlign: 'center'
    },
    thumbnail: {
        width: 200,
        height: 200,
        borderRadius: 100
    },
    button: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 200,
        marginRight: 10,
        marginLeft: 10,
    },
    socialInputBoxText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        paddingTop: 15,
        color: '#FFFFFF'
    },
    socialInputBox: {
        width: '50%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center',
        color: '#FFFFFF'
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);