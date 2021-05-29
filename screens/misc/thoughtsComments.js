import React, { useState, useEffect }  from 'react';
import {  Alert, TextInput, FlatList, View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Image, Dimensions, TouchableOpacity, ActivityIndicator, Button, Modal } from 'react-native';
import TimeAgo from 'react-native-timeago';
import * as Analytics from 'expo-firebase-analytics';
import { connect, useDispatch } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, AVPlaybackStatus } from 'expo-av';
import firebase from '../../firebase';
import MiscUserComponent from '../cells/FollowCellComps/userComponent';
import CachedImage from '../image/CachedImage';
import CommentCellClass from '../cells/commentCellClass';
import CommentComponent from '../cells/TFCcomponents/commentComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});

//Comments Page, when you click the comment button on a post
const ThoughtsComments = (props) => {
  const { user, route, navigation } = props;
  const { username, image, description, postID, posterUID, viewsCount, link, mediaType } = route.params;

  const currentUser = firebase.auth().currentUser.uid;
  const [currentUsername, setCurrentUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentsArray, setCommentsArray] = useState([]);
  const [currentViewsCount, setCurrentViewsCount] = useState(0);
  const [replyTo, setReplyTo] = useState('');
  const [replyData, setReplyData] = useState({});
  const [commentText, setCommentText] = useState("");
  const commentorUID = firebase.auth().currentUser.uid;
  const commentorUsername = user.username;
  // const [posterUID, setPosterUID] = useState('');
  const [commentsCount, setCommentsCount] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [notificationUID, setNotificationUID] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    clearStorage(); 
    setReplyTo('');
    getPosterUID();
    setIsLoading(true);
    Analytics.logEvent('Thoughts_Comments_Clicked');
    Analytics.setCurrentScreen('ThoughtsCommentsScreen');


    firebase.firestore()
      .collection('users')
      .doc(currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCurrentUsername(doc.data().username);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(`username: ${username} postID: ${postID} posterUID: ${posterUID}`);

    fetchCollection();
  }, []);

  const clearReplyTo = async() => {
    try {
      const value = await AsyncStorage.removeItem('replyTo');
  
    } catch (e) {
      // error reading value
      console.log(`Error clearing replyTo: ${e}`);
    }
  };

  const clearReplyData = async() => {
    try {
      const value = await AsyncStorage.removeItem('replyData');
    } catch (e) {
      // error reading value
      console.log(`Error clearing replyData: ${e}`);
    }
  };




  const clearStorage = () => {
    clearReplyTo();
    clearReplyData();
  }

  useEffect(() => {
    
    updateCommentCount();

    const getReplyTo = async() => {
      try {
        const value = await AsyncStorage.getItem('replyTo');
        if (value !== null) {
          setCommentText(`@${value}`);
          setReplyTo(value);
        }
      } catch (e) {
        // error reading value
      }
    };
    getReplyTo();


    const getReplyData = async() => {
      try {
        const jsonValue = await AsyncStorage.getItem('replyData');
        setReplyData(JSON.parse(jsonValue));
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // error reading value
      }
    };
    getReplyData();



  }, [replyTo])

  const refresh = () => {
    setIsLoading(true);
    fetchCollection();
  };

  const addComment = () => {
    if (replyTo.length > 0) {
      addReplyComment();
      fetchCollection(); //makes it refresh after comment is added
    } else {
      addCommentToDB(); //regular comment
      fetchCollection(); //makes it refresh after comment is added
    }
  }
  
  const addReplyComment = async() => {
    //TODO: ADD error checking from addCommentToDB for blank comments
    /* Replying ot the same person multiple times does not work yet ,
      make sure wehn go back it reloads commentComponents and that should fix it
      */
    //increment replyCOunt to comments -> postId -> comments
    if (replyTo.length > 0) { //isReplying
      //Send reply
      await firebase.firestore()
        .collection('comments') // collection comments
        .doc(replyData.postID) // Which post?
        .collection('comments') //Get comments for this post
        .doc(replyData.commentID) //Get the specific comment we want to reply to
        .collection('replies') //Create a collection for said comment
        .add({ //Add to this collection, and automatically generate iD for this new comment
          postID: replyData.postID,
          commentID: replyData.commentID,
          commentText: commentText,
          replyingToUsername: replyData.replyingToUsername,
          replyingToUID: replyData.replyingToUID,
          replierAuthorUID: replyData.replierAuthorUID,
          replierUsername: replyData.replierUsername,
          date_created: new Date(),
        })
        .then(() => {
          setCommentText('')
        })
        .catch((error) => {
                  console.error("Error: ", error);
              });

              /*
               TODO:
              */

      //get reply count first from calling async function
      getReplyCount();

      //increase replyCount in Db
      await firebase.firestore()
        .collection('comments')
        .doc(replyData.postID)
        .collection('comments')
        .doc(replyData.commentID)
        .set({
          replyCount: replyCount + 1,
        }, { merge: true })
        .then(() => {
         setReplyCount(replyCount + 1);
        })
        .catch((error) => {
                    console.error("Error writing document to comments when updating replyCount: ", error);
                });

      //Update Post global CommentCount
      await firebase.firestore()
        .collection('globalPosts')
        .doc(postID)
        .set({
          commentsCount: commentsCount + 1,
        }, { merge: true })
        .catch((error) => {
                    console.error("Error writing document to user posts: ", error);
                });


      //Send notification that user has replied to comment
      //this.setState({ notificationUID: docref.id })
      if (replyData.replyingToUID != currentUser) {
        firebase.firestore()
          .collection('users')
          .doc(replyData.replyingToUID)
          .collection('notifications')
          .add({
            type: 6,
            senderUID: currentUser,
            recieverUID: replyData.replyingToUID,
            postID: postID,
            read: false,
            date_created: new Date(),
            recieverToken: '',
          })
          .then(docref => setNotificationUID(docref.id))
          .catch((error) => {
                              console.error("Error writing document to user posts: ", error);
                          });

        const sendCommentReplyNotification = firebase.functions().httpsCallable('sendCommentReplyNotification');
        sendCommentReplyNotification({
          type: 3,
          senderUID: currentUser,
          recieverUID: replyData.replyingToUID,
          postID: postID,
          senderUsername: user.username,
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


  const addCommentToDB = async() => {
    if (commentText.trim().length == 0 || commentText.trim() == '') {
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
      setIsLoading(true);
      Analytics.logEvent('User_Posted_Comment');

      //Replying to a comment



      //This should take us to the right place, adding a temp uid where we need it
      await firebase.firestore()
        .collection('comments')
        .doc(postID)
        .collection('comments')
        .add({
          commentorUID: commentorUID,
          commentText: commentText,
          commentorUsername: commentorUsername,
          commentLikes: 0,
          replyingToUID: '',
          date_created: new Date(),
        })
        .then(() => setCommentText(' '))
        .then(() => writeToUserNotifications())
        .catch((error) => {
              console.error("Error storing and retrieving image url: ", error);
          });


      await firebase.firestore()
        .collection('globalPosts')
        .doc(postID)
        .set({
          commentsCount: commentsCount + 1,
        }, { merge: true })
        .catch((error) => {
              console.error("Error writing document to user posts: ", error);
          });
//MAY be wrong with {} function 
/** 
 * this.setState({
            userScore: this.state.userScore + 1,
            isLoading: false,
          })
 */
      await firebase.firestore()
        .collection('users')
        .doc(commentorUID)
        .set({
          score: userScore + 1,
        }, { merge: true })
        .then(() => {
          setUserScore(userScore + 1);
          setIsLoading(false);
        },)
.then(() => updateCommentCount());
    }
  }
      //Get the poster userID
      const getPosterUID = async() => {
        await firebase.firestore()
          .collection('globalPosts')
          .doc(postID)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setPosterUID(doc.data().uid);
              setCommentsCount(doc.data().commentsCount);
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          });
  
        //Get the comments count of a user, how many comments they have posted
        await firebase.firestore()
          .collection('users')
          .doc(commentorUID)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setUserScore(doc.data().score)
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          });
      }

      const updateCommentCount = async() => {
        await firebase.firestore()
          .collection('globalPosts')
          .doc(postID)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setCommentsCount(doc.data().commentsCount);
            } else {
              // doc.data() will be undefined in this case
              console.log('No such document!');
            }
          });
      }

       //get number of replies associated with the comment
   const getReplyCount = async() => {
      await firebase.firestore()
        .collection('comments')
        .doc(postID)
        .collection('comments')
        .doc(replyData.commentID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setReplyCount(doc.data().replyCount);
          } else {
            console.log('No such document for getting replyCount.');
          }
        });
    }


    const writeToUserNotifications = async() => {
      if (commentorUID != posterUID) {
        await firebase.firestore()
          .collection('users')
          .doc(posterUID)
          .collection('notifications')
          .add({
            type: 1,
            senderUID: commentorUID,
            recieverUID: posterUID,
            postID: postID,
            read: false,
            date_created: new Date(),
            recieverToken: '',
          })
          .then(docref => setNotificationUID(docref.id ))
          .catch((error) => {
                console.error("Error writing document to user posts: ", error);
            });

        const writeNotification = firebase.functions().httpsCallable('writeNotification');
        writeNotification({
          type: 1,
          senderUID: commentorUID,
          recieverUID: posterUID,
          postID: postID,
          senderUsername: commentorUsername,
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



  const setViewsCount = async() => {
    await firebase.firestore()
      .collection('thoughts')
      .doc(postID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCurrentViewsCount(doc.data().viewsCount);
        }
      })
      .catch((error) => {
        console.log('issue with views count');
      });

    await firebase.firestore()
      .collection('thoughts')
      .doc(postID)
      .set({
        viewsCount: currentViewsCount + 1,
      }, { merge: true });
  };

  //   const setViewsCountPartTwo = async() => {
  //     await firebase.firestore()
  //     .collection('globalPosts')
  //     .doc(postID)
  //     .set({
  //       viewsCount: currentViewsCount + 1,
  //     }, { merge: true });
  //   }

  const fetchCollection = async() => {
    const tempCommentsArray = [];

    await firebase.firestore()
      .collection('comments')
      .doc(postID)
      .collection('comments')
      .orderBy('date_created', 'asc')
      .get()
      .then((doc) => {
        doc.forEach((res) => {
          const {
            commentLikes,
            commentText,
            commentorUID,
            commentorUsername,
            date_created,
            replyCount } = res.data();

          tempCommentsArray.push({
            key: res.id,
            commentLikes,
            commentText,
            commentorUID,
            commentorUsername,
            date_created,
            replyCount,

          });
        });

        setCommentsArray(tempCommentsArray);
        setIsLoading(false);
      })
      .catch(() => console.log('issue with comments'));
  };

  const renderImageOrVideo = () => (
    <View>
      { mediaType === 'image' ? (
        <TouchableOpacity onPress={() => openImageModal()}>
          <View style={styles.thumbnailContainer}>

            <CachedImage
              source={{ uri: `${image}` }}
              cacheKey={`${image}t`}
              backgroundColor="transparent"
              style={styles.thumbnail}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.thumbnailContainer}>
          <Video
            source={{ uri: image }}
            style={styles.thumbnail}
            isLooping
            useNativeControls
            // shouldPlay
          />
        </View>
      ) }
    </View>
  );

  const renderListHeader = () => {
    if (isLoading) {
      return (
        <View style={styles.noCommentsContainer}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <View style={getContainerStyle()}>

        {/* <Modal
          isVisible={modalOpen}
          animationIn="fadeIn"
          onSwipeComplete={() => closeImageModal()}
          swipeDirection="down"
        >

          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            <CachedImage
              source={{ uri: `${image}` }}
              cacheKey={`${image}t`}
              backgroundColor="transparent"
              style={styles.fullScreenImage}
            />
          </View>
        </Modal> */}

        <View>

          <View style={{ flexDirection: 'column', paddingTop: 10, paddingLeft: 4 }}>
            <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
              <MiscUserComponent uid={posterUID} navigation={navigation} />
            </View>


          </View>
        </View>

        <View style={styles.descriptionContainer}>

          <Text style={styles.descriptionText}>
            {description}
          </Text>

        </View>

        { mediaType === 'none' ? <View /> : (
          renderImageOrVideo()
        ) }

        {/* { this.renderCellComponents() } */}

      </View>
    );
  };

  const openImageModal = () => {
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setModalOpen(false);
  };

  const getContainerStyle = () => {
    if (commentsArray.length === 0) {
      return {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#000000',
        color: '#000000',
        height: Dimensions.get('window').height,
      };
    }
    return {
      paddingTop: 20,
      paddingBottom: 20,
      backgroundColor: '#000000',
    };
  };


  const renderItem = ({ item }) => (

    <CommentCellClass
      key={item.key}
      commentLikes={item.commentLikes}
      commentText={item.commentText}
      commentorUID={item.commentorUID}
      commentorUsername={item.commentorUsername}
      navigation={navigation}
      date_created={item.date_created.toDate()}
      commentID={item.key}
      postID={postID}
      replyCount={item.replyCount}
      button={(
        <TouchableOpacity
          onPress={() => {
            //just set state of replyTo in componentUpdate from async storage
            //StoreReplyTo
            const storeReplyTo = async(value) => {
              try {
                await AsyncStorage.setItem('replyTo', value);
              } catch (e) {
                // saving error
              }
            };

            storeReplyTo(`${item.commentorUsername}`);
            setReplyTo(`${item.commentorUsername}`);

            //sotre who to reply to
            const replyDataObj = {
              postID: `${postID}`, //post the comment I am replying to
              commentID: `${item.key}`, //Id of the comment I am replying to
              replyingToUsername: `${item.commentorUsername}`,
              replyingToUID: `${item.commentorUID}`, //person who made the comment I am replying to
              replierAuthorUID: `${currentUser}`, //person sending the reply
              replierUsername: `${username}`,
              commentLikes: 0,
              //may need to change
            };
            console.log(replyDataObj);

            //replyData that will be stored in the DB
            const storeReplyData = async(value) => {
              try {
                const jsonValue = JSON.stringify(value);
                await AsyncStorage.setItem('replyData', jsonValue);
              } catch (e) {
                // saving error
              }
            };
            setReplyData(replyDataObj);
            storeReplyData(replyDataObj);
          }}
        >

          <View style={{ paddingLeft: 15, paddingRight: 15 }}>

            <Entypo name="reply" size={22} color="white" />

          </View>
        </TouchableOpacity>
)}
    />
  );

  return (
    <View style={{ backgroundColor: '#000000' }}>

      <FlatList
        data={commentsArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)} //keyExtractor={item => item.key}
        ListHeaderComponent={renderListHeader()}
        contentContainerStyle={{ paddingBottom: Dimensions.get('window').height }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={isLoading}
      />

      <KeyboardAvoidingView
        style={styles.commentFooter}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        {/* <CommentComponent postID={postID} replyTo={replyTo} replyData={replyData} /> */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View
                style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'center', paddingBottom: 15, marginBottom: 15 }}
              >

                <TextInput
                    style={styles.inputBox}
                    value={commentText}
                    onChangeText={(commentText) => {
                        setCommentText(commentText);
                      }}
                    placeholder=" Add a comment..."
                    placeholderTextColor="#696969"
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                    maxLength={400}
                  />

                <TouchableOpacity onPress={() => {addComment() }}>
                    <MaterialCommunityIcons name="message" size={30} color="white" />
                  </TouchableOpacity>
              </View>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>

  );
};


const styles = StyleSheet.create({

  container: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#000000',
    color: '#000000',
  },
  noCommentsContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#000000',
    color: '#000000',
    height: Dimensions.get('window').height,
  },
  tradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignContent: 'center',
    color: '#FFFFFF',
    // paddingTop: 20
  },
  regularText: {
    fontSize: 18,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  regularTradeText: {
    fontSize: 20,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  gainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00cc00',
  },
  lossText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cc0000',
  },
  yoloText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  textContainer: {
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#000000',
  },
  pnlContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    // backgroundColor: '#121212'
  },
  securityContainer: {
    alignContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,

  },
  descriptionContainer: {
    alignItems: 'flex-start',
    paddingLeft: 22,
    padding: 10,
    backgroundColor: '#000000',
  },
  timeContainer: {
    paddingLeft: 25,
    // color: '#FFFFFF',
    // backgroundColor: '#FFFFFF'
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 22,
    marginRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  thumbnail: {
    width:  Dimensions.get('window').width - 50,
    height: 300,
    borderRadius: 15,
    margin: 20,
  },
  descriptionText: {
    fontSize: 15,
    color: '#FFFFFF',
    alignContent: 'center',
    paddingRight: 10,
  },
  fullScreenImage: {
    width:  Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  noCommentsFooter: {
    width: Dimensions.get('window').width,
    color: '#fff',
    backgroundColor: '#000000',
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 50,
  },
  commentFooter: {
    width: Dimensions.get('window').width,
    color: '#fff',
    backgroundColor: '#000000',
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 20,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'white',
    width: Dimensions.get('window').width,
    marginTop: 15,
    // margin: 10
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

export default connect(mapStateToProps)(ThoughtsComments);
