import React, { useState, useEffect } from 'react';
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import TimeAgo from 'react-native-timeago';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../firebase';
import CommentUserComponent from './CFCcomponents/userCommentComponent';
import CommentLikeComponent from './CFCcomponents/likeComponent';
import CommentDeleteComponent from './CFCcomponents/deleteComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentIconComponent from './FFCcomponents/commentIconComponent';
import CommentReplyCellClass from './commentReplyCell'; 
import { Entypo } from '@expo/vector-icons';

const CommentCellClass = ({ commentLikes, commentText, commentorUID, commentorUsername, date_created, commentID, postID, button, replyCount, navigation, extraData }) => {
//   const { commentLikes, commentText, commentorUID, commentorUsername, date_created, commentID, postID, button, replyCount, navigation } = props.params;


  const [isLoading, setIsLoading] = useState(false);
  const currentUser = firebase.auth().currentUser.uid;
  const [showDeleteComponent, setShowDeleteComponent] = useState(false);
  const [repliesArray, setRepliesArray] = useState([]);
  const [hasReplies, setHasReplies] = useState(false);


  useEffect(() => {
    // setIsLoading(true);
    if (commentorUID === firebase.auth().currentUser.uid) {
      setShowDeleteComponent(true);
    }
    getFirstFiveReplies();
  }, []);


  const getFirstFiveReplies = async() => {
    setIsLoading(true);

    let tempRepliesArray = [];
    await firebase.firestore()
      .collection('comments') // collection comments
      .doc(postID) // Which post?
      .collection('comments') //Get comments for this post
      .doc(commentID) //Get the specific comment we want to reply to
      .collection('replies') //Create a collection for said comment
      .orderBy('date_created', 'asc')
      .onSnapshot((response) => {
        tempRepliesArray = [];

        response.forEach((res) => {
          const {
            commentID, //TODO: needs to be changed to id
            commentText,
            date_created,
            postID,
            replierAuthorUID,
            replierUsername,
            replyingToUID,
            replyingToUsername,
          } = res.data();
          tempRepliesArray.push({
            key: res.id,
            id: res.id,
            commentText,
            date_created,
            postID,
            replierAuthorUID,
            replierUsername,
            replyingToUID,
            replyingToUsername,
          });
        });

        //console.log(repliesArray)

        if (repliesArray.length > 0) {
          setRepliesArray(tempRepliesArray);
          setHasReplies(true);
          setIsLoading(false);
        } else {
          setRepliesArray(tempRepliesArray);
          setHasReplies(false);
          setIsLoading(false);
        }
      });
  };
  const renderItem = ({ item }) => (

    <CommentReplyCellClass
      commentID={item.key} //refers to the reply comment, id not the top level comment id
      topCommentID={commentID}
      commentText={item.commentText}
      date_created={item.date_created.toDate()}
      postID={item.postID}
      replierAuthorUID={item.replierAuthorUID}
      replierUsername={item.replierUsername}
      replyingToUID={item.replyingToUID}
      replyingToUsername={item.replyingToUsername}
      navigation={navigation}
      button={(
        <TouchableOpacity
          onPress={() => {
            //just set state of replyTo in componentUpdate from async storage
            //StoreReplyTo
            const storeReplyTo = async (value) => {
              try {
                await AsyncStorage.setItem('replyTo', value);
              } catch (e) {
                // saving error
              }
            };

            storeReplyTo(`${item.replierUsername}`);
            console.log(`${item.replierUsername} from commentCellClass`);
            // setReplyTo(`${item.replierUsername}`);

            // //sotre who to reply to
            const replyDataObj = {
              postID: `${postID}`, //post the comment I am replying to
              commentID: `${item.key}`, //Id of the comment I am replying to
              replyingToUsername: `${item.replyingToUsername}`,
              replyingToUID: `${item.replyingToUID}`, //person who made the comment I am replying to
              replierAuthorUID: `${item.replierAuthorUID}`, //person sending the reply
              replierUsername: `${item.replierUsername}`,
              commentLikes: 0,
              //may need to change
            };
            // console.log(replyDataObj);

            //replyData that will be stored in the DB
            const storeReplyData = async(value) => {
              try {
                const jsonValue = JSON.stringify(value);
                await AsyncStorage.setItem('replyData', jsonValue);
              } catch (e) {
                // saving error
              }
            };
           // setReplyData(replyDataObj);
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

  if (isLoading) {
    return (
      <View style={styles.commentFeedCell}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }
  if (showDeleteComponent) {
    return (
      <View style={styles.commentFeedCell}>

        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
          <CommentUserComponent
            key={commentID}
            posterUID={commentorUID}
            navigation={navigation}
          />

          <View style={styles.timeContainer}>

            <TimeAgo style={{ color: '#696969', marginTop: 13 }} time={date_created} />

          </View>
        </View>


        <Text style={styles.commentTextColor}>{commentText}</Text>

        <View style={{ flexDirection: 'row' }}>
          <CommentLikeComponent
            postID={postID}
            commentID={commentID}
            navigation={navigation}
          />

          {/* <CommentDeleteComponent
            postID={postID}
            commentID={commentID}
            navigation={navigation}
          />  */}

          {button}

          {replyCount > 0 && (
          <TouchableOpacity
            onPress={() => getFirstFiveReplies()}
            style={styles.showRepliesButton}
          >
            {!hasReplies
                                   && <CommentIconComponent postID={postID} replyCount={replyCount} />
                            }
          </TouchableOpacity>
          )}

        </View>


        {hasReplies
                    && (
                    <View style={styles.repliesList}>

                      <FlatList
                        style={{
                          flex: 1,
                          width: Dimensions.get('window').width,
                        }}
                        data={repliesArray}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => String(index)}
                        contentContainerStyle={{ paddingBottom: 25 }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                      />
                    </View>
                    )

                }


      </View>
    );
  }

  return (


    <View style={styles.commentFeedCell}>

      <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
        <CommentUserComponent
          key={commentID}
          posterUID={commentorUID}
          navigation={navigation}
        />

        <View style={styles.timeContainer}>

          <TimeAgo style={{ color: '#696969', marginTop: 13 }} time={date_created} />

        </View>


      </View>


      <Text style={styles.commentTextColor}>{commentText}</Text>

      <View style={{ flexDirection: 'row' }}>

        <CommentLikeComponent
          postID={postID}
          commentID={commentID}
          navigation={navigation}
        />

        {button}

        {replyCount > 0 && (
          <TouchableOpacity
            onPress={() => getFirstFiveReplies()}
            style={styles.showRepliesButton}
          >
            {!hasReplies
                                   && <CommentIconComponent postID={postID} replyCount={replyCount} />
                            }
          </TouchableOpacity>
        )}

      </View>


      {hasReplies
                        && (
                        <View style={styles.repliesList}>
                          <FlatList
                            style={{
                              flex: 1,
                              width: Dimensions.get('window').width,
                            }}
                            data={repliesArray}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => String(index)}
                            contentContainerStyle={{ paddingBottom: 25 }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                          />
                        </View>
                        )

                }


    </View>

  );
};

const styles = StyleSheet.create({

  commentFeedCell: {
    // backgroundColor: '#3F3F41',
    paddingTop: 10,
    backgroundColor: '#121212',
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 5,
    borderBottomWidth: 1,
    borderRadius: 15,

  },
  commentTextColor: {
    padding: 20,
    color: '#FFFFFF',
    fontSize: 15,
  },
  commentorUsername: {
    color: '#3F3F41',
    fontWeight: 'bold',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: '#696969',
    width: Dimensions.get('window').width,
    // margin: 10
  },
  timeContainer: {
    paddingLeft: 10,
    paddingTop: 1,
  },
  reply: {
    color: 'white',
    marginLeft: 10,
  },
  showRepliesButton: {
    color: '#FFFFFF',
  },
  repliesList: {
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default CommentCellClass;
