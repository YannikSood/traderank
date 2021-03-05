import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native'
import Firebase from '../../firebase'
import KeyboardSpacer from 'react-native-keyboard-spacer'

//redux
import { connect, useDispatch } from 'react-redux';
import { authUser } from './../../actions/User.Actions';


const mapStateToProps = (state) => {
    return {
        user: state.user,
        isLoggedIn: state.isLoggedIn
    }
}

// const dispatch = useDispatch();
// const mapDispatchToProps = (dispatch) => {
//     return {
//         authUser: (id, email, username) => { dispatch(authUser(id, email, username))}
//      };
// }

const Login = (props) => {
    /**
       * Any refs that you have in the component will be instantiated as a constant at the top of the function with the `useRef()` hook (which you will import from react),
       * passing in the initialValue (if it's known on page load) as the param.
       */
  
    // Refs
  
  
    // Props
    const { user, navigation } = props;
  
    /**
       * The `useDispatch()` hook is given to us from react-redux and it allows us to make calls to our action creators
       */
  
    // Dispatch
    const dispatch = useDispatch();
  
    /**
       * We no longer need to use the `constructor` with `super(props)` or as a way to set the initial `this.state`. The `useState()` hook handles that, passing in
       * the initial state as the param
       */
  
    // State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        Firebase.auth().onAuthStateChanged((user) => {
          if (user) {
                Firebase.firestore()
                .collection('users')
                .doc(Firebase.auth().currentUser.uid)
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        dispatch(authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, doc.data().username))

                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Tabs' }],
                        })
                    }
                }.bind(this))
                .then(() => setIsLoading(false))
                .catch(function (error) {
                    console.log("Error getting document:", error);
                })

            }
            else {
                setIsLoading(false);
            }
        })
    }, []);

    const handleLogin = async() => {

        try {
             await Firebase.auth()
            .signInWithEmailAndPassword(email.trim().toLowerCase(), password)
            .catch(function(error) {
                Alert.alert(
                    'error',
                    String(error),
                    [
                      { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                  );
                  setIsLoading(false);
            })
            .then(() => getLoginInfo())
            .then(() =>
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                })
            )
            
        }
        catch(error) {
            console.log(error);
        }
    }
  
    const getLoginInfo = async() => {
        var docRef = Firebase.firestore().collection('users')

        docRef
        .doc(Firebase.auth().currentUser.uid)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                dispatch(authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, doc.data().username))
                // this.props.authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, doc.data().username)
            }
            else {
                console.log("Username not found!");
            }
        }.bind(this))
        .catch(function (error) {
            console.log("Error getting document:", error);
        })
        
        
    }

    if(isLoading){
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
                    value={email}
                    onChangeText={email => setEmail(email)}
                    placeholder='email'
                    placeholderTextColor="#696969" 
                    autoCapitalize='none'
                />

                <TextInput
                    style={styles.inputBox}
                    value={password}
                    onChangeText={password => setPassword(password)}
                    placeholder='password'
                    placeholderTextColor="#696969" 
                    secureTextEntry={true}
                />

                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleLogin()}>
                        <Text style={styles.buttonText}>login</Text>
                </TouchableOpacity>

                <Button 
                    title="no account? sign up" 
                    onPress={() => navigation.navigate('Signup')}/>

                <KeyboardSpacer />

            </View>
        </TouchableWithoutFeedback>
    )
}

// class Login extends React.Component {

//     constructor(props) {
//         super(props)
//         this.state = {
//             email: '',
//             password: '',
//             username: '',
//             user: this.props.user,
//             isLoading: false
//         }
//     }

//     componentDidMount = () => {
        
//       }
    
//       componentWillUnmount() {
//         // Don't forget to unsubscribe when the component unmounts
//         this.unsubscribe();
//     }

//     handleLogin = async() => {
//         const { email, password } = this.state

//         try {
//              await Firebase.auth()
//             .signInWithEmailAndPassword(email.trim().toLowerCase(), password)
//             .catch(function(error) {
//                 Alert.alert(
//                     'error',
//                     String(error),
//                     [
//                       { text: 'OK', onPress: () => console.log('OK Pressed') }
//                     ],
//                     { cancelable: false }
//                   );
//                   this.setState({ isLoading: false})
//             })
//             .then(() => this.getLoginInfo())
//             .then(() => this.props.navigation.navigate('Tabs'))
//             .then(() =>
//                 this.props.navigation.reset({
//                     index: 0,
//                     routes: [{ name: 'Tabs' }],
//                 })
//             )
            
//         }
//         catch(error) {
//             console.log(error);
//         }
//     }

//     getLoginInfo = async() => {
//         var docRef = Firebase.firestore().collection('users')

//         docRef
//         .doc(Firebase.auth().currentUser.uid)
//         .get()
//         .then(async function (doc) {
//             if (doc.exists) {
//                 // dispatch(authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, doc.data().username))
//                 this.props.authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, doc.data().username)
//                 console.log("Current authed username: " + this.state.user.username)
//             }
//             else {
//                 console.log("Username not found!");
//             }
//         }.bind(this))
//         .catch(function (error) {
//             console.log("Error getting document:", error);
//         })
        
        
//     }

//     render() {
//         if(this.state.isLoading){
//             return(
//               <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#9E9E9E"/>
//               </View>
//             )
//         }    
//         return (
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <View 
//                     style={styles.container}>
//                     <View style={{flexDirection: 'row'}}>
//                         <Text style={styles.headerPartOneText}>trade</Text>
//                         <Text style={styles.headerPartTwoText}>rank</Text>
//                     </View>
                    

//                     <TextInput
//                         style={styles.inputBox}
//                         value={this.state.email}
//                         onChangeText={email => this.setState({ email })}
//                         placeholder='email'
//                         placeholderTextColor="#696969" 
//                         autoCapitalize='none'
//                     />

//                     <TextInput
//                         style={styles.inputBox}
//                         value={this.state.password}
//                         onChangeText={password => this.setState({ password })}
//                         placeholder='password'
//                         placeholderTextColor="#696969" 
//                         secureTextEntry={true}
//                     />

//                     <TouchableOpacity 
//                         style={styles.button}
//                         onPress={this.handleLogin}>
//                             <Text style={styles.buttonText}>login</Text>
//                     </TouchableOpacity>

//                     <Button 
//                         title="no account? sign up" 
//                         onPress={() => this.props.navigation.navigate('Signup')}/>

//                     <KeyboardSpacer />

//                 </View>
//             </TouchableWithoutFeedback>
//         )
//     }
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
    }
})

export default connect(mapStateToProps)(Login);