import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Alert , ActivityIndicator} from 'react-native'
import Firebase from '../../../firebase'
import { connect } from 'react-redux';
import { clearUser } from '../../../redux/app-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';

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

//We add comments 
class CommentComponent extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            commentorUID: Firebase.auth().currentUser.uid,
            commentorUsername: this.props.user.username,
            postID: this.props.postID,
            posterUID: " ",
            posterUsername:"",
            commentText: this.props.textValue,
            commentUID: " ",
            commentsCount: 0,
            userCommentsCount: 0,
            isLoading:false,
            replyingTo: "",

        }
        
    }

    //Do this every time the component mounts
    //----------------------------------------------------------
    componentDidMount() {
        this.getPosterUID()

    }

    componentDidUpdate(prevProps){
        if(this.props.textValue !== prevProps.textValue){
            this.setState({textValue:this.props.textValue});
        } 
    }
 
    updateCommentCount = async() => {
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    commentsCount: doc.data().commentsCount
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));

    }

    //Get the poster userID
    getPosterUID = async() => {
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    posterUID: doc.data().uid,
                    commentsCount: doc.data().commentsCount
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));

        //Get the comments count of a user, how many comments they have posted
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.commentorUID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    userCommentsCount: doc.data().commentsCount
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));


    }

    //First, find the post that we are referring to "posts"/posterID/"posts"/postID/"comments"/commentUID->commentorUID
    //Create a comment in the right place and add the information we need, which are just the comment details
    //Add loading, text validation, and a small popup at the bottom that says comment successfully added or something.
    //Also look into comment replies etc
    addCommentToDB = async() => {

        if (this.state.commentText.trim().length == 0 || this.state.commentText.trim() == "") {
            Alert.alert(
                'no empty comments!',
                'please type something to comment',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
              );
              return
        } 
        else {
            this.setState({isLoading:true});
            Analytics.logEvent("User_Posted_Comment")


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
                replyingToUID: "",
                date_created: new Date(),
            })
            .then(() => this.setState ({ commentText: " "}))
            .then(() => this.writeToUserNotifications())
            .catch(function(error) {
                console.error("Error storing and retrieving image url: ", error);
            });
            

            

            await Firebase.firestore()
            .collection('globalPosts')
            .doc(this.state.postID)
            .set ({
                commentsCount: this.state.commentsCount + 1
            }, { merge: true })
            .catch(function(error) {
                console.error("Error writing document to user posts: ", error);
            });
            
            await Firebase.firestore()
            .collection('users')
            .doc(this.state.commentorUID)
            .set ({
                commentsCount: this.state.userCommentsCount + 1
            }, { merge: true })
            .then(() =>
                this.setState ({
                    userCommentsCount: this.state.userCommentsCount + 1,
                    isLoading:false
                })
            ).then(() => this.updateCommentCount())
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
                recieverToken: ""
            })
            .then((docref) => this.setState({notificationUID: docref.id}))
            .catch(function(error) {
                console.error("Error writing document to user posts: ", error);
            });

            const writeNotification = Firebase.functions().httpsCallable('writeNotification');
                writeNotification({ 
                    type: 1,
                    senderUID: this.state.commentorUID,
                    recieverUID: this.state.posterUID,
                    postID: this.state.postID,
                    senderUsername: this.state.commentorUsername
                })
                .then((result) => {
                    console.log(result)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            return
        }
    }

    removeFromUserNotifications = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .collection('notifications')
        .doc(this.state.notificationUID)
        .delete()
        .catch(function(error) {
            console.error("Error writing document to user posts: ", error);
        });
    }

    render() {
        //Allow a user to post a comment. First, take a text input, then submit it with the comment button. 
        if(this.state.isLoading) {
            return (
                <View style={styles.inputBox}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View
                    style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center', paddingBottom: 30 }}>

                    <TextInput
                        style={styles.inputBox}
                        value={this.state.commentText}
                        onChangeText={commentText => {
                            console.log(this.state.commentText);
                            this.setState({ commentText })
                        }}
                        placeholder='Add a comment...'
                        autoCapitalize='none'
                        autoCorrect={false}
                        multiline={true}
                        maxLength={400}
                    />

                    <TouchableOpacity onPress={() => { this.addCommentToDB() }}> 
                        <MaterialCommunityIcons name="message" size={30} color="white" />
                        
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        )
       
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        width: '80%',
        margin: 10,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderWidth: 1,
        // textAlign: 'center',
        color: '#FFFFFF'
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentComponent);