import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Dimensions } from 'react-native'
import Firebase from '../../../firebase'
import { connect } from 'react-redux';
import { clearUser } from '../../../redux/app-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
class CommentIconComponent extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            postID: this.props.postID,
            postCommentsCount: 0

        }
        
    }

    //Do this every time the component mounts
    //----------------------------------------------------------
    componentDidMount() {
        this.getPostCommentsCount()
    }

    //Get the poster userID
    getPostCommentsCount = async() => {
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    postCommentsCount: doc.data().commentsCount
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));
    }

    render() {
        //Allow a user to post a comment. First, take a text input, then submit it with the comment button. 
        return (
            <View
                style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center', color: 'FFFFFF'}}>
                    <MaterialCommunityIcons name="message" size={30} color="white" />
                    {this.props.replyCount > 0
                        ? <Text style={{color: 'white'}}>  {this.props.replyCount} </Text>
                        :  <Text style={{color: 'white'}}>  {this.state.postCommentsCount} </Text>
                    }
                   
            </View>
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
        textAlign: 'center'
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentIconComponent);