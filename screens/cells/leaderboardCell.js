import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import Firebase from '../../firebase'
import LikeComponent from './FFCcomponents/likeComponent'
import UserComponent from './FFCcomponents/userComponent'
import CommentComponent from './FFCcomponents/commentComponent'
import { Ionicons } from '@expo/vector-icons';


//The cell you see when you scroll through the leaderboard screen

class LeaderboardCell extends React.Component{ 
    
    constructor(props) {
        super(props)
        this.state = {
            username: this.props.username,
            image: this.props.image,
            ticker: this.props.ticker,
            security: this.props.security,
            description: this.props.description,
            profit_loss: this.props.profit_loss,
            percent_gain_loss: this.props.percent_gain_loss,
            gain_loss: this.props.gain_loss,
            postID: this.props.postID,
            navigation: this.props.navigation,
            index: this.props.index,
            date_created: this.props.date_created,
            isLoading: false,
            currentUser: Firebase.auth().currentUser.uid
        }
    }

    renderGainLoss = () => {
        if(this.state.gain_loss == "gain") {
            return (
                <Text style={styles.pnlContainer}>
                    <Text style={styles.gainText}>${this.state.profit_loss}</Text>
                    <Text style={styles.regularTradeText}>  💵  </Text>
                    <Text style={styles.gainText}>{this.state.percent_gain_loss}%</Text>
                        <Text style={styles.rankText}>          #{this.state.index}🏆</Text>
                </Text>
                
            )
        }
        return (
            <Text style={styles.pnlContainer}>
                <Text style={styles.lossText}>-${this.state.profit_loss}</Text>
                <Text style={styles.tradeText}>  🥴  </Text>
                <Text style={styles.lossText}>-{this.state.percent_gain_loss}%</Text>
                <Text style={styles.rankText}>          #{this.state.index}🏆</Text>
            </Text>
        )
    }

    showPostPage = () => {
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


    render() {
        return (
            <View style={{flex:1, 
                alignItems: 'center',
                justifyContent: 'center'}}>
                <TouchableOpacity   
                    style={ styles.gainFeedCell }
                    onPress={() => this.showPostPage()} >
                    <View style={{flexDirection: 'column', padding: 6, justifyContent: 'center', alignItems: 'left' }}>
                        <View style={{flexDirection: 'row', padding: 6, justifyContent: 'center', alignItems: 'center' }}>
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


                    
                        <View style = {styles.lineStyle} />
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
        color: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF',
        // paddingTop: 20
    },
    regularText: {
        fontSize: 16,
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    regularTradeText: {
        fontSize: 16,
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    gainText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00cc00',
    },
    lossText: {
        fontSize: 16,
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
        borderTopWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#121212'
    },
    securityContainer: {
        alignContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    descriptionContainer: {
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#121212'
    },
    timeContainer: {
        paddingLeft: 20,
        color: '#FFFFFF',
        // backgroundColor: '#FFFFFF'
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
        color: '#FFFFFF'
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
    rankText: {
        fontSize: 30,
        fontWeight: 'bold',
        alignContent: 'center',
        color: '#FFFFFF',
    },

    lineStyle:{
        borderWidth: 0.5,
        borderColor:'#121212',
        width: Dimensions.get('window').width,
        margin: 5,
   }
})

export default LeaderboardCell;