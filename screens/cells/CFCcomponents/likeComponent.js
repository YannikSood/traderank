import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import Firebase from '../../../firebase'

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


class CommentLikeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likerUID: Firebase.auth().currentUser.uid,
      likerUsername: this.props.user.username,
      postID: this.props.postID,
      commentID: this.props.commentID,
      isAlreadyLiked: false,
      commentLikes: 0,
      posterUID: ' ',
      userLikesCount: 0,
      notificationUID: '',
    };
  }

  //Do this every time the component mounts
  //----------------------------------------------------------
  componentDidMount() {
    this.hasLiked();
    this.getLikeCount();
    this.getPosterUID();
  }

    //Get the poster userID
    getPosterUID = async() => {
      await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.commentID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    posterUID: doc.data().replierAuthorUID
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        });

      await Firebase.firestore()
        .collection('users')
        .doc(this.state.likerUID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    userLikesCount: doc.data().likesCount
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        });
    }

    //Check to see if a user has liked a post
    hasLiked = async() => {
      await Firebase.firestore()
        .collection('users')
        .doc(this.state.likerUID)
        .collection('commentLikes')
        .doc(this.state.commentID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    isAlreadyLiked: true
                })
            } else {
                // doc.data() will be undefined in this case
                this.setState ({
                    isAlreadyLiked: false
                })
            }
        });
    }


    //Update the likes numerically in database
    //----------------------------------------------------------
    //Get the like count for initialization purposes upon mounting. Set likesCount to what the globalPosts ref says.
    getLikeCount = async() => {
      await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.commentID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    commentLikes: doc.data().commentLikes
                })
            } else {
                // doc.data() will be undefined in this case, so this wont even come up honestly
                console.log("No such document!");
            }
        });
    }

    //Add to like count, for both the global and user post references
    addToLikeCount = async() => {
      Analytics.logEvent('Comment_Liked');

      await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.commentID)
        .set({
          commentLikes: this.state.commentLikes + 1,
        }, { merge: true })
        .then(() => this.setState({
            commentLikes: this.state.commentLikes + 1,
          }),);

      await Firebase.firestore()
        .collection('users')
        .doc(this.state.likerUID)
        .set({
          likesCount: this.state.userLikesCount + 1,
        }, { merge: true })
        .then(() => this.setState({
            userLikesCount: this.state.userLikesCount + 1,
          }),);
    }

    subtractFromLikeCount = async() => {
      await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.commentID)
        .set({
          commentLikes: this.state.commentLikes - 1,
        }, { merge: true })
        .then(() => this.setState({
            commentLikes: this.state.commentLikes - 1,
          }),);

      await Firebase.firestore()
        .collection('users')
        .doc(this.state.likerUID)
        .set({
          likesCount: this.state.userLikesCount - 1,
        }, { merge: true })
        .then(() => this.setState({
            userLikesCount: this.state.userLikesCount - 1,
          }),);
    }

    //Add to the likes lists in the database
    //----------------------------------------------------------
    //We now have all 3 variables. Time to start adding to the database. First, we add User1 to the global and post "likes" collection
    addToLikesDB = async() => {
      await Firebase.firestore()
        .collection('commentLikes')
        .doc(this.state.commentID)
        .collection('commentLikes')
        .doc(this.state.likerUID)
        .set({
          username: this.state.likerUsername,
        })
        .catch((error) => {
            console.error("Error writing document to user posts: ", error);
        })
        .then(() => this.addToUserList())
        .then(() => this.setState({ isAlreadyLiked: true }))
        .then(() => this.addToLikeCount())
        .then(() => this.writeToUserNotifications());
    }

    //Under users, they have a list of all the posts they have liked, stored for future display purposes (If liked, then shown the correct logo, and vice versa)
    addToUserList = async() => {
      await Firebase.firestore()
        .collection('users')
        .doc(this.state.likerUID)
        .collection('commentLikes')
        .doc(this.state.commentID)
        .set({
          username: this.state.likerUsername,
        })
        .catch((error) => {
            console.error("Error writing document to user posts: ", error);
        });
    }

    //Remove from the likes lists in the database
    //----------------------------------------------------------
    //Unlike functionality. Delete the document from the post likes collection
    removeFromLikedDB = async() => {
      await Firebase.firestore()
        .collection('commentLikes')
        .doc(this.state.commentID)
        .collection('commentLikes')
        .doc(this.state.likerUID)
        .delete()
        .catch((error) => {
            console.error("Error writing document to user posts: ", error);
        })
        .then(() => this.removeFromUserList())
        .then(() => this.setState({ isAlreadyLiked: false }))
        .then(() => this.subtractFromLikeCount())
        .then(() => this.removeFromUserNotifications());
    }

    //Unlike functionality. Delete the document from the user likes collection
    removeFromUserList = async() => {
      await Firebase.firestore()
        .collection('users')
        .doc(this.state.likerUID)
        .collection('commentLikes')
        .doc(this.state.commentID)
        .delete()
        .catch((error) => {
            console.error("Error writing document to user posts: ", error);
        });
    }

    writeToUserNotifications = async() => {
        if (this.state.likerUID != this.state.posterUID) {
            await Firebase.firestore()
            .collection('users')
            .doc(this.state.posterUID)
            .collection('notifications')
            .add({
                type: 3,
                senderUID: this.state.likerUID,
                recieverUID: this.state.posterUID,
                postID: this.state.postID,
                read: false,
                date_created: new Date(),
                recieverToken: ""
            })
            .then((docref) => this.setState({notificationUID: docref.id}))
            .catch(function(error) {
                console.error("Error writing document to user posts: ", error);
            });

            const writeNotification = Firebase.functions().httpsCallable('writeNotification');
            writeNotification({ 
                type: 3,
                senderUID: this.state.likerUID,
                recieverUID: this.state.posterUID,
                postID: this.state.postID,
                senderUsername: this.state.likerUsername
            })
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error);
            });
        }   
        else {
            
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
            console.error("Error writing document to user posts: ", error);
        });
    }


    render() {
        //If the post is liked, show the filled in heart with the number of likes beside it. 
        //Connected to "Unlike" functionality
        if (this.state.isAlreadyLiked) {
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                            this.removeFromLikedDB()
                        }}> 
                        <Ionicons name="ios-heart" size={20} color='#00cc00' />
                        
                    </TouchableOpacity>
                    <Text style={{color: '#FFFFFF', paddingTop: 2}}>  {this.state.commentLikes}</Text>
                </View>
            )
        }
        //If the post is not liked, show the slashed heart with the number of likes beside it. 
        //Connected to "Like" functionality
        
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                            this.addToLikesDB()
                        }}> 
                        <Ionicons name="ios-heart" size={20} color="white"/>
                        
                    </TouchableOpacity>
                    <Text style={{color: '#FFFFFF', paddingTop: 2}}>  {this.state.commentLikes}</Text>
                </View>
            )
        
    }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingLeft: 25,
    paddingBottom: 10,
  },
});

export default connect(mapStateToProps)(CommentLikeComponent);
