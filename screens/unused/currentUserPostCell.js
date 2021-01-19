import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import Firebase from '../../firebase'
import DeleteComponent from '../cells/CUPFcomponents/deleteComponent'
import LikeComponent from '../cells/FFCcomponents/likeComponent'
import CommentIconComponent from '../cells/FFCcomponents/commentIconComponent'
import TimeAgo from 'react-native-timeago';

//The cell you see when you click your profile
class CurrentUserPostCell extends React.Component{ 
    
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
            isLoading: false,
            currentUser: Firebase.auth().currentUser.uid,
            date_created: this.props.date_created,
        }
    }


    renderGainLoss = () => {
        if(this.state.gain_loss == "gain") {
            return (
                <Text style={styles.pnlContainer}>
                    <Text style={styles.gainText}>${this.state.profit_loss}</Text>
                    <Text style={styles.regularTradeText}>  💵  </Text>
                    <Text style={styles.gainText}>{this.state.percent_gain_loss}%</Text>
                    <View style={styles.timeContainer}>

                        <TimeAgo style={{color: '#696969'}} time = {this.state.date_created} />
                        
                    </View>
                </Text>
                
            )
        }
        return (
            <Text style={styles.pnlContainer}>
                <Text style={styles.lossText}>-${this.state.profit_loss}</Text>
                <Text style={styles.tradeText}>  🥴  </Text>
                <Text style={styles.lossText}>-{this.state.percent_gain_loss}%</Text>
                <View style={styles.timeContainer}>

                    <TimeAgo style={{color: '#696969'}} time = {this.state.date_created} />
                        
                </View>
            </Text>
        )
    }


    render() {
        return (
            <TouchableOpacity   
                style={styles.gainFeedCell}
                onPress={() => this.props.navigation.navigate('ClickedPostPage', 
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
                })} >
                <View style={{flexDirection: 'column', padding: 6, justifyContent: 'center', alignItems: 'left' }}>
                        <View style={{flexDirection: 'row', padding: 6, justifyContent: 'center', alignItems: 'left' }}>
        

                                <Text style={styles.securityContainer}>
                                    <Text style={styles.tradeText}>{this.state.username}</Text>
                                    <Text style={styles.regularTradeText}> traded </Text>
                                    <Text style={styles.tradeText}>${this.state.ticker}</Text>
                                    <Text style={styles.tradeText}> [{this.state.security}] </Text>
                                </Text>
                                
                        </View>
                        { this.renderGainLoss() }
                    </View>
                
                
                
                <View style={styles.thumbnailContainer}>
                    <Image
                        source={{ uri: this.state.image }}
                        style={styles.thumbnail}
                    />
                </View>
                
               
                
                <View style={styles.descriptionContainer}>

                    <Text style = {styles.regularText}> {this.state.description}</Text> 

                </View>

                <View style={styles.buttonContainer}>

                    <LikeComponent postID = {this.state.postID} />

                    <CommentIconComponent postID = {this.state.postID} />

                    <DeleteComponent postID = {this.state.postID} postType = {this.state.gain_loss} />

                </View>

                <View style = {styles.lineStyle} />

            </TouchableOpacity>
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
    lossFeedCell: {
        marginTop: 10,
        // paddingVertical: 5,
        backgroundColor: '#fff',
        // borderColor: '#DC143C',
        // borderWidth: 5,
        borderBottomWidth: 1,
        borderRadius: 15,
        // width: Dimensions.get('window').width - 20,
        flex: 1/3
    },
    tradeText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
        // paddingTop: 20
    },
    regularText: {
        fontSize: 16,
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
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
    },
    pnlContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignContent: 'center',
        paddingBottom: 10,
        paddingLeft: 5,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    securityContainer: {
        alignContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    descriptionContainer: {
        alignItems: 'flex-start',
        paddingLeft: 11,
    },
    buttonContainer: {
        flexDirection: 'row', 
        flex: 1, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginLeft: Dimensions.get('window').width * 0.05,
        marginRight: Dimensions.get('window').width * 0.1,
        paddingTop: 10,
        paddingBottom: 10
    },
    thumbnailContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        paddingBottom: 10,
    },
    timeContainer: {
        paddingLeft: 20,
    },
    thumbnail: {
        width:  Dimensions.get('window').width,
        height: 250,
        resizeMode: "contain",
    },
})

export default CurrentUserPostCell;