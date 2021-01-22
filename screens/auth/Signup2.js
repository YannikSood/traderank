import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Text, KeyboardAvoidingView, Alert, Image, TouchableWithoutFeedback, Keyboard,} from 'react-native'
import Firebase from '../../firebase'
import * as ImagePicker from 'expo-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer'

//redux
import { connect } from 'react-redux';
import { authUser } from './../../redux/app-redux';

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        authUser: (id, email, username) => { dispatch(authUser(id, email, username))}
     };
}

class Signup2 extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            user: this.props.user,
            email: this.props.route.params.email,
            password: this.props.route.params.password,
            profilePic: null,
            storage_image_uri: '',
            isLoading: false
        }
    }

    //Check username is in use/register user as a new user in the db
    handleSignUp = async() => {
           try {
                //If this is true, upload the profile pic to storage, then initialize a new user to the database with 
                //Username, uid, email, [following, followers, post all 0] and profile pic
                await Firebase.auth()
                .createUserWithEmailAndPassword(this.state.email.trim().toLowerCase(), this.state.password)


                await Firebase.firestore()
                .collection('users')
                .doc(Firebase.auth().currentUser.uid)
                .set ({
                    username: this.state.username.trim().replace(/[^\w\s]/gi, ""),
                    email: Firebase.auth().currentUser.email,
                    profilePic: 'https://firebasestorage.googleapis.com/v0/b/traderank-288df.appspot.com/o/profilePictures%2Fnoimage.jpeg?alt=media&token=873305d1-e583-4c9c-b60a-42cd080ae822',
                    followerCount: 0,
                    followingCount: 0,
                    postCount: 0,
                    bio: "",
                    userLevel: 0,
                    commentsCount: 0,
                    likesCount: 0,
                    score: 0,
                    signupDate: new Date()
                })
                .catch(function(error) {
                    console.error("Error writing document to user collection: ", error);
                })
                // .then(() => this.props.authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.uid, this.state.username))
                // .then(() => this.props.navigation.navigate('Tabs'))
                // .then(() => this.setState({ isLoading: false}))

                //Now add a reference to the usernames so you can check n shit
                await Firebase.firestore()
                .collection('usernames')
                .doc(this.state.username.trim().replace(/[^\w\s]/gi, ""))
                .set ({
                    uid: Firebase.auth().currentUser.uid
                })
                .catch(function(error) {
                    console.error("Error writing document to user collection: ", error);
                })
                .then(() => this.props.authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.uid, this.state.username))
                .then(() => this.props.navigation.navigate('Tabs'))
                .then(() => this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                }))
                .then(() => this.setState({ isLoading: false}))
                    
                
           }
           catch(error) {
               console.log(error);
           }
    }

    checkUsername = async() => {
        this.setState({ isLoading: true})
        //Check for minimum length reached
        if(this.state.username.length < 3) {
            Alert.alert(
                'username too short',
                'minimum username length is 3 characters, only letters, numbers, and underscores allowed',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
              );
              this.setState({ isLoading: false})
        }
        else {
            await Firebase.firestore()
            .collection('usernames')
            .doc(this.state.username.trim().replace(/[^\w\s]/gi, ""))
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    Alert.alert(
                        'username is taken',
                        'please choose another username',
                        [
                          { text: 'OK', onPress: () => console.log('OK Pressed') }
                        ],
                        { cancelable: false }
                      );
                      this.setState({ isLoading: false})
                } else {
                    this.handleSignUp()
                }
            }.bind(this));
        }
    }
    //---------------------------------------------------------------

    render() {
        if(this.state.isLoading){
            return(
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    
        return (

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View 
                    style={styles.container}>

                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.headerPartOneText}>trade</Text>
                        <Text style={styles.headerPartTwoText}>rank</Text>
                    </View>

                    <TextInput
                        style={styles.inputBox}
                        value={this.state.username.trim().replace(/[^\w\s]/gi, "")}
                        onChangeText={username => this.setState({ username })}
                        placeholder='username'
                        placeholderTextColor="#696969" 
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={20}
                    />

                        {/* <Image
                            source={{ uri: this.state.profilePic.uri }}
                            style={styles.thumbnail}
                        />

                    <TouchableOpacity onPress={this.openImagePickerAsync} style={styles.button}>
                            <Text style={styles.buttonText}>replace profile pic</Text>
                    </TouchableOpacity> */}


                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={this.checkUsername}>
                            <Text style={styles.buttonText}>finish up</Text>
                    </TouchableOpacity>
                    <KeyboardSpacer />
                </View>
            </TouchableWithoutFeedback>
        )
    }
       
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    },
    headerPartOneText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    headerPartTwoText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#07dbd1'
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center'
    },
    thumbnail: {
        width: 200,
        height: 200,
        // resizeMode: "contain",
        borderRadius: 100
      }
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup2);