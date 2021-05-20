import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import firebase from '../../firebase'
import LikeComponent from '../cells/FFCcomponents/likeComponent'
import CommentComponent from '../cells/FFCcomponents/commentComponent'


//The cell you see when you click a users profile that isnt you and see their posts in the flatlist
class ClickedUserPostCell extends React.Component{ 
    
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
            cost_basis: this.props.cost_basis,
            isLoading: false,
            currentUser: firebase.auth().currentUser.uid,
        }
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
            cost_basis: this.state.cost_basis,
            postID: this.state.postID,
        })
    }


    renderGainLoss = () => {
        if(this.state.gain_loss == "gain") {
            return (
                <Text style={styles.pnlContainer}>
                    <Text style={styles.gainText}>${this.state.profit_loss}</Text>
                    <Text style={styles.regularText}> profit off </Text>
                    <Text style={styles.tradeText}>${this.state.cost_basis}</Text>
                    <Text style={styles.regularText}> for a </Text>
                    <Text style={styles.gainText}>+{this.state.percent_gain_loss}%</Text>
                    <Text style={styles.tradeText}> W 💵 </Text>
                </Text>
                
            )
        }
        return (
            <Text style={styles.pnlContainer}>
                <Text style={styles.lossText}>${this.state.profit_loss}</Text>
                <Text style={styles.regularText}> loss out of </Text>
                <Text style={styles.tradeText}>${this.state.cost_basis}</Text>
                <Text style={styles.regularText}> for a </Text>
                <Text style={styles.lossText}>-{this.state.percent_gain_loss}%</Text>
                <Text style={styles.tradeText}> L 🥴</Text>
            </Text>
           
        )
    }


    render() {
        return (

            <View style={{flex:1}}>
                <TouchableOpacity   
                    style={this.state.gain_loss === "gain" ? styles.gainFeedCell : styles.lossFeedCell}
                    onPress={() => this.showPostPage()}>

                    <View style={{flexDirection: 'column', padding: 6, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{flexDirection: 'row', padding: 6, justifyContent: 'center', alignItems: 'center' }}>
                                
                                <Text style={styles.securityContainer}>
                                    <Text style ={styles.tradeText}> {this.state.username}</Text>
                                    <Text style={styles.regularText}> traded </Text>
                                    <Text style={styles.tradeText}>{this.state.security} </Text>
                                    <Text style={styles.regularText}>on </Text>
                                    <Text style={styles.tradeText}>${this.state.ticker}</Text>
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

                    </View>

                        <CommentComponent postID = {this.state.postID}/>
                    <View style = {styles.lineStyle} />

                </TouchableOpacity>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    gainFeedCell: {
        marginTop: 10,
        // paddingVertical: 5,
        backgroundColor: '#FFFFFF',
        // borderColor: '#32CD32',
        // borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 15,
        // width: Dimensions.get('window').width - 20,
        // flex: 1/3
    },
    lossFeedCell: {
        marginTop: 10,
        // paddingVertical: 5,
        backgroundColor: '#FFFFFF',
        // borderColor: '#DC143C',
        // borderWidth: 5,
        borderBottomWidth: 1,
        borderRadius: 15,
        // width: Dimensions.get('window').width - 20,
        // flex: 1/3
    },
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        // paddingTop: 20
    },
    regularText: {
        fontSize: 16,
        alignContent: 'center',
        paddingBottom: 10
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
    },
    pnlContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignContent: 'center',
        paddingBottom: 10,
        // paddingTop: 20,
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
        marginLeft: 22,
        marginRight: 22,
        paddingTop: 10,
        paddingBottom: 10
    },
    thumbnailContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
    },
    thumbnail: {
        width:  Dimensions.get('window').width - 40,
        height: 250,
        padding: 10,
        margin: 10,
        resizeMode: "contain",
    },
})

export default ClickedUserPostCell;