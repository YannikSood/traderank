import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, TouchableWithoutFeedback, Keyboard, Alert, Linking } from 'react-native'
import Firebase from '../../firebase'
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

class Signup extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            user: this.props.user,
        }
    }

    //Check username is in use/register user as a new user in the db
    handleSignUp = async() => {
        const { email, password } = this.state
        
        if(email != '' && password != '') {
            try { 
                this.props.navigation.navigate('Register', 
                {
                    email: email,
                    password: password,
                    
                })
                }
            catch(error) {
                console.log(error);
            }
        }
        else {
            Alert.alert(
                'please fill out the fields',
                'you need an email and password!',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
              );
        }
    }

    toggleTOSBox = () => {
        this.setState({ tosAgreed: !this.state.tosAgreed })
    }

    togglePrivacyBoxTrue = () => {
        this.setState({ 
            privacyAgreed: !this.state.privacyAgreed,
        })
    }


    render() {
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
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);