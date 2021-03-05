import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Text, KeyboardAvoidingView, Alert, Image, TouchableWithoutFeedback, Keyboard,} from 'react-native'
import Firebase from '../../firebase'
import * as ImagePicker from 'expo-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer'
import firebase from 'firebase/app';

//redux
import { connect, useDispatch } from 'react-redux';
import { authUser } from './../../actions/User.Actions';


const mapStateToProps = (state) => {
    return {
        user: state.user,
        isLoggedIn: state.isLoggedIn
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         authUser: (id, email, username) => { dispatch(authUser(id, email, username))}
//      };
// }

// const dispatch = useDispatch();


class Signup2 extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            username: this.props.route.params.username,
            email: '',
            password: '',
            user: this.props.user,
            profilePic: null,
            storage_image_uri: '',
            isLoading: false
        }
    }

    addOrUpdateIndexRecord(user){
         // Get Firebase object
        const record = user.val();

        // Specify Algolia's objectID using the Firebase object key
        record.objectId = user.key;

        //Add object
        index
            .saveObject(record)
            .then(() => {
                console.log("Firebase object indexed in Algolia", record.objectId);
            })
            .catch(error => {
                console.error('Error when indexing contact into Algolia', error);
                process.exit(1);
            });
        
    }

    //Check username is in use/register user as a new user in the db
    handleSignUp = async() => {
           try {
                //If this is true, upload the profile pic to storage, then initialize a new user to the database with 
                //Username, uid, email, [following, followers, post all 0] and profile pic
                await Firebase.auth()
                .createUserWithEmailAndPassword(this.state.email.trim().toLowerCase(), this.state.password)
                .catch(function(error) {
                    Alert.alert(
                        'error',
                        String(error),
                        [
                          { text: 'OK', onPress: () => console.log('OK Pressed') }
                        ],
                        { cancelable: false }
                      );
                      this.setState({ isLoading: false})
                })

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
                    score: 0,
                    signupDate: new Date()
                })
                .catch(function(error) {
                    console.error("Error writing document to user collection: ", error);
                })

                

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
                // .then(() => dispatch(authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, this.state.username)))
                // .then(() => this.props.authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, doc.data().username))
                .then(() => this.props.navigation.navigate('Tabs'))
                .then(() => this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                }))
                .then(() => this.setState({ isLoading: false}))
                
                //Add to algolia
                const addUserToAlgolia = Firebase.functions().httpsCallable('addUserToAlgolia');
                addUserToAlgolia({
                    username: this.state.username.trim().replace(/[^\w\s]/gi, ""),
                    uid:Firebase.auth().currentUser.uid
                })
                .then((result) => {
                    console.log(result)
                })
                .catch((error) => {
                    console.log(error);
                });
           }
           catch(error) {
               Alert.alert(
                'error',
                error,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
                );
                this.setState({ isLoading: false})
           }
    }

    //---------------------------------------------------------------

    //ADDING A USERNAME TO 
    addUsername = () => {
        const addUsername = Firebase.functions().httpsCallable('addUsername');
        addUsername({ 
            username: this.state.username,
        })
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error);
        });
    }

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
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        placeholder='email'
                        placeholderTextColor="#696969" 
                        autoCapitalize='none'
                    />

                    <TextInput
                        style={styles.inputBox}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        placeholder='password'
                        placeholderTextColor="#696969" 
                        secureTextEntry={true}
                    />

                    
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={this.handleSignUp}>
                            <Text style={styles.buttonText}>sign up</Text>
                    </TouchableOpacity>


                        <Text style={{color: '#FFFFFF', paddingTop: 5, paddingBottom: 5}}>
                                clicking signup means you agree to our
                        </Text>

                        <Text style={{color: '#5233FF', padding: 4}}
                            onPress={() => Linking.openURL('http://socialtradinginc.com/#tos')}> 
                            Terms of Service
                        </Text>

                        <Text style={{color: '#5233FF', padding: 4}}
                            onPress={() => Linking.openURL('http://socialtradinginc.com/#privacy')}> 
                            Privacy Policy
                        </Text>
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

export default connect(mapStateToProps)(Signup2);