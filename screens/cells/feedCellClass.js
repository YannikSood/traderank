import React, { useState } from 'react'
import {  Alert, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import Firebase from '../../firebase'
import LikeComponent from './FFCcomponents/likeComponent'
import UserComponent from './FFCcomponents/userComponent'
import CommentIconComponent from './FFCcomponents/commentIconComponent'
import DeleteComponent from './FFCcomponents/deleteComponent'
import TimeAgo from 'react-native-timeago';
import Modal from 'react-native-modal';




//The cell you see when you scroll through the home screen

class FeedCellClass extends React.Component{ 
    
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
            date_created: this.props.date_created,
            isLoading: false,
            currentUser: Firebase.auth().currentUser.uid,
            posterUID: this.props.uid,
            currentUserPosted: false,
            modalOpen: false,
        }
    }

    componentDidMount() {
        if (this.state.posterUID == this.state.currentUser) {
            this.setState({ currentUserPosted: true })
        }
    }

    renderGainLoss = () => {
        if(this.state.gain_loss == "gain") {
            return (
                <Text style={styles.pnlContainer}>
                    <Text style={styles.gainText}>${this.state.profit_loss}</Text>
                    <Text style={styles.regularTradeText}>  🚀  </Text>
                    <Text style={styles.gainText}>{this.state.percent_gain_loss}%</Text>
                    <View style={styles.timeContainer}>

                        <TimeAgo style={{color: '#696969'}} time = {this.state.date_created} />
                        
                    </View>
                </Text>
                
            )
        }
        else if (this.state.gain_loss == "loss") {
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
        return (
            <Text style={styles.pnlContainer}>
                <Text style={styles.yoloText}>${this.state.profit_loss} yolo 🙏</Text>
                <View style={styles.timeContainer}>
                    <TimeAgo style={{color: '#696969'}} time = {this.state.date_created} />
                </View>
            </Text>
        )
    }

    showPostPage = () => {
        console.log(this.state.date_created)
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

    renderCellComponents = () => {
        if(this.state.currentUserPosted) {
            return (
                <View style = {{flexDirection: 'row', color: '#FFFFFF'}}>
                            <View style={styles.buttonContainer}>

                                <LikeComponent postID = {this.state.postID} />

                            </View>

                            <View style={styles.buttonContainer}>


                                <CommentIconComponent postID = {this.state.postID} />

                            </View>

                            <View style={styles.buttonContainer}>


                                <DeleteComponent postID = {this.state.postID} postType = {this.state.gain_loss} />

                            </View>

                    </View>
            )
        }
        else {
            return (
                <View style = {{flexDirection: 'row', color: '#FFFFFF'}}>

                            <View style={styles.buttonContainer}>

                                <LikeComponent postID = {this.state.postID} />

                            </View>

                            <View style={styles.buttonContainer}>


                                <CommentIconComponent postID = {this.state.postID} />

                            </View>
                            

                    </View>
            )
        }
        
    }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }
    



    render() {
        
        return (
            <View style={styles.gainFeedCell}>

                <Modal
                    isVisible={this.state.modalOpen}
                    animationIn='fadeIn'
                    onSwipeComplete={() => this.closeImageModal()}
                    swipeDirection="down"
                >
                        
                    <View  style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>

                        <Image
                            source={{ uri: this.state.image }}
                            style={styles.fullScreenImage}
                        />
                    </View>
                </Modal>

                <TouchableOpacity   
                    
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

                    
                    
                    <TouchableOpacity onPress={() => this.openImageModal()}>
                        <View style={styles.thumbnailContainer}>
                            <Image
                                source={{ uri: this.state.image }}
                                style={styles.thumbnail}
                            />
                        </View>
                    </TouchableOpacity>
                    
                    
                
                    <TouchableOpacity
                    onPress={() => this.showPostPage()} >

                    <View style={styles.descriptionContainer}>

                        <Text style = {styles.regularText}> {this.state.description}</Text> 

                    </View>



                    
                    {this.renderCellComponents()}
                            
                   

                    
                    <View style = {styles.lineStyle} />

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
    yoloText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0066CC',
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
        justifyContent: 'center', 
        alignItems: 'center',
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
        // justifyContent: 'flex-start', 
        alignItems: 'flex-end',
        paddingBottom: 10,
        paddingRight: 25,
        backgroundColor: '#121212',
    },
    thumbnail: {
        width:  Dimensions.get('window').width - 50,
        height: 300,
        borderRadius: 15
    },
    fullScreenImage: {
        width:  Dimensions.get('window').width,
        height: Dimensions.get('window').height ,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: "contain",
    },
})

export default FeedCellClass;