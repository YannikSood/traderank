import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Button } from 'react-native'
import Firebase from '../../firebase'
import CommentUserComponent from './CFCcomponents/userCommentComponent'
import CommentLikeComponent from './CFCcomponents/likeComponent'
import CommentDeleteComponent from './CFCcomponents/deleteComponent'
import TimeAgo from 'react-native-timeago';
import { Ionicons } from '@expo/vector-icons';
import CommentReplyCellClass from './commentReplyCell'


class CommentCellClass extends React.Component{ 
    
    constructor(props) {
        super(props)
        this.state = {
            commentLikes: this.props.commentLikes,
            commentText: this.props.commentText,
            commentorUID: this.props.commentorUID,
            commentorUsername: this.props.commentorUsername,
            date_created: this.props.date_created,
            commentID: this.props.commentID,
            postID: this.props.postID,
            isLoading: false,
            navigation: this.props.navigation,
            currentUser: Firebase.auth().currentUser.uid,
            showDeleteComponent: false,
            button: this.props.button,
            replyCount: this.props.replyCount,
            repliesArray: []
            //count of replies 
        }
    }

    async componentDidMount() {
        if (this.state.commentorUID == Firebase.auth().currentUser.uid) {
            this.setState({ showDeleteComponent: true })
        }
    }

    getFirstFiveReplies = async() => {
        repliesArray = []
        await Firebase.firestore()
        .collection('comments') // collection comments
        .doc(this.state.postID) // Which post?
        .collection('comments') //Get comments for this post
        .doc(this.state.commentID) //Get the specific comment we want to reply to
        .collection('replies') //Create a collection for said comment
        .orderBy("date_created", "desc")
        .limit(5)
        .get()
        .then(function(response) {
            response.forEach((res) => {
            const { 
                commentID,
                commentText,
                date_created,
                postID,
                replierAuthorUID,
                replierUsername,
                replyingToUID,
                replyingToUsername
                } = res.data();

                repliesArray.push({
                    key: res.id,
                    commentID,
                    commentText,
                    date_created,
                    postID,
                    replierAuthorUID,
                    replierUsername,
                    replyingToUID,
                    replyingToUsername
                });
            });

            console.log(repliesArray)
            this.setState({repliesArray})
        

            const renderItem = ({ item }) => (
        
                <CommentReplyCellClass
                    commentID= {item.commentID}
                    commentText = {item.commentText}
                    date_created = {item.date_created.toDate()}
                    postID = {item.postID}
                    replierAuthorUID = {item.replierAuthorUID}
                    replierUsername = {item.replierUsername}
                    replyingToUID = {item.replyingToUID}
                    replyingToUsername = {item.replyingToUsername}
                    navigation = {this.state.navigation}
                />
            );

            return (
                <View style={styles.view}>
                    <FlatList
                        ref={this.props.scrollRef}
                        data={this.state.repliesArray}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.key}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )
        }.bind(this))
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
                                posterUID={this.state.commentorUID} 
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

                            {/* {this.props.button} 

                            {this.state.replyCount > 0  &&
                                <TouchableOpacity
                                onPress={() => this.getFirstFiveReplies()}
                                style={styles.showRepliesButton}
                                >
                                    <Text style = {{color: '#FFFFFF'}}>Show Replies</Text>
                                </TouchableOpacity>
                            } */}

                        </View>
                      



                    {/* <View style = {styles.lineStyle} /> */}
                    
                    
                </View>
            )
        }

        return (


                <View  style={ styles.commentFeedCell }>
                    
                        <View style={{flexDirection: 'row', paddingLeft: 10}}>
                            <CommentUserComponent  
                                key={this.state.commentID}
                                posterUID={this.state.commentorUID} 
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

                            {/* {this.props.button} 

                            {this.state.replyCount > 0  &&
                                <TouchableOpacity
                                onPress={() => this.getFirstFiveReplies()}
                                style={styles.showRepliesButton}
                                >
                                    <Text style = {{color: '#FFFFFF'}}>Show Replies</Text>
                                </TouchableOpacity>
                            } */}

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

export default CommentCellClass;