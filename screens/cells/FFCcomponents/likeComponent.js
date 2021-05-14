import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import Firebase from '../../../firebase';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


class LikeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likerUID: Firebase.auth().currentUser.uid,
      likerUsername: this.props.user.username, //<------------------ Issue is here
      postID: this.props.postID,
      isAlreadyLiked: false,
      likesCount: 0,
      posterUID: ' ',
      notificationUID: '',
      isLoading: false,
    };
  }

  //Do this every time the component mounts
  //----------------------------------------------------------
  componentDidMount() {
    this.setState({ isLoading: true });
    this.hasLiked();
    this.getLikeCount();
    this.getPosterUID();
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
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        });
    }

    //Check to see if a user has liked a post
    hasLiked = async() => {
      await Firebase.firestore()
        .collection('users')
        .doc(this.state.likerUID)
        .collection('likes')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              isAlreadyLiked: true,
              isLoading: false,
            });
          } else {
            // doc.data() will be undefined in this case
            this.setState({
              isAlreadyLiked: false,
              isLoading: false,
            });
          }
        });
    }


    //Update the likes numerically in database
    //----------------------------------------------------------
    //Get the like count for initialization purposes upon mounting. Set likesCount to what the globalPosts ref says.
    getLikeCount = async() => {
      await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              likesCount: doc.data().likesCount,
            });
          } else {
            // doc.data() will be undefined in this case, so this wont even come up honestly
            console.log('No such document!');
          }
        });
    }

    //Add to like count, for both the global and user post references
    addToLikeCount = async() => {
      Analytics.logEvent('Post_Liked');
      await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .set({
          likesCount: this.state.likesCount + 1,
        }, { merge: true })
        .then(() => this.setState({
          likesCount: this.state.likesCount + 1,
          isLoading: false,
        }));
    }

    subtractFromLikeCount = async() => {
      await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .set({
          likesCount: this.state.likesCount - 1,
        }, { merge: true })
        .then(() => this.setState({
          likesCount: this.state.likesCount - 1,
          isLoading: false,
        }));
    }

    //Add to the likes lists in the database
    //----------------------------------------------------------
    //We now have all 3 variables. Time to start adding to the database. First, we add User1 to the global and post "likes" collection
    addToLikesDB = async() => {
      this.setState({ isLoading: true });
      await Firebase.firestore()
        .collection('likes')
        .doc(this.state.postID)
        .collection('likes')
        .doc(this.state.likerUID)
        .set({
          username: this.state.likerUsername,
        })
        .catch((error) => {
          console.error('Error writing document to user posts: ', error);
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
        .collection('likes')
        .doc(this.state.postID)
        .set({
          username: this.state.likerUsername,
        })
        .catch((error) => {
          console.error('Error writing document to user posts: ', error);
        });
    }

    //Remove from the likes lists in the database
    //----------------------------------------------------------
    //Unlike functionality. Delete the document from the post likes collection
    removeFromLikedDB = async() => {
      this.setState({ isLoading: true });
      await Firebase.firestore()
        .collection('likes')
        .doc(this.state.postID)
        .collection('likes')
        .doc(this.state.likerUID)
        .delete()
        .catch((error) => {
          console.error('Error writing document to user posts: ', error);
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
        .collection('likes')
        .doc(this.state.postID)
        .delete()
        .catch((error) => {
          console.error('Error writing document to user posts: ', error);
        });
    }

    writeToUserNotifications = async() => {
      if (this.state.likerUID != this.state.posterUID) {
        await Firebase.firestore()
          .collection('users')
          .doc(this.state.posterUID)
          .collection('notifications')
          .add({
            type: 0,
            senderUID: this.state.likerUID,
            recieverUID: this.state.posterUID,
            postID: this.state.postID,
            read: false,
            date_created: new Date(),
            recieverToken: '',
          })
          .then(docref => this.setState({ notificationUID: docref.id }))
          .catch((error) => {
            console.error('Error writing document to user posts: ', error);
          });

        const writeNotification = Firebase.functions().httpsCallable('writeNotification');
        writeNotification({
          type: 0,
          senderUID: this.state.likerUID,
          recieverUID: this.state.posterUID,
          postID: this.state.postID,
          senderUsername: this.state.likerUsername,
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
      if (this.state.isLoading) {
        return (
          <View>
                <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'center', paddingLeft: 5, paddingBottom: 15 }}
                  >

                    <ActivityIndicator size="small" color="#9E9E9E" />

                  </TouchableOpacity>
              </View>

        );
      }
      //If the post is liked, show the filled in heart with the number of likes beside it.
      //Connected to "Unlike" functionality
      if (this.state.isAlreadyLiked) {
        return (
          <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity onPress={() => {
                    this.removeFromLikedDB();
                  }}
                  >
                    <Ionicons name="ios-heart" size={26} color="#00cc00" />

                  </TouchableOpacity>
                <Text style={{ color: 'white', paddingTop: 5 }}>
                    {' '}
                    {this.state.likesCount}
                                    </Text>
              </View>
        );
      }
      //If the post is not liked, show the slashed heart with the number of likes beside it.
      //Connected to "Like" functionality

      return (
        <View style={{ flexDirection: 'row',  color: 'FFFFFF'}}>
                <TouchableOpacity
                    style={{ color: '#FFFFFF' }}
                    onPress={() => {
                        this.addToLikesDB();
                      }}
                  >
                    <Ionicons name="ios-heart" size={26} color="white" />

                  </TouchableOpacity>
                <Text style={{ color: 'white', paddingTop: 5 }}>
                    {' '}
                    {this.state.likesCount}
                                    </Text>
              </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps)(LikeComponent);
