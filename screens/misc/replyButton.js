import { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ReplyButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replyTo: this.props.replyTo,
      postID: this.props.postID,
      commentID: this.props.commentID, //Id of the comment I am replying to
      replyingToUsername: this.props.replyingToUsername,
      replyingToUID: this.props.replierAuthorUID, //person who made the comment I am replying to
      replierAuthorUID: this.props.replierAuthorUID, //person sending the reply
      replierUsername: this.props.replierUsername,
      commentLikes: this.props.commentLikes,
    };
  }

  render() {
    //sotre who to reply to
    const replyDataObj = {
      postID: `${this.state.postID}`, //post the comment I am replying to
      commentID: `${this.state.commentID}`, //Id of the comment I am replying to
      replyingToUsername: `${this.state.replyingToUsername}`,
      replyingToUID: `${this.state.replyingToUID}`, //person who made the comment I am replying to
      replierAuthorUID: `${this.state.replierAuthorUID}`, //person sending the reply
      replierUsername: `${this.state.replierUsername}`,
      commentLikes: this.props.commentLikes,
      //may need to change
    };

    return (
      <TouchableOpacity
        onPress={() => {
          //StoreReplyTo
          const storeReplyTo = async(value) => {
            try {
              await AsyncStorage.setItem('replyTo', value);
            } catch (e) {
              // saving error
            }
          };
          storeReplyTo(`${this.state.replyTo}`);
          this.setState({ replyTo: `${item.commentorUsername}` });


          //replyData that will be stored in the DB
          const storeReplyData = async(value) => {
            try {
              const jsonValue = JSON.stringify(value);
              await AsyncStorage.setItem('replyData', jsonValue);
            } catch (e) {
              // saving error
            }
          };
          this.setState({ replyData: replyDataObj });
          storeReplyData(replyDataObj);
        }}
      >

        <View style={{ paddingLeft: 15, paddingRight: 15 }}>

          <Entypo name="reply" size={22} color="white" />

        </View>
      </TouchableOpacity>
    );
  }
}
export default ReplyButton;
