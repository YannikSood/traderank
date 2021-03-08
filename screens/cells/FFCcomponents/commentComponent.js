import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUser } from '../../../redux/app-redux';
import Firebase from '../../../firebase';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


//We add comments
class CommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentorUID: Firebase.auth().currentUser.uid,
      commentorUsername: this.props.user.username,
      postID: this.props.postID,
      posterUID: ' ',
      posterUsername: '',
      commentText: '',
      commentUID: ' ',
      commentsCount: 0,
      userScore: 0,
      isLoading: false,
      replyTo: this.props.replyTo,
      replyData: this.props.replyData,
      replyCount: 0,
      currentUser: Firebase.auth().currentUser.uid,
    };
  }

  //Do this every time the component mounts
  //----------------------------------------------------------
  componentDidMount() {
    //Reset replyTo to be blank?
    this.setState({ replyTo: '' });
    this.getPosterUID();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateCommentCount();
    //Gets replyTo from props as it changes
    //&& prev state ReplyTo !== ""
    if ((prevState.replyTo !== this.state.replyTo) || (prevProps.replyTo !== this.props.replyTo)) {
      const getReplyTo = async() => {
        try {
          const value = await AsyncStorage.getItem('replyTo');
          if (value !== null) {
            this.setState({ commentText: `@${value}` });

            this.setState({ replyTo: value });
          }
        } catch (e) {
          // error reading value
        }
      };
      getReplyTo();

      const getReplyData = async() => {
        try {
          const jsonValue = await AsyncStorage.getItem('replyData');
          this.setState({ replyData: JSON.parse(jsonValue) });
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
          // error reading value
        }
      };
      getReplyData();
    }
  }

    updateCommentCount = async() => {
      await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              commentsCount: doc.data().commentsCount,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        });
    }

    //Get the poster userID
    getPosterUID = async() => {
      await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              posterUID: doc.data().uid,
              commentsCount: doc.data().commentsCount,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        });

      //Get the comments count of a user, how many comments they have posted
      await Firebase.firestore()
        .collection('users')
        .doc(this.state.commentorUID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              userScore: doc.data().score,
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        });
    }

    //get number of replies associated with the comment
    getReplyCount = async() => {
      await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.replyData.commentID)
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

    addComment = () => {
      if (this.state.replyTo.length > 0) {
        this.addReplyComment();
      } else {
        this.addCommentToDB(); //regular comment
      }
    }

    //First, find the post that we are referring to "posts"/posterID/"posts"/postID/"comments"/commentUID->commentorUID
    //Create a comment in the right place and add the information we need, which are just the comment details
    //Add loading, text validation, and a small popup at the bottom that says comment successfully added or something.
    //Also look into comment replies etc
    addCommentToDB = async() => {
      if (this.state.commentText.trim().length == 0 || this.state.commentText.trim() == '') {
        Alert.alert(
          'no empty comments!',
          'please type something to comment',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
      }
      else {
        this.setState({ isLoading: true });
        Analytics.logEvent('User_Posted_Comment');

        //Replying to a comment



        //This should take us to the right place, adding a temp uid where we need it
        await Firebase.firestore()
          .collection('comments')
          .doc(this.state.postID)
          .collection('comments')
          .add({
            commentorUID: this.state.commentorUID,
            commentText: this.state.commentText,
            commentorUsername: this.state.commentorUsername,
            commentLikes: 0,
            replyingToUID: '',
            date_created: new Date(),
          })
          .then(() => this.setState({ commentText: ' ' }))
          .then(() => this.writeToUserNotifications())
          .catch((error) => {
                console.error("Error storing and retrieving image url: ", error);
            });


        await Firebase.firestore()
          .collection('globalPosts')
          .doc(this.state.postID)
          .set({
            commentsCount: this.state.commentsCount + 1,
          }, { merge: true })
          .catch((error) => {
                console.error("Error writing document to user posts: ", error);
            });

        await Firebase.firestore()
          .collection('users')
          .doc(this.state.commentorUID)
          .set({
            score: this.state.userScore + 1,
          }, { merge: true })
          .then(() => this.setState({
              userScore: this.state.userScore + 1,
              isLoading: false,
            }),)
.then(() => this.updateCommentCount());
      }
    }

    addReplyComment = async() => {
      //TODO: ADD error checking from addCommentToDB for blank comments
      /* Replying ot the same person multiple times does not work yet ,
        make sure wehn go back it reloads commentComponents and that should fix it
        */
      //increment replyCOunt to comments -> postId -> comments
      if (this.state.replyTo.length > 0) { //isReplying
        //Send reply
        await Firebase.firestore()
          .collection('comments') // collection comments
          .doc(this.state.replyData.postID) // Which post?
          .collection('comments') //Get comments for this post
          .doc(this.state.replyData.commentID) //Get the specific comment we want to reply to
          .collection('replies') //Create a collection for said comment
          .add({ //Add to this collection, and automatically generate iD for this new comment
            postID: this.state.replyData.postID,
            commentID: this.state.replyData.commentID,
            commentText: this.state.commentText,
            replyingToUsername: this.state.replyData.replyingToUsername,
            replyingToUID: this.state.replyData.replyingToUID,
            replierAuthorUID: this.state.replyData.replierAuthorUID,
            replierUsername: this.state.replyData.replierUsername,
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

        /*
                 TODO:
                */

        //get reply count first from calling async function
        this.getReplyCount();

        //increase replyCount in Db
        await Firebase.firestore()
          .collection('comments')
          .doc(this.state.replyData.postID)
          .collection('comments')
          .doc(this.state.replyData.commentID)
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
        await Firebase.firestore()
          .collection('globalPosts')
          .doc(this.state.postID)
          .set({
            commentsCount: this.state.commentsCount + 1,
          }, { merge: true })
          .catch((error) => {
                      console.error("Error writing document to user posts: ", error);
                  });


        //Send notification that user has replied to comment
        if (this.state.replyData.replyingToUID != this.state.currentUser) {
          Firebase.firestore()
            .collection('users')
            .doc(this.state.replyData.replyingToUID)
            .collection('notifications')
            .add({
              type: 6,
              senderUID: this.state.currentUser,
              recieverUID: this.state.replyData.replyingToUID,
              postID: this.state.postID,
              read: false,
              date_created: new Date(),
              recieverToken: '',
            })
            .then(docref => this.setState({ notificationUID: docref.id }))
            .catch((error) => {
                                console.error("Error writing document to user posts: ", error);
                            });

          const sendCommentReplyNotification = Firebase.functions().httpsCallable('sendCommentReplyNotification');
          sendCommentReplyNotification({
            type: 3,
            senderUID: this.state.currentUser,
            recieverUID: this.state.replyData.replyingToUID,
            postID: this.state.postID,
            senderUsername: this.props.user.username,
          })
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        else {

        }
      }
    }


    writeToUserNotifications = async() => {
      if (this.state.commentorUID != this.state.posterUID) {
        await Firebase.firestore()
          .collection('users')
          .doc(this.state.posterUID)
          .collection('notifications')
          .add({
            type: 1,
            senderUID: this.state.commentorUID,
            recieverUID: this.state.posterUID,
            postID: this.state.postID,
            read: false,
            date_created: new Date(),
            recieverToken: '',
          })
          .then(docref => this.setState({ notificationUID: docref.id }))
          .catch((error) => {
                console.error("Error writing document to user posts: ", error);
            });

        const writeNotification = Firebase.functions().httpsCallable('writeNotification');
        writeNotification({
          type: 1,
          senderUID: this.state.commentorUID,
          recieverUID: this.state.posterUID,
          postID: this.state.postID,
          senderUsername: this.state.commentorUsername,
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

    removeFromUserNotifications = async() => {
      await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .collection('notifications')
        .doc(this.state.notificationUID)
        .delete()
        .catch((error) => {
          console.error('Error writing document to user posts: ', error);
        });
    }

    render() {
      //check replyTo then set to commentText


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
                    placeholder=" Add a comment..."
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

export default connect(mapStateToProps)(CommentComponent);
