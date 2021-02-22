import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Button } from 'react-native'
import Firebase from '../../firebase'
import CommentUserComponent from './CFCcomponents/userCommentComponent'
import CommentLikeComponent from './CFCcomponents/likeComponent'
import CommentDeleteComponent from './CFCcomponents/deleteComponent'
import TimeAgo from 'react-native-timeago';


//TODO
//Comment reply like component
//Comment reply delete component
//Comment reply reply component


class CommentReplyCellClass extends React.Component{ 
    
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            commentID: this.props.commentID,
            commentText: this.props.commentText,
            date_created: this.props.date_created,
            postID: this.props.postID,
            replierAuthorUID: this.props.replierAuthorUID,
            replierUsername: this.props.replierUsername,
            replyingToUID: this.props.replyingToUID,
            replyingToUsername: this.props.replyingToUsername,
            showDeleteComponent: false,
            // button: this.props.button,
        }
    }

    async componentDidMount() {
        if (this.state.replierAuthorUID == Firebase.auth().currentUser.uid) {
            this.setState({ showDeleteComponent: true })
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style= {styles.commentFeedCell} >
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        if (this.state.showDeleteComponent) {
            return (
                <View style={ styles.commentFeedCell }>
                    
                        <View style={{flexDirection: 'row', paddingLeft: 10}}>
                            <CommentUserComponent  
                                key={this.state.commentID}
                                posterUID={this.state.replierAuthorUID} 
                                navigation={this.props.navigation} 
                            />
                            
                            <View style={styles.timeContainer}>

                                <TimeAgo style={{color: '#696969'}} time = {this.state.date_created} />

                            </View>
                        </View>
                        

                        <Text style = {styles.commentTextColor}>{this.state.commentText}</Text>  

                        <View style={{flexDirection: 'row'}}>
                            <CommentLikeComponent  
                                postID={this.state.postID} 
                                commentID={this.state.commentID}
                                navigation={this.props.navigation} 
                            />

                            <CommentDeleteComponent  
                                postID={this.state.postID} 
                                commentID={this.state.commentID}
                                navigation={this.props.navigation} 
                            />


                        </View>
                    
                    
                </View>
            )
        }

        return (


                <View  style={ styles.commentFeedCell }>
                    
                        <View style={{flexDirection: 'row', paddingLeft: 10}}>
                            <CommentUserComponent  
                                key={this.state.commentID}
                                posterUID={this.state.replierAuthorUID} 
                                navigation={this.props.navigation} 
                            />
                            
                            <View style={styles.timeContainer}>

                                <TimeAgo style={{color: '#696969'}} time = {this.state.date_created} />

                            </View>

                            
                        </View>
                        

                        <Text style = {styles.commentTextColor}>{this.state.commentText}</Text>  

                        <View style={{flexDirection: 'row'}}>

                            <CommentLikeComponent  
                                postID={this.state.postID} 
                                commentID={this.state.commentID}
                                navigation={this.props.navigation} 
                            />
                        </View>
                    
                    
                </View>
                
        )

    }
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
        paddingLeft: 50
        
    },
    commentTextColor: {
        padding: 20,
        color: '#FFFFFF',
        fontSize: 16
    },
    commentorUsername: {
        color: '#3F3F41',
        fontWeight: "bold"
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'#696969',
        width: Dimensions.get('window').width,
        // margin: 10
   },
   timeContainer: {
        paddingLeft: 10,
        paddingTop: 1
    },
    reply:{
        color: 'white',
        marginLeft: 10
    },
    showRepliesButton:{
        color: '#FFFFFF'
    }
    
})

export default CommentReplyCellClass;