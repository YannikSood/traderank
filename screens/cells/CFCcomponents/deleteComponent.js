import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Firebase from '../../../firebase'
import { connect } from 'react-redux';
import { clearUser } from '../../../redux/app-redux';
import { Ionicons } from '@expo/vector-icons';

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: (temp) => { dispatch(clearUser(temp))}
     };
}

class CommentDeleteComponent extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            commentorUID: Firebase.auth().currentUser.uid,
            postID: this.props.postID,
            commentID: this.props.commentID,
            currentCommentCount: 0,
            posterUID: " ",
            userLikesCount: 0,
            replyCount: 0
        }
        
    }

    componentDidMount() {
        this.getCurrentCommentsCount()
        this.getReplyCount();
    }
    componentDidUpdate(){
        this.getCurrentCommentsCount();
        this.getReplyCount();
    }

    getCurrentCommentsCount = async() => {
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    currentCommentCount: doc.data().commentsCount
                })
                // console.log(this.state.currentCommentCount)
                // console.log(this.state.postID)
            }
        }.bind(this))
    }
    //count of reply ocunt 
    getReplyCount = async() => {
        await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.commentID) 
        .get()
        .then(function(doc){
            if(doc.exists){
                this.setState({
                    replyCount: doc.data().replyCount
                })
            } else{
                console.log("No such document for getting replyCount.");
            }
        }.bind(this));
    }

    //Lower comment count in global post
    //SOme fucking issue here that I cant sort out
    lowerCommentCountGlobalPosts = async() => {
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .set ({
            commentsCount: this.state.currentCommentCount - this.state.replyCount - 1
        }, { merge: true })
        .then(() => {
            this.setState({currentCommentsCount: this.state.currentCommentCount - this.state.replyCount - 1});
        })
        .catch(function(error){
            console.error("Error lowering global comment count", error);
        })
        
    }


    //Delete comment itself from comments/postid/comment
    deleteCommentFromCommentsDB = async() => {
        await Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .doc(this.state.commentID)
        .delete()
        .then(() => this.lowerCommentCountGlobalPosts())
        .catch(function(error) {
            console.error("Error writing document to user posts: ", error);
        })
        
    }

    render() {
        //If the post is liked, show the filled in heart with the number of likes beside it. 
        //Connected to "Unlike" functionality
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                            this.deleteCommentFromCommentsDB()
                        }}> 
                         <Ionicons name="md-trash" size={19} color="white" />
                        
                    </TouchableOpacity>
                    <Text>  {this.state.commentLikes}</Text>
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
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentDeleteComponent);