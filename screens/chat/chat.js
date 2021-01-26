import React, { useState, useCallback, useEffect }from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Firebase from '../../firebase'
import Moment from 'moment'
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs' 


class Chat extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            currentUser: null,
            isLoading: true,
            messageID: "",
            isTyping: false,
        }
    }
    //---------------------------------------------------------------
    async componentDidMount (){
        // get user info from firestore
        let userUID = Firebase.auth().currentUser.uid

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
            })

            messages.forEach((message) => {
                message.createdAt = Moment(message.createdAt.toDate()).format('LLL')
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
        this.setState({isTyping: true})
        await Firebase.firestore().collection("chat")
        .add({
            user: {
                _id: this.state.currentUser.id,
                name: this.state.currentUser.name,
                avatar: this.state.currentUser.avatar,
            },
            
        })
        .then(ref => this.setState({messageID: ref.id}))

        await Firebase.firestore().collection("chat")
        .doc(this.state.messageID)
        .set({
            _id: this.state.messageID,
            text: message[0].text,
            createdAt: new Date(message[0].createdAt)
        }, { merge: true })
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

    user () {
        return {
            
        }
    }

    render() { 
        return (
            <View style={{backgroundColor: '#000000', flex: 1}}>
                <GiftedChat
                    showUserAvatar={true}
                    isTyping={this.state.isTyping}
                    renderUsernameOnMessage={true}
                    messages={this.state.messages}
                    onSend={message => this.onSend(message)}
                    scrollToBottom
                    // user = { {
                    //     _id: 1
                    // }}
                    // locale = { dayjs.locale('en-ca') }
                    showAvatarForEveryMessage = {false}
                    dateFormat = 'll'
                    timeFormat = 'LT'
                    placeholder = "Talk to the traderank mafia..."
                    onPressAvatar={user => this.getProfile(user)}
                />
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
})

export default Chat;