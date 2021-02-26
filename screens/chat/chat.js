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
            messageText: "",
            roomName: this.props.route.params.roomName, // Room names are exactly as follows: //lounge //stocks //options //crypto //spacs //ideas //devs 
            userLevel: 0
        }
    }
    //---------------------------------------------------------------
    async componentDidMount (){
        // console.log(this.state.roomName)

        let userUID = Firebase.auth().currentUser.uid
        // get user info from firestore
        Analytics.setCurrentScreen(`ChatRoom_${this.state.roomName}`)

        await Firebase.firestore().collection("users").doc(userUID).get()
        .then(doc => {
            const data = doc.data()
            this.setState({
                currentUser: {
                    name: data.username,
                    avatar: data.profilePic,
                    id: doc.id,
                },
                userLevel: data.userLevel
            })
        })

        if (this.state.messages.length == 0) {
            this.getCurrentMessages()
        }
        
    }

    getCurrentMessages = async() => {
        Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .collection("chatNotifications")
        .doc(this.state.roomName)
        .set({ hasChatNotifications: false }, {merge: true})

        await Firebase
        .firestore()
        .collection("chatRooms")
        .doc(this.state.roomName)
        .collection("messages")
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
        .collection("chatRooms")
        .doc(this.state.roomName)
        .collection("messages")
        .doc(messageID)
        .set({
            _id: messageID,
            text: message[0].text,
            // image: message[0].image,
            createdAt: new Date(message[0].createdAt),
            user: {
                id: this.state.currentUser.id,
                name: this.state.currentUser.name,
                avatar: this.state.currentUser.avatar,
            },
            
        })

        Analytics.logEvent(`ChatMessageSent_${this.state.roomName}`)
        
        // this.sendChatNotification()

    }

    sendChatNotification = async() => {
        const sendChatNotifications = Firebase.functions().httpsCallable('sendChatNotifications');
        sendChatNotifications({
            senderUID: this.state.currentUser.id,
            roomName: this.state.roomName
        })
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error);
        });
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

    renderComposer = () => {
        return (
            <View style={{backgroundColor: '#000000'}} >
            </View>
          )
    }

    render() { 
        if(this.state.isLoading){
            return(
              <View style={{backgroundColor: '#000000', flex: 1}}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }   
        if (this.state.userLevel < 1 && this.state.roomName == "announcements") {
            return (
                <View style={{backgroundColor: '#000000', flex: 1}}>
                    <GiftedChat
                        showUserAvatar={true}
                        isTyping={this.state.isTyping}
                        renderComposer={this.renderComposer}
                        
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
                        placeholder = "send a message..."
                        keyboardShouldPersistTaps='never'
                        onPressAvatar={user => this.getProfile(user)}
                        textInputStyle={styles.inputContainer}
                        isKeyboardInternallyHandled = {false}
                        // alwaysShowSend = {true}
                        maxInputLength = {240}
                    />
    
                    <KeyboardSpacer />
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
                    placeholder = "send a message..."
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