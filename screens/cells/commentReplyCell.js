import React, { useState } from 'react';
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Button } from 'react-native';
import TimeAgo from 'react-native-timeago';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../firebase';
import CommentUserComponent from './CFCcomponents/userCommentComponent';
import CommentLikeComponent from './CFCcomponents/likeComponent';
import CommentReplyLikeComponent from './CRCcomponents/comRepLike';
import CommentDeleteComponent from './CFCcomponents/deleteComponent';
import ReplyCommentComponent from './CRCcomponents/commentReplyComponent';


//TODO
//Comment reply like component
//Comment reply delete component
//Comment reply reply component


const CommentReplyCellClass = (props) => {
  const { user, route, navigation} = props;
   // replierUsername: if I reply to a reply this is the author of who I am replying to
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteComponent, setShowDeleteComponent] = useState(false);

  const storeReplyData = async(value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('replyData', jsonValue);
    } catch (e) {
      // saving error
    }
  };


  const storeReplyTo = async(value) => {
    try {
      await AsyncStorage.setItem('replyTo', value);
    } catch (e) {
      // saving error
      console.log("Error storing replyTo value...");
    }
  };

    const replyData = {
      commentID: props.commentID,
      topCommentID: props.topCommentID,
      postID: props.postID,
      replierAuthorUID: props.replierAuthorUID,
      replierUsername: props.replierUsername,
      replyingToUID: props.replyingToUID,
      replyingToUsername: props.replyingToUsername,
    };
    storeReplyData(replyData);

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

          <View style={styles.lineStyle} />

          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <CommentUserComponent
              key={props.commentID}
              posterUID={props.replierAuthorUID}
              navigation={navigation}
            />

            <View style={styles.timeContainer}>

              <TimeAgo style={{ color: '#696969', marginTop: 13 }} time={props.date_created} />
            </View>
          </View>


          <Text style={styles.commentTextColor}>{props.commentText}</Text>

          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <Entypo
              name="reply"
              size={22}
              color="white"
              onPress={() => {
                storeReplyTo(`${props.replierUsername}`);

              }}
            />


          </View>

          



        </View>
      );
    }

    return (


      <View style={styles.commentFeedCell}>

        <View style={styles.lineStyle} />

        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
          <CommentUserComponent
            key={props.commentID}
            posterUID={props.replierAuthorUID}
            navigation={navigation}
          />

          <View style={styles.timeContainer}>

            <TimeAgo style={{ color: '#696969', marginTop: 13 }} time={props.date_created} />

          </View>


        </View>


        <Text style={styles.commentTextColor}>{props.commentText}</Text>

        <View style={{ flexDirection:"row" }}>

        <CommentLikeComponent
            postID={props.postID}
            commentID={props.commentID}
            navigation={navigation}
          />

          <Entypo
            name="reply"
            size={22}
            style={{ paddingLeft: 12}}
            color="white"
            onPress={() => {
              storeReplyTo(`${props.replierUsername}`);
              console.log("Comment reply cell...: " + props.replierUsername);
            }}
            
          />


        </View>
      </View>

    );
  
}


const styles = StyleSheet.create({

  commentFeedCell: {
    // backgroundColor: '#3F3F41',
    // paddingTop: 10,
    backgroundColor: '#121212',
    flex: 1,
    width: Dimensions.get('window').width,
    // marginTop: 5,
    // borderBottomWidth: 1,
    borderRadius: 15,
    paddingLeft: 50,
    paddingBottom: 20,

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
    borderColor: 'white',
    width: Dimensions.get('window').width,
    marginBottom: 10,
    // marginTop: 10,
    marginLeft: 16,
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

});

export default CommentReplyCellClass;
