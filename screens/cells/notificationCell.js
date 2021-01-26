import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import Firebase from '../../firebase'
import UserComponent from './FFCcomponents/userComponent'
import TimeAgo from 'react-native-timeago';

class NotificationCellClass extends React.Component{ 
    
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            senderUID: this.props.senderUID, 
            recieverUID: this.props.recieverUID,
            postID:this.props.postID,
            read: this.props.read,
            recieverToken: this.props.recieverToken,
            notification_date_created: this.props.date_created,
            senderUsername: "",
            username: "",
            image: "",
            ticker: "",
            security: "",
            description: "",
            profit_loss: "",
            percent_gain_loss: "",
            gain_loss: "",
            date_created: new Date(),
            navigation: this.props.navigation,
        }
    }

    componentDidMount () {
        this.getUsernames()
    }

    getUsernames = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.senderUID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    senderUsername: doc.data().username,
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));

        
    }

    showPostPage = async() => {
        await Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState({
                    username: doc.data().username,
                    image: doc.data().image,
                    ticker: doc.data().ticker,
                    security: doc.data().security,
                    description: doc.data().description,
                    profit_loss: doc.data().profit_loss,
                    percent_gain_loss: doc.data().percent_gain_loss,
                    gain_loss: doc.data().gain_loss,
                    date_created: doc.data().date_created.toDate()
                })
            }
        }.bind(this));

        this.state.navigation.push('ClickedPostPage', 
        {
            username: this.state.username,
            image: this.state.image,
            ticker: this.state.ticker,
            security: this.state.security,
            description: this.state.description,
            profit_loss: this.state.profit_loss,
            percent_gain_loss: this.state.percent_gain_loss,
            gain_loss: this.state.gain_loss,
            postID: this.state.postID,
            date_created: this.state.date_created
        })
    }



    determineFormat = () => {
        if (this.state.type == 0) {
            return (
                <TouchableOpacity   
                    style={styles.feedCell}
                    onPress={() => this.showPostPage()} >
                        <View style={{flexDirection: 'row'}}>

                            <TouchableOpacity   
                                onPress={() => this.showUserProfile()}>
                                    <Text style={styles.textStyle}>{this.state.senderUsername} </Text>
                            </TouchableOpacity>

                            <Text style={styles.textStyle2}> liked your post</Text>
                            
                            <View style={styles.timeContainer}>

                                <TimeAgo style={{color: '#696969'}} time = {this.state.notification_date_created} />

                            </View>
                        </View>

                        <View style = {styles.lineStyle} />
                </TouchableOpacity>
            )
        }

        if (this.state.type == 1) {
            return (
                <TouchableOpacity   
                    style={styles.feedCell}
                    onPress={() => this.showPostPage()} >
                        <View style={{flexDirection: 'row'}}>
  
                                <TouchableOpacity   
                                onPress={() => this.showUserProfile()}>
                                    <Text style={styles.textStyle}>{this.state.senderUsername} </Text>
                                </TouchableOpacity>

                                 <Text style={styles.textStyle2}> commented on your post</Text>

                            
                            <View style={styles.timeContainer}>

                                <TimeAgo style={{color: '#696969'}} time = {this.state.notification_date_created} />

                            </View>
                        </View>

                        <View style = {styles.lineStyle} />
                </TouchableOpacity>
            )
        }
        if (this.state.type == 3) {
            return (
                <TouchableOpacity   
                    style={styles.feedCell}
                    onPress={() => this.showPostPage()} >
                        <View style={{flexDirection: 'row'}}>

                            <TouchableOpacity   
                                onPress={() => this.showUserProfile()}>
                                    <Text style={styles.textStyle}>{this.state.senderUsername} </Text>
                            </TouchableOpacity>

                            <Text style={styles.textStyle2}> liked your comment</Text>
                            
                            <View style={styles.timeContainer}>

                                <TimeAgo style={{color: '#696969'}} time = {this.state.notification_date_created} />

                            </View>
                        </View>

                        <View style = {styles.lineStyle} />
                </TouchableOpacity>
            )
        }

       
        
        return (
            <View style={styles.feedCell}>
                <View style={{flexDirection: 'row'}}>

                        <TouchableOpacity   
                                onPress={() => this.showUserProfile()}>
                                <Text style={styles.textStyle}>{this.state.senderUsername} </Text>
                        </TouchableOpacity>

                        <Text style={styles.textStyle2}> followed you</Text>
                            
                        <View style={styles.timeContainer}>

                            <TimeAgo style={{color: '#696969'}} time = {this.state.notification_date_created} />

                        </View>
                </View>

                <View style = {styles.lineStyle} />
            </View>
                
        )
        
    }

    showUserProfile = () => {
        this.state.navigation.push('ClickedUserProfile', 
        {
            posterUID: this.state.senderUID,
        })
    }

    render() {
        return (
            <View  style={ styles.commentFeedCell }>

                { this.determineFormat() }
            </View>

        )
    }
};


const styles = StyleSheet.create({
    
    feedCell: {
        // backgroundColor: '#3F3F41',
        padding: 20,
        color: '#FFFFFF',
        flex: 1,
        width: Dimensions.get('window').width,
        
    },
    commentTextColor: {
        padding: 20,
        color: '#3F3F41',
        fontSize: 16
    },
    commentorUsername: {
        color: '#3F3F41',
        fontWeight: "bold"
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'white',
        width: Dimensions.get('window').width - 70,
        margin: 10
   },
   timeContainer: {
        paddingLeft: 10,
        paddingTop: 7
    },
    textStyle: {
        color: '#FFFFFF', 
        paddingLeft: 20, 
        paddingTop: 5, 
        fontWeight: 'bold', 
        fontSize: 16
    },
    textStyle2: {
        color: '#FFFFFF', 
        paddingTop: 5, 
        fontWeight: 'bold', 
        fontSize: 16
    },

})

export default NotificationCellClass;