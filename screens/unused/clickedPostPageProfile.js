import React, { useState } from 'react'
import {  Alert, Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import Firebase from '../../firebase'
import LikeComponent from '../cells/FFCcomponents/likeComponent'
import UserComponent from '../cells/FFCcomponents/userComponent'
import CommentFeed from '../feeds/commentFeed'
import CommentComponent from '../cells/FFCcomponents/commentComponent'
import { Ionicons } from '@expo/vector-icons';

class ClickedPostPageProfile extends React.Component { 
    
    constructor(props) {
        super(props)
        this.state = {
            username: this.props.route.params.username,
            image: this.props.route.params.image,
            ticker: this.props.route.params.ticker,
            security: this.props.route.params.security,
            description: this.props.route.params.description,
            profit_loss: this.props.route.params.profit_loss,
            percent_gain_loss: this.props.route.params.percent_gain_loss,
            gain_loss: this.props.route.params.gain_loss,
            cost_basis: this.props.route.params.cost_basis,
            postID: this.props.route.params.postID,
            navigation: this.props.navigation,
            isLoading: false,
            currentUser: Firebase.auth().currentUser.uid
        }
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

            <View style={styles.container} >

                <View style={{flexDirection: 'row' }}>

                    <UserComponent 
                        postID={this.state.postID} 
                        navigation={this.state.navigation} 
                    />
                        
                </View>

                
                <Text style={styles.securityContainer}>
                    <Text style={styles.regularText}> traded </Text>
                    <Text style={styles.tradeText}>{this.state.security} </Text>
                    <Text style={styles.regularText}>on </Text>
                    <Text style={styles.tradeText}>${this.state.ticker}</Text>
                </Text>

                { this.renderGainLoss() }

                <Image
                    source={{ uri: this.state.image }}
                    style={styles.thumbnail}
                />
                
                <Text style = {styles.regularText}> {this.state.description}</Text> 

                <View style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>

                    <LikeComponent postID = {this.state.postID} />

                </View>

                <CommentComponent postID = {this.state.postID}/>
                
                <CommentFeed postID = {this.state.postID} navigation = {this.props.navigation} />
               

            </View>
        )
    }
};


const styles = StyleSheet.create({
    
    container: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
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
        paddingBottom: 20,
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
    textContainer: {
        alignContent: 'center',
        paddingBottom: 10,
        paddingTop: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    thumbnail: {
        width:  Dimensions.get('window').width - 50,
        height: 250,
        padding: 10,
        margin: 10,
        resizeMode: "contain",
    },
})

export default ClickedPostPageProfile;