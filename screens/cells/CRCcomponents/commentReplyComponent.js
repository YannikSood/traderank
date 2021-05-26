import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import { clearUser } from '../../../redux/app-redux';
import firebase from '../../../firebase';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


//We add comments
class ReplyCommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //same props as replyToData obj
      commentorUID: firebase.auth().currentUser.uid,
      commentorUsername: this.props.user.username,
      commentText: `@${this.props.replyData.replierUsername}`,
      commentsCount: 0, //how many comments for this post (regular comments, top level replies, sub replies)
      isLoading: false,
      replyData: this.props.replyData,
      replyCount: 0,
      userCommentsCount: 0,
      currentUser: null,
    };
  }

  async componentDidMount() {
    const userUID = firebase.auth().currentUser.uid;


    await firebase.firestore().collection('users').doc(userUID).get()
      .then((doc) => {
        data = doc.data();
        this.setState({
          currentUser: {
            name: data.username,
            id: doc.id,
          },
        });
      });
  }

     //get number of replies associated with the comment
     getReplyCount = async() => {
       await firebase.firestore()
         .collection('comments')
         .doc(this.state.replyData.postID)
         .collection('comments')
         .doc(this.state.replyData.topCommentID)
         .get()
         .then((doc) => {
           if (doc.exists) {
             this.setState({
               replyCount: doc.data().replyCount,
             });
           } else {
             console.log('No such document for getting replyCount.');
           }
         });
     }

    updateCommentCount = async() => {
      await firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.replyData.postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              commentsCount: doc.data().commentsCount,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document comment count update!');
          }
        });
    }

    setUserCommentCount = async() => {
      //Get the comments count of a user, how many comments they have posted
      await firebase.firestore()
        .collection('users')
        .doc(this.state.replyData.replierAuthorUID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              userCommentsCount: doc.data().commentsCount,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document user comment count!');
          }
        });
    }

    addComment = async() => {
      console.log(this.state.replyData);
      if (this.state.commentText.trim().length == 0 || this.state.commentText.trim() == '') {
        Alert.alert(
          'no empty comments!',
          'please type something to comment',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
        return;
      }
      this.setState({ isLoading: true });
      Analytics.logEvent('User_Posted_Comment_Reply');
      this.setUserCommentCount();
      this.updateCommentCount();
      this.getReplyCount();

      //set state comment count
      //TODO: ADD error checking from addCommentToDB for blank comments
      /* Replying ot the same person multiple times does not work yet ,
        make sure wehn go back it reloads commentComponents and that should fix it
        */
      //increment replyCOunt to comments -> postId -> comments

      //Send reply
      await firebase.firestore()
        .collection('comments') // collection comments
        .doc(this.state.replyData.postID) // Which post?
        .collection('comments') //Get comments for this post
        .doc(this.state.replyData.topCommentID) //Get the specific comment we want to reply to
        .collection('replies') //Create a collection for said comment
        .add({ //Add to this collection, and automatically generate iD for this new comment
          postID: this.state.replyData.postID,
          commentID: this.state.replyData.commentID, //commentReplyTo
          commentText: this.state.commentText,
          replyingToUsername: this.state.replyData.replierUsername, //person who replied to the top level comment
          replyingToUID: this.state.replyData.replierAuthorUID, ////person who replied to the top level comment
          replierAuthorUID: this.state.currentUser.id, //should be user logged in
          replierUsername: this.state.currentUser.name, //user logged in
          date_created: new Date(),
        })
        .then(() => {
          this.setState({
            commentText: '',
          });
        })
        .catch((error) => {
                    console.error("Error: ", error);
                });

      //get reply count first from calling async function
      //increase replyCount in Db
      await firebase.firestore()
        .collection('comments')
        .doc(this.state.replyData.postID)
        .collection('comments')
        .doc(this.state.replyData.topCommentID)
        .set({
          replyCount: this.state.replyCount + 1,
        }, { merge: true })
        .then(() => {
          this.setState({
            replyCount: this.state.replyCount + 1,
          });
        })
        .catch((error) => {
                      console.error("Error writing document to comments when updating replyCount: ", error);
                  });

      //Update Post global CommentCount
      await firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.replyData.postID)
        .set({
          commentsCount: this.state.commentsCount + 1,
        }, { merge: true })
        .catch((error) => {
                      console.error("Error writing document to user posts: ", error);
                  });

      //update comment count for user
      await firebase.firestore()
        .collection('users')
        .doc(this.state.replyData.replierAuthorUID)
        .set({
          commentsCount: this.state.userCommentsCount + 1,
        }, { merge: true })
        .then(() => this.setState({
            userCommentsCount: this.state.userCommentsCount + 1,
            isLoading: false,
          }),)
.then(() => this.updateCommentCount());
    }


    render() {
      //Allow a user to post a comment. First, take a text input, then submit it with the comment button.
      if (this.state.isLoading) {
        return (
          <View style={styles.inputBox}>
                <ActivityIndicator size="large" color="#9E9E9E" />
              </View>
        );
      }
      return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View
                style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'center', paddingBottom: 15, marginBottom: 15 }}
              >

                <TextInput
                    style={styles.inputBox}
                    value={this.state.commentText}
                    onChangeText={(commentText) => {
                        // console.log("comment from commentComponent: " + this.state.commentText);
                        this.setState({ commentText });
                      }}
                    placeholder="Add a comment..."
                    placeholderTextColor="#696969"
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                    maxLength={400}
                  />

                <TouchableOpacity onPress={() => { this.addComment(); }}>
                    <MaterialCommunityIcons name="message" size={30} color="white" />
                  </TouchableOpacity>
              </View>
          </TouchableWithoutFeedback>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: '80%',
    margin: 10,
    padding: 7,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 15,
    // textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default connect(mapStateToProps)(ReplyCommentComponent);
