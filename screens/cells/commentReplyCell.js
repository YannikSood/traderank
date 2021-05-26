import React, { useState } from 'react';
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Button } from 'react-native';
import TimeAgo from 'react-native-timeago';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../firebase';
import CommentUserComponent from './CFCcomponents/userCommentComponent';
import CommentReplyLikeComponent from './CRCcomponents/comRepLike';
import CommentDeleteComponent from './CFCcomponents/deleteComponent';
import ReplyCommentComponent from './CRCcomponents/commentReplyComponent';


//TODO
//Comment reply like component
//Comment reply delete component
//Comment reply reply component


class CommentReplyCellClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      commentID: this.props.commentID,
      topCommentID: this.props.topCommentID,
      commentText: this.props.commentText,
      date_created: this.props.date_created,
      postID: this.props.postID,
      replierAuthorUID: this.props.replierAuthorUID,
      replierUsername: this.props.replierUsername, //if I reply to a reply this is the author of who I am replying to
      replyingToUID: this.props.replyingToUID,
      replyingToUsername: this.props.replyingToUsername,
      showDeleteComponent: false,
      isReplying: false,
      // button: this.props.button,
    };
  }

  componentDidMount() {
      // if (this.state.replierAuthorUID == firebase.auth().currentUser.uid) {
      //     this.setState({ showDeleteComponent: true })
      // }
  }


  render() {
    const replyData = {
      commentID: this.props.commentID,
      topCommentID: this.props.topCommentID,
      postID: this.props.postID,
      replierAuthorUID: this.props.replierAuthorUID,
      replierUsername: this.props.replierUsername,
      replyingToUID: this.props.replyingToUID,
      replyingToUsername: this.props.replyingToUsername,
    };
    if (this.state.isLoading) {
      return (
        <View style={styles.commentFeedCell}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    if (this.state.showDeleteComponent) {
      return (
        <View style={styles.commentFeedCell}>

          <View style={styles.lineStyle} />

          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <CommentUserComponent
              key={this.state.commentID}
              posterUID={this.state.replierAuthorUID}
              navigation={this.props.navigation}
            />

            <View style={styles.timeContainer}>

              <TimeAgo style={{ color: '#696969', marginTop: 13 }} time={this.state.date_created} />

            </View>
          </View>


          <Text style={styles.commentTextColor}>{this.state.commentText}</Text>

          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <Entypo
              name="reply"
              size={22}
              color="white"
              onPress={() => {
                this.setState({ isReplying: true });
              }}
            />


          </View>
          
          {this.state.isReplying 
                                && <ReplyCommentComponent replyData={replyData} />

                        }


          {/* <View style={{flexDirection: 'row'}}>
                            <CommentReplyLikeComponent
                                postID={this.state.postID}
                                commentID= {this.state.topCommentID} //Top level comment ID
                                commentReplyID= {this.state.commentID} //Sub level comment ID
                                navigation={this.props.navigation}
                            />

                            <CommentDeleteComponent
                                postID={this.state.postID}
                                commentID={this.state.commentID}
                                navigation={this.props.navigation}
                            />


                        </View> */}


        </View>
      );
    }

    return (


      <View style={styles.commentFeedCell}>

        <View style={styles.lineStyle} />

        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
          <CommentUserComponent
            key={this.state.commentID}
            posterUID={this.state.replierAuthorUID}
            navigation={this.props.navigation}
          />

          <View style={styles.timeContainer}>

            <TimeAgo style={{ color: '#696969', marginTop: 13 }} time={this.state.date_created} />

          </View>


        </View>


        <Text style={styles.commentTextColor}>{this.state.commentText}</Text>

        <View style={{ paddingLeft: 20, paddingRight: 15 }}>


          <Entypo
            name="reply"
            size={22}
            color="white"
            onPress={() => {
              this.setState({ isReplying: true });
              const storeReplyTo = async(value) => {
                try {
                  await AsyncStorage.setItem('replyTo', value);
                } catch (e) {
                  // saving error
                }
              };
  
              storeReplyTo(`${this.props.replierUsername}`);
              console.log("Comment reply cell...: " + this.props.replierUsername);
            }}
            
          />


        </View>


        {this.state.isReplying
                               && <ReplyCommentComponent replyData={replyData} />
                        }


        {/* <View style={{flexDirection: 'row'}}>

                            <CommentReplyLikeComponent
                                postID={this.state.postID}
                                commentID= {this.state.topCommentID} //Top level comment ID
                                commentReplyID= {this.state.commentID} //Sub level comment ID
                                navigation={this.props.navigation}
                            />
                        </View> */}


      </View>

    );
  }
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
