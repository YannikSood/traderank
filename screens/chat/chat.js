import React, { useState, useCallback, useEffect }from 'react'
import { View, StyleSheet, ActivityIndicator, Text, TextInput, Dimensions } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Firebase from '../../firebase'
import Moment from 'moment'
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Analytics from 'expo-firebase-analytics';


class Chat extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            currentUser: null,
            isLoading: true,
            messageID: "",
            isTyping: false,
            messageText: ""
        }
    }
    //---------------------------------------------------------------
    async componentDidMount (){
        // get user info from firestore
        let userUID = Firebase.auth().currentUser.uid
        Analytics.setCurrentScreen("ChatScreen")

        await Firebase.firestore().collection("users").doc(userUID).get()
        .then(doc => {
            data = doc.data()
            this.setState({
                currentUser: {
                    name: data.username,
                    avatar: data.profilePic,
                    id: doc.id,
                },
            })
        })

        if (this.state.messages.length == 0) {
            this.getCurrentMessages()
        }
        
    }

    getCurrentMessages = async() => {

        await Firebase.firestore().collection("chat")
        .orderBy("createdAt", "desc")
        .limit(50)
        .onSnapshot(querySnapshot => {
            const messages = []
            var i = 0
            querySnapshot.forEach((res) => {
                const { 
                    _id,
                    user,
                    text,
                    createdAt,
                    } = res.data();
    
                    
                    messages.push({
                        key: res._id,
                        _id,
                        user,
                        text,
                        createdAt
                    });

                    messages[i].createdAt = Moment(messages[i].createdAt.toDate()).format('LLL')

                    if (messages[i].user._id == this.state.currentUser.id) {
                        if (messages[i].user.avatar !== this.state.currentUser.avatar) {
                            Firebase.firestore().collection('chat').doc(messages[i]._id).set({
                                user: {
                                    _id: this.state.currentUser.id,
                                    name: this.state.currentUser.name,
                                    avatar: this.state.currentUser.avatar,
                                }
                            }, { merge: true})
                        }
                    }
                    i++
            })




            this.setState({
                messages,
                isLoading: false, 
                isTyping: false
            });
        })
    }

    //Load 50 more messages when the user scrolls
    //Add a message to firestore
    onSend = async(message) => {

        this.setState({isTyping: true,})
        const messageID = uuidv4()
        await Firebase.firestore()
        .collection("chat")
        .doc(messageID)
        .set({
            _id: messageID,
            text: message[0].text,
            // image: message[0].image,
            createdAt: new Date(message[0].createdAt),
            user: {
                _id: this.state.currentUser.id,
                name: this.state.currentUser.name,
                avatar: this.state.currentUser.avatar,
            },
            
        })

         Analytics.logEvent("Chat_Message_Sent")
        
        // .then(() => this.getCurrentMessages())

    }

    getProfile = async(user) => {
        //Make sure the user is not clicking on their own profile. If they are, redirect them to the profile tab.
        //Removes the chance of them following themselves or having to show a different profile
        if (Firebase.auth().currentUser.uid == user._id) {
            this.props.navigation.navigate('Profile')
        }
        else {
            //Get the remainder of the poster's information. We already have the UID and username, we need bio and follower, following, and profile pic
            this.props.navigation.push('ClickedUserProfile', 
            {
                posterUID: user._id,
                // navigation: this.props.navigation
            })
        }
    }

    // onTextChange = (message) => {
    //     const lastChar = this.state.messageText.substr(this.state.messageText.length - 1)
    //     const currentChar = message.substr(message.length - 1)
    //     const spaceCheck = /[^@A-Za-z_]/g
    //     this.setState({
    //         messageText: message
    //       })

    //     //Empty message, do nothing
    //     if(message.length === 0) {
    //         console.log("message length 0")
    //     } 
        
    //     //Non Empty Message
    //     else {

    //       //No @ detected
    //       if (spaceCheck.test(lastChar) && currentChar != '@') {
    //         console.log("normal text")
    //       } 
          
    //       //@ Detected
    //       else {

            
    //         const checkSpecialChar = currentChar.match(/[^@]/)
    //         //Make sure it is @
    //         if (checkSpecialChar === null || currentChar === '@') {

    //              console.log('last char @')

    //             //If the characters following the @ are a username, ping that person

    //         } else if (checkSpecialChar != null) {
    //             console.log("no @")
    //         }

    //       }

    //     }

    // }
    
    // getUserSuggestions = (keyword) => {
    //     this.setState({
    //       isLoading: true
    //     }, () => {
    //       if(Array.isArray(userList)) {
    //         if(keyword.slice(1) === '') {
    //           this.setState({
    //             userData: [...userList],
    //             isLoading: false
    //           })
    //         } else {
    //           const userDataList = userList.filter(obj => obj.name.indexOf(keyword.slice(1)) !== -1)
    //           this.setState({
    //             userData: [...userDataList],
    //             isLoading: false
    //           })
    //         }
    //       } 
    //     })
    //   }

    // renderComposer = (props) => {
    //     return (
    //         <View style={styles.composerContainer}>
    //           <View >
    //             <TextInput {...props}
    //               placeholder={'Type something...'}
    //               ref={(input) => { this.msgInput = input; }}
    //               onChangeText={(value) => this.onTextChange(value, props)}
    //               style={styles.inputContainer}
    //               value={props.text}
    //               multiline={true}
    //             />
    //           </View>
    //             <View>
    //                 <Ionicons name="ios-search" size={25} color="black" />
    //             </View>
    //         </View>
    //       )
    // }

    render() { 
        if(this.state.isLoading){
            return(
              <View style={{backgroundColor: '#000000', flex: 1}}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }   
        return (
            <View style={{backgroundColor: '#000000', flex: 1}}>
                <GiftedChat
                    showUserAvatar={true}
                    isTyping={this.state.isTyping}
                    // renderComposer={this.renderComposer}
                    
                    renderUsernameOnMessage={true}
                    messages={this.state.messages}
                    // onInputTextChanged={message => this.onTextChange(message)}
                    onSend={message => this.onSend(message)}
                    scrollToBottom
                    // user = {{
                    //     _id: 1
                    // }}
                    // locale = { dayjs.locale('en-ca') }
                    showAvatarForEveryMessage = {false}
                    dateFormat = 'll'
                    timeFormat = 'LT'
                    placeholder = "talk to the traderank mafia..."
                    keyboardShouldPersistTaps='never'
                    onPressAvatar={user => this.getProfile(user)}
                    textInputStyle={styles.inputContainer}
                    isKeyboardInternallyHandled = {false}
                    alwaysShowSend = {true}
                    maxInputLength = {240}
                />

                <KeyboardSpacer />
            </View>
            
        )
        
    }
}


const styles = StyleSheet.create({
    bioText: {
        fontSize: 16,
        alignContent: 'center',
        padding: 20,
        color: '#000000'
    },
    inputContainer: {
        width: '85%',
        margin: 10,
        fontSize: 16,
        // borderColor: '#d3d3d3',
        padding: 10,
        paddingTop: 5,
        // borderWidth: 1,
        // backgroundColor: '#121212',
        borderRadius: 11,
        // color: '#FFFFFF'
    }

})

export default Chat;