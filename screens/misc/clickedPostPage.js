import React, { useState } from 'react'
import {  FlatList, View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Image, Dimensions, TouchableOpacity } from 'react-native'
import Firebase from '../../firebase'
import LikeComponent from '../cells/FFCcomponents/likeComponent'
import CommentIconComponent from '../cells/FFCcomponents/commentIconComponent'
import UserComponent from '../cells/FFCcomponents/userComponent'
import CommentCellClass from '../cells/commentCellClass'
import CommentComponent from '../cells/FFCcomponents/commentComponent'
import TimeAgo from 'react-native-timeago';
import Modal from 'react-native-modal';

import { Ionicons } from '@expo/vector-icons';

class ClickedPostPage extends React.Component { 
    
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
            postID: this.props.route.params.postID,
            navigation: this.props.navigation,
            isLoading: true,
            currentUser: Firebase.auth().currentUser.uid,
            date_created: this.props.route.params.date_created,
            commentsArray: [],
            modalOpen: false,
        }

        this.firestoreRef = 
        Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .orderBy("date_created", "asc");
    }

    componentDidMount() {
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.firestoreRef.onSnapshot(this.getCollection);
    };

    
    

    getCollection = (querySnapshot) => {
            const commentsArray = [];
            querySnapshot.forEach((res) => {
            const { 
                commentLikes,
                commentText,
                commentorUID,
                commentorUsername,
                date_created} = res.data();

                commentsArray.push({
                    key: res.id,
                    commentLikes,
                    commentText,
                    commentorUID,
                    commentorUsername,
                    date_created
                    
                });
            });

            this.setState({
                commentsArray,
                isLoading: false,   
            });

            // console.log(this.state.commentsArray)
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

    renderListHeader = () => {
        return (
            <View style={styles.container} >

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


                <TouchableOpacity   
                    onPress={() => this.openImageModal()} 
                    style={{alignItems: "center", marginLeft: Dimensions.get('window').width * 0.2, marginRight: Dimensions.get('window').width * 0.2}}>

                        <Image
                            source={{ uri: this.state.image }}
                            style={styles.thumbnail}
                        />
                </TouchableOpacity>

                <View style={styles.descriptionContainer}>

                    <Text style = {styles.regularText}> {this.state.description}</Text> 

                </View>



                <View style = {{flexDirection: 'row', color: '#FFFFFF'}}>
                    <View style={styles.buttonContainer}>

                        <LikeComponent postID = {this.state.postID} />

                    </View>

                    <View style={styles.buttonContainer}>

                         <CommentIconComponent postID = {this.state.postID} />

                    </View>
                </View>
                

            </View>
        )
    }

    renderCommentComponent = () => {
        return(
            <CommentComponent postID = {this.state.postID}/>
        )
    }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }

    render() {
        const { navigation } = this.props;
        const renderItem = ({ item }) => (
    
            <CommentCellClass 
                commentLikes= {item.commentLikes}
                commentText = {item.commentText}
                commentorUID = {item.commentorUID}
                commentorUsername = {item.commentorUsername}
                navigation = {navigation}
                date_created = {item.date_created.toDate()}
                commentID = {item.key}
                postID = {this.state.postID}
            />
        );

        if(this.state.commentsArray.length == 0) {
            return (
               
                
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                

                    <View style={styles.noCommentsContainer} >
                        
                            <Modal
                                isVisible={this.state.modalOpen}
                                animationIn='fadeIn'
                                onSwipeComplete={() => this.closeImageModal()}
                                swipeDirection="down"
                            >
                                    
                                <View  style={{flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center'}}>

                                    <Image
                                        source={{ uri: this.state.image }}
                                        style={styles.fullScreenImage}
                                    />
                                </View>
                            </Modal>
                            
                    

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

                        <TouchableOpacity   
                            onPress={() => this.openImageModal()} 
                            style={{alignItems: "center", marginLeft: Dimensions.get('window').width * 0.2, marginRight: Dimensions.get('window').width * 0.2}}>

                                <Image
                                    source={{ uri: this.state.image }}
                                    style={styles.thumbnail}
                                />
                        </TouchableOpacity>
                        
                    

                        <View style={styles.descriptionContainer}>

                            <Text style = {styles.regularText}> {this.state.description}</Text> 

                        </View>



                        <View style = {{flexDirection: 'row', color: '#FFFFFF'}}>
                            <View style={styles.buttonContainer}>

                                <LikeComponent postID = {this.state.postID} />

                            </View>

                            <View style={styles.buttonContainer}>

                                <CommentIconComponent postID = {this.state.postID} />

                            </View>

                            
                        </View>



                        {/* <Text style={{paddingTop: 20, color: '#FFFFFF', }}>No comments yet. Say something!</Text> */}

                        <KeyboardAvoidingView style={styles.noCommentsFooter}
                            behavior="padding" enabled   
                            keyboardVerticalOffset={100}>
                                <CommentComponent postID = {this.state.postID}/>
                            </KeyboardAvoidingView>

                    </View>
                    

                </TouchableWithoutFeedback>
            )
        }

        return (
            <View style ={{backgroundColor: '#000000'}}> 
                <FlatList
                    data={this.state.commentsArray}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    ListHeaderComponent={this.renderListHeader}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onRefresh={this._refresh}
                    refreshing={this.state.isLoading}
                />

                    <KeyboardAvoidingView style={styles.commentFooter}
                    behavior="padding" enabled   
                    keyboardVerticalOffset={100}>
                        <CommentComponent postID = {this.state.postID}/>
                    </KeyboardAvoidingView>
            </View>
            
        )
    }
};


const styles = StyleSheet.create({
    
    container: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#000000',
        color: '#000000',
    },
    noCommentsContainer: {
        paddingTop: 20,
        paddingBottom: 100,
        backgroundColor: '#000000',
        color: '#000000',
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
        backgroundColor: '#000000'
    },
    pnlContainer: {
        flex: 1,
        // justifyContent: 'left', 
        // alignContent: 'left',
        paddingBottom: 25,
        paddingLeft: 10,
        borderTopWidth: StyleSheet.hairlineWidth,

        backgroundColor: '#000000'
    },
    securityContainer: {
        alignContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 12
        
    },
    descriptionContainer: {
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#000000'
    },
    timeContainer: {
        paddingLeft: 20,
        // color: '#FFFFFF',
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
    thumbnail: {
        width:  Dimensions.get('window').width - 50,
        height: 300,
        borderRadius: 15,
        margin: 20
    },
    fullScreenImage: {
        width:  Dimensions.get('window').width,
        height: Dimensions.get('window').height ,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: "contain",
    },
    noCommentsFooter: {
        width: Dimensions.get('window').width,
        color: '#fff',
        backgroundColor: '#000000',
        position: 'absolute',
        left: 0,
        bottom: 0,
        padding: 20,
        paddingBottom: 50,
    },
    commentFooter: {
        width: Dimensions.get('window').width,
        color: '#fff',
        backgroundColor: '#000000',
        position: 'absolute',
        left: 0,
        bottom: 0,
        padding: 20,
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        width: Dimensions.get('window').width,
        margin: 10
   }
})

export default ClickedPostPage;