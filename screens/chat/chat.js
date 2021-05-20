import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TextInput, Dimensions, FlatList, Keyboard, KeyboardEvent } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Analytics from 'expo-firebase-analytics';
import algoliasearch from 'algoliasearch/lite';
import MiscUserComponent from '../cells/FollowCellComps/userComponent';
import firebase from '../../firebase';
const client = algoliasearch('5BS4R91W97', '0207d80e22ad5ab4d65fe92fed7958d7');
const index = client.initIndex('usernames');

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentUser: null,
      isLoading: true,
      messageID: '',
      isTyping: false,
      messageText: '',
      roomName: this.props.route.params.roomName, // Room names are exactly as follows: //lounge //stocks //options //crypto //spacs //ideas //devs
      userLevel: 0,
      usernames: [],
      mentionsData: [], //array of @ mention username and uid who to send a notification to
      isSearching: false,
      notificationUID: '',
      keyboardHeight: 0,
      normalHeight: 0,
      shortHeight: 0,

    };
  }

  async componentDidMount() {
    // console.log(this.state.roomName)

    const userUID = firebase.auth().currentUser.uid;
    // get user info from firestore
    Analytics.setCurrentScreen(`ChatRoom_${this.state.roomName}`);

    await firebase.firestore().collection('users').doc(userUID).get()
      .then((doc) => {
        const data = doc.data();
        this.setState({
          currentUser: {
            name: data.username,
            avatar: data.profilePic,
            id: doc.id,
          },
          userLevel: data.userLevel,
        });
      });

    if (this.state.messages.length === 0) {
      this.getCurrentMessages();
    }
  }


    getCurrentMessages = async() => {
      firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chatNotifications')
        .doc(this.state.roomName)
        .set({ hasChatNotifications: false }, { merge: true });

      await firebase
        .firestore()
        .collection('chatRooms')
        .doc(this.state.roomName)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .onSnapshot((querySnapshot) => {
          const messages = [];
          let i = 0;
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
              createdAt,
            });

            messages[i].createdAt = Moment(messages[i].createdAt.toDate()).format('LLL');

            if (messages[i].user.id === this.state.currentUser.id) {
              if (messages[i].user.avatar !== this.state.currentUser.avatar) {
                firebase.firestore().collection('chat').doc(messages[i]._id).set({
                  user: {
                    _id: this.state.currentUser.id,
                    name: this.state.currentUser.name,
                    avatar: this.state.currentUser.avatar,
                  },
                }, { merge: true });
              }
            }
            i++;
          });


          this.setState({
            messages,
            isLoading: false,
            isTyping: false,
          });
        });
    }

    //Load 50 more messages when the user scrolls
    //Add a message to firestore
    onSend = async(message) => {
      this.setState({ isTyping: true });
      const messageID = uuidv4();
      await firebase.firestore()
        .collection('chatRooms')
        .doc(this.state.roomName)
        .collection('messages')
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

        });

      /*
        Parse message to send mention notifications
        */
      const messageWords = message[0].text.split(' ');
      //console.log("Message words: ", messageWords);
      const mentions = messageWords.filter(elem => elem.charAt(0) == '@');
      //    console.log("Mentions: ", mentions);
      //    console.log("Mentions Data: ",this.state.mentionsData);
      mentions.map(mention => console.log(mention));
      for (const elem of this.state.mentionsData) {
        if (elem !== null && mentions.indexOf(elem.username) > -1) {
          console.log('Notifying:', elem.uid, 'Message: ', message[0].text);
          this.writeToUserNotifications(elem.uid, message[0].text);
          //Send notification
        }
      }
      //    mentions.map(mention => console.log("Every user mentioned: ", this.state.mentionsObj[mention]));
      this.setState({
        isSearching: false,
        mentionsData: [],
      });

      Analytics.logEvent(`ChatMessageSent_${this.state.roomName}`);

      // this.sendChatNotification()

      // this.sendChatNotification()
    }

    sendChatNotification = async() => {
      const sendChatNotifications = firebase.functions().httpsCallable('sendChatNotifications');
      sendChatNotifications({
        senderUID: this.state.currentUser.id,
        roomName: this.state.roomName,
      })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    getProfile = async(user) => {
      //Make sure the user is not clicking on their own profile. If they are, redirect them to the profile tab.
      //Removes the chance of them following themselves or having to show a different profile
      if (firebase.auth().currentUser.uid === user._id) {
        // console.log(`${user.id} self`);
        this.props.navigation.navigate('Profile');
      } else {
        // console.log(`${user.id} clicked`);
        //Get the remainder of the poster's information. We already have the UID and username, we need bio and follower, following, and profile pic
        this.props.navigation.push('ClickedUserProfile',
          {
            posterUID: user._id,
            // navigation: this.props.navigation
          });
      }
    }

    renderComposer = () => (
      <View style={{ backgroundColor: '#000000' }} />
    )

    // sendMentionsNotification = functions.https.onCall((data, context) => {

    //RecieverUID, senderUsername, Roomname
    writeToUserNotifications = async(uid, message) => {
      console.log('Inside writeToUserNotifications', uid, message);
      if (this.state.currentUser.id != uid) {
        const sendMentionsNotification = firebase.functions().httpsCallable('sendMentionsNotification');
        sendMentionsNotification({
          senderUID:  this.state.currentUser.id,
          recieverUID: uid,
          senderUsername: this.state.currentUser.name,
          roomName: this.state.roomName,
        })
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {

      }
    }

    onTextChange = (message) => {
      if (message == '' || message.length === 0) {
        this.setState({ isSearching: false });
      }
      /**
         * Sample response from hits object

            Object {
            "_highlightResult": Object {
            "username": Object {
                "fullyHighlighted": false,
                "matchLevel": "full",
                "matchedWords": Array [
                "ka",
                ],
                "value": "<em>ka</em>l",
            },
            },
            "objectID": "752083000",
            "uid": "vei3naWuMqY9qXPo9YuQFOUcqmx1",
            "username": "kal",
        },
         */
      this.setState({ messageText: message });
      if (this.state.messageText.indexOf('@') == -1) {
        this.setState({ isSearching: false });
      }

      const length = this.state.messageText.length;
      //if previous character is '@' show user list
      if (this.state.messageText.charAt(length - 1) === '@' || this.state.isSearching) {
        if (this.state.isSearching === false) {
          //console.log("Starting the search...");
          this.setState({ isSearching: true });
        }
        // console.log(this.state.messageText);
        const indexOfAt = this.state.messageText.lastIndexOf('@');
        const username = this.state.messageText.substring(indexOfAt + 1, length);
        const suggestions = [];

        //Set list of usernames to suggest to mention
        index.search(username).then(({ hits }) => {
          for (const h of hits) {
            const elem = { username: h.username, uid: h.uid };
            suggestions.push(elem);
          }
          this.setState({ usernames: suggestions });
          //  console.log("Usernames: ", this.state.usernames);
        });
      }
    }

    //Replace last @username text in messageText with clicked on username
    setUsername = (item) => {
      console.log(item.username);
      this.setState({ messageText: this.state.messageText.trim() });
      const lastIndexOfAt = this.state.messageText.lastIndexOf('@');
      const replacement = `@${item.username}`;
      console.log(`@${item.username} ${item.uid}`);
      const msg = this.state.messageText.substring(0, lastIndexOfAt) + replacement;
      const mentions = { username: `@${item.username}`, uid: item.uid };

      this.setState({
        messageText: msg,
        isSearching: false,
        mentionsData: [...this.state.mentionsData, mentions],
      });
    }


    render() {
      const renderItem = ({ item }) => (
        <View>

          <Text onPress={() => this.setUsername(item)} style={styles.usernames}>{item.username}</Text>
          {/* <UserComponent onPress={() => this.setUsername(item)} style={styles.usernames} uid={item.uid} /> */}
          {/* <MiscUserComponent onPress={() => this.setUsername(item)} uid={item.uid} navigation={this.props.navigation} /> */}
          <View style={styles.lineStyle} />


        </View>
      );
      if (this.state.isLoading) {
        return (
          <View style={{ backgroundColor: '#000000', flex: 1 }}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }
      //only for us?
      if (this.state.userLevel < 1 && this.state.roomName == 'announcements') {
        return (
          <View style={{ backgroundColor: '#000000', flex: 1, paddingTop: 5 }}>
            {this.state.isSearching


                       && (
                       <FlatList
                    //    ref={this.props.scrollRef}
  data={this.state.usernames}
  renderItem={renderItem}
  keyExtractor={(item, index) => String(index)}
  contentContainerStyle={styles.flatList}
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
                    //    onRefresh={this._refresh}
  refreshing={this.state.isSearching}
/>
                       )
                }
            <GiftedChat
                  showUserAvatar
                  textInputProps={{ autoFocus: true }}
                  isTyping={this.state.isTyping}
                  renderComposer={this.renderComposer}
                  renderUsernameOnMessage
                  messages={this.state.messages}
                  onInputTextChanged={message => this.onTextChange(message)}
                  onSend={message => this.onSend(message)}
                  scrollToBottom
                        // user = {{
                        //     _id: 1
                        // }}
                        // locale = { dayjs.locale('en-ca') }
                  showAvatarForEveryMessage={false}
                  dateFormat="ll"
                  timeFormat="LT"
                  placeholder="send a message..."
                  keyboardShouldPersistTaps="never"
                  onPressAvatar={user => this.getProfile(user)}
                  textInputStyle={styles.inputContainer}
                  isKeyboardInternallyHandled={false}
                  text={this.state.messageText}
                        // alwaysShowSend = {true}
                  maxInputLength={240}
                />
            <KeyboardSpacer style={{ zIndex: 3, elevation: 3 }} />
          </View>
        );
      }

      return (
        <View style={{ backgroundColor: '#121212', flex: 1 }}>


          {/* <View> */}
          {this.state.isSearching

                  && (
                  <FlatList
               //    ref={this.props.scrollRef}
                  // inverted={true}
  data={this.state.usernames}
  renderItem={renderItem}
  keyExtractor={(item, index) => String(index)}
  contentContainerStyle={styles.flatList}
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator
               //    onRefresh={this._refresh}
  refreshing={this.state.isSearching}
/>
                  )
           }
          {/* </View> */}

          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
              <GiftedChat
                  showUserAvatar
                  textInputProps={{ autoFocus: true }}
                  isTyping={this.state.isTyping}
                      // renderComposer={this.renderComposer}

                  renderUsernameOnMessage
                  messages={this.state.messages}
                  onInputTextChanged={message => this.onTextChange(message)}
                  onSend={message => this.onSend(message)}
                  scrollToBottom
                      // user = {{
                      //     _id: 1
                      // }}
                      // locale = { dayjs.locale('en-ca') }
                  showAvatarForEveryMessage={false}
                  dateFormat="ll"
                  timeFormat="LT"
                  placeholder="send a message..."
                  keyboardShouldPersistTaps="handled"
                  onPressAvatar={user => this.getProfile(user)}
                  textInputStyle={styles.inputContainer}
                  isKeyboardInternallyHandled={false}
                  alwaysShowSend
                  maxInputLength={400}
                  text={this.state.messageText}
                />
            </View>


          <KeyboardSpacer style={{ zIndex: 3, elevation: 3 }} />

        </View>

      );
    }
}


const styles = StyleSheet.create({
  flatList: {
    // flex: 1,
    flexGrow: 1,
    zIndex: 1,
    elevation: 1,
    // position: 'absolute',
    // bottom: -Dimensions.get('screen').height,
    marginBottom: -500,
    width: Dimensions.get('screen').width,
    backgroundColor: 'transparent',
  },
  bioText: {
    fontSize: 16,
    alignContent: 'center',
    padding: 20,
    color: '#000000',
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
    zIndex: 3,
    elevation: 3,
    // color: '#FFFFFF'
  },
  usernames: {
    backgroundColor: 'black',
    color: 'white',
    flex: 1,
    paddingBottom: 3,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 5,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'white',
    width: Dimensions.get('window').width,
    marginBottom: 10,
  },

});

export default Chat;
