import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../../firebase'
import { clearUser } from '../../../redux/app-redux';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});

const CommentDeleteComponent = (props) => {

  const  commentorUID = firebase.auth().currentUser.uid;
  const postID = props.postID;
  const commentID = props.commentID;
  const [currentCommentCount, setCurrentCommentCount] = useState(0);
  const [posterUID, setPosterUID] = useState('');
  const [userLikesCount, setUserLikesCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);

  useEffect(() => {
    getCurrentCommentsCount();
    getReplyCount();
  },[])


   const getCurrentCommentsCount = async() => {
      await firebase.firestore()
        .collection('globalPosts')
        .doc(postID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setCurrentCommentCount(doc.data().commentsCount);
          }
        });
    }

    //count of reply ocunt
    const getReplyCount = async() => {
      await firebase.firestore()
        .collection('comments')
        .doc(postID)
        .collection('comments')
        .doc(commentID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setReplyCount(doc.data().replyCount);
          } else {
            console.log('No such document for getting replyCount.');
          }
        });
    }

    //Lower comment count in global post
    //SOme fucking issue here that I cant sort out
    const lowerCommentCountGlobalPosts = async() => {
      await firebase.firestore()
        .collection('globalPosts')
        .doc(postID)
        .set({
          commentsCount: currentCommentCount - 1,
        }, { merge: true })
        .then(() => {
          setCurrentCommentCount(currentCommentCount - 1);
        })
        .catch((error) => {
          console.error('Error lowering global comment count', error);
        });
    }


    //Delete comment itself from comments/postid/comment
   const deleteCommentFromCommentsDB = async() => {
     console.log(`Delete component before: postId ${postID} commentID: ${commentID} commentCout: ${currentCommentCount} `);
      await firebase.firestore()
        .collection('comments')
        .doc(postID)
        .collection('comments')
        .doc(commentID)
        .delete()
        .then(() => lowerCommentCountGlobalPosts())
        .catch((error) => {
          console.error('Error writing document to user posts: ', error);
        });
        console.log(`Delete component after: postId ${postID} commentID: ${commentID} commentCout: ${currentCommentCount} `);
    }


      //If the post is liked, show the filled in heart with the number of likes beside it.
      //Connected to "Unlike" functionality
      return (
        <View style={styles.container}>
                <TouchableOpacity onPress={() => {
                    deleteCommentFromCommentsDB();
                  }}
                  >
                    <Ionicons name="md-trash" size={19} color="white" />

                  </TouchableOpacity>
        </View>
      );
    
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingLeft: 15,
    paddingBottom: 10,
  },
});

export default connect(mapStateToProps)(CommentDeleteComponent);
