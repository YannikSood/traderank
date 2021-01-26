import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native'
import Firebase from '../../firebase'
import KeyboardSpacer from 'react-native-keyboard-spacer'

//redux
import { connect } from 'react-redux';
import { authUser } from './../../redux/app-redux';


const mapStateToProps = (state) => {
    return {
        user: state.user,
        isLoggedIn: state.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        authUser: (id, email, username) => { dispatch(authUser(id, email, username))}
     };
}
class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            username: '',
            user: this.props.user,
            isLoading: false
        }
    }

    componentDidMount = () => {
        this.setState({isLoading: true})
        this.unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
          if (user) {
                Firebase.firestore()
                .collection('users')
                .doc(Firebase.auth().currentUser.uid)
                .get()
                .then(async function (doc) {
                    if (doc.exists) {
                        this.props.authUser(Firebase.auth().currentUser.uid, Firebase.auth().currentUser.email, doc.data().username)
                        this.props.navigation.navigate('Tabs')
                        this.props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'Tabs' }],
                        })
                        console.log("Current authed username: " + doc.data().username)
                    }
                }.bind(this))
                .then(() => this.setState({isLoading: false}))
                .catch(function (error) {
                    console.log("Error getting document:", error);
                })

            }
            else {
                this.setState({isLoading: false})
            }
        })
      }
    
      componentWillUnmount() {
        // Don't forget to unsubscribe when the component unmounts
        this.unsubscribe();
    }

    handleLogin = async() => {
        const { email, password } = this.state

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
                  this.setState({ isLoading: false})
            })
            .then(() => this.getLoginInfo())
            .then(() => this.props.navigation.navigate('Tabs'))
            .then(() =>
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                })
            )
            
        }
        catch(error) {
            console.log(error);
        }
    }

    getLoginInfo = async() => {
        var docRef = Firebase.firestore().collection('users')

        docRef
        .doc(Firebase.auth().currentUser.uid)
        .get()
        .then(async function (doc) {
            if (doc.exists) {
                this.props.authUser(Firebase.auth().currentUser.uid, this.state.email, doc.data().username)
                console.log("Current authed username: " + this.state.user.username)
            }
            else {
                console.log("Username not found!");
            }
        }.bind(this))
        .catch(function (error) {
            console.log("Error getting document:", error);
        })
        
        
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
                        onPress={this.handleLogin}>
                            <Text style={styles.buttonText}>login</Text>
                    </TouchableOpacity>

                    <Button 
                        title="no account? sign up" 
                        onPress={() => this.props.navigation.navigate('Signup')}/>

                    <KeyboardSpacer />

                </View>
            </TouchableWithoutFeedback>
        )
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Login);