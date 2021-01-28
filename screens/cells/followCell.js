import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import Firebase from '../../firebase'
import LikeComponent from './FFCcomponents/likeComponent'
import UserComponent from './FFCcomponents/userComponent'
import CommentIconComponent from './FFCcomponents/commentIconComponent'
import TimeAgo from 'react-native-timeago';
import Search from '../search/search';




//The cell you see when you scroll through the home screen

class FollowCell extends React.Component{ 
    
    constructor(props) {
        super(props)
        this.state = {
            // username: this.props.username,
            // image: this.props.image,
            // ticker: this.props.ticker,
            // security: this.props.security,
            // description: this.props.description,
            // profit_loss: this.props.profit_loss,
            // percent_gain_loss: this.props.percent_gain_loss,
            // gain_loss: this.props.gain_loss,
            // postID: this.props.postID,
            // navigation: this.props.navigation,
            // date_created: this.props.date_created,
            isLoading: false,
            currentUser: Firebase.auth().currentUser.uid,
        }
    }

    // componentDidMount() {
    //     console.log(this.state.date_created)
    //     // moment(this.state.date_created.t.seconds, "x").format("DD MMM YYYY hh:mm a")
    // }


    // showPostPage = () => {
    //     console.log(this.state.date_created)
    //     this.state.navigation.push('ClickedUserPage', 
    //     {
    //         username: this.state.username,
    //         image: this.state.image,
    //         ticker: this.state.ticker,
    //         security: this.state.security,
    //         description: this.state.description,
    //         profit_loss: this.state.profit_loss,
    //         percent_gain_loss: this.state.percent_gain_loss,
    //         gain_loss: this.state.gain_loss,
    //         postID: this.state.postID,
    //         date_created: this.state.date_created
    //     })
    // }

    



    render() {
        
        return (
            <View style={{flex:1, color: '#FFFFFF'}}>
                <TouchableOpacity   
                    style={styles.gainFeedCell}
                    onPress={() => this.showPostPage()} >
                    <View style={{flexDirection: 'column', padding: 6, justifyContent: 'center', alignItems: 'left' }}>
                        <View style={{flexDirection: 'row', padding: 6, justifyContent: 'center', alignItems: 'left' }}>
                                <UserComponent 
                                    postID={this.state.postID} 
                                    navigation={this.props.navigation} 
                                />

                                <Text style={styles.securityContainer}>
                                    <Text style={styles.regularTradeText}> traded </Text>
                                    <Text style={styles.tradeText}>${this.state.ticker}</Text>
                                    <Text style={styles.tradeText}> [{this.state.security}] </Text>
                                </Text>
                                
                        </View>
                        { this.renderGainLoss() }
                    </View>
                    
                    
                    

                </TouchableOpacity>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    gainFeedCell: {
        marginTop: 10,
        // // paddingVertical: 5,
        // backgroundColor: '#FFFFFF',
        // opacity: 0.08,
        // shadowColor: '#FFFFFF',
        // borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 15,
        // width: Dimensions.get('window').width - 20,
        flex: 1/3,
        backgroundColor: '#121212',
        color: '#FFFFFF'
    },
    tradeText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF',
        // paddingTop: 20
    },
    regularText: {
        fontSize: 18,
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF',
        paddingHorizontal: 0
    },
    regularTradeText: {
        fontSize: 20,
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    gainText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00cc00',
    },
    lossText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#cc0000',
    },
    textContainer: {
        alignContent: 'center',
        paddingBottom: 10,
        paddingTop: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#121212'
    },
    pnlContainer: {
        flex: 1,
        // justifyContent: 'left', 
        // alignContent: 'left',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        // backgroundColor: '#121212'
    },
    securityContainer: {
        alignContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 12,
    },
    descriptionContainer: {
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#121212'
    },
    timeContainer: {
        paddingLeft: 20,
        color: '#FFFFFF',
        // backgroundColor: '#696969'
    },
    buttonContainer: {
        flexDirection: 'row', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginLeft: 22,
        marginRight: 22,
        paddingTop: 10,
        paddingBottom: 10,
        color: '#FFFFFF',
        // backgroundColor: '#696969'
    },
    thumbnailContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        paddingBottom: 10,
        backgroundColor: '#121212'
    },
    thumbnail: {
        width:  Dimensions.get('window').width,
        height: 250,
        resizeMode: "contain",
    },
})

export default FollowCell;