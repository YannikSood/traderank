import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import firebase from '../../../firebase'
import { clearUser } from '../../../redux/app-redux';
import { Ionicons } from '@expo/vector-icons';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


class CommentReplyDeleteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentorUID: firebase.auth().currentUser.uid,
      postID: this.props.postID,
      commentID: this.props.commentID, //Top level comment ID
      commentReplyID: this.props.commentReplyID, //Sub level comment ID
      currentCommentCount: 0,
      posterUID: ' ',
    };
  }

  componentDidMount() {
    this.getCurrentCommentsCount();
  }

  componentDidUpdate() {
    this.getCurrentCommentsCount();
  }

    getCurrentCommentsCount = async() => {
      await firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState ({
                    currentCommentCount: doc.data().commentsCount
                })
                // console.log(this.state.currentCommentCount)
                // console.log(this.state.postID)
            }
        });
    }

    //Lower comment count in global post
    //SOme fucking issue here that I cant sort out
    lowerCommentCountGlobalPosts = async() => {
      await firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .set({
          commentsCount: this.state.currentCommentCount - 1,
        }, { merge: true });
    }


    //Delete comment itself from comments/postid/comment
    deleteCommentFromCommentsDB = async() => {
      await firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.commentID)
        .delete()
        .then(() => this.lowerCommentCountGlobalPosts())
        .catch((error) => {
            console.error("Error writing document to user posts: ", error);
        });
    }

    render() {
      //If the post is liked, show the filled in heart with the number of likes beside it.
      //Connected to "Unlike" functionality
      return (
              <View style={styles.container}>
                  <TouchableOpacity onPress={() => {
                      this.deleteCommentFromCommentsDB();
                    }}
                    >
                      <Ionicons name="md-trash" size={19} color="white" />

                    </TouchableOpacity>
                  <Text>  
{' '}
{this.state.commentLikes}
</Text>
                </View>
      );
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

export default connect(mapStateToProps)(CommentReplyDeleteComponent);
