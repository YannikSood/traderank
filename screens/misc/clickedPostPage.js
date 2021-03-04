import React, { useState } from 'react'
import {  FlatList, View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Image, Dimensions, TouchableOpacity, ActivityIndicator, Button } from 'react-native'
import Firebase from '../../firebase'
import LikeComponent from '../cells/FFCcomponents/likeComponent'
import CommentIconComponent from '../cells/FFCcomponents/commentIconComponent'
import UserComponent from '../cells/FFCcomponents/userComponent'
import CommentCellClass from '../cells/commentCellClass'
import CommentComponent from '../cells/FFCcomponents/commentComponent'
import TimeAgo from 'react-native-timeago';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import { connect } from 'react-redux';
import { clearUser } from '../../redux/app-redux';
import { Entypo } from '@expo/vector-icons';
// import ReplyButton from './replyButton';
import AsyncStorage from '@react-native-async-storage/async-storage';


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: (temp) => { dispatch(clearUser(temp))}
     };
}


//This page now only shows comments
//To show post details, go to Special Clicked Post Page
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
            currentViewsCount: 0,
            replyTo:"",
            replyData:{}
        }

        this.firestoreRef = 
        Firebase.firestore()
        .collection('comments')
        .doc(this.state.postID)
        .collection('comments')
        .orderBy("date_created", "asc");
    }

    componentDidMount() {
        //Not replying ot anyone
       //update replyingTo storage variable here?

        Analytics.logEvent("Post_Clicked")
        Analytics.setCurrentScreen("PostDetailsScreen")
        Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                this.setState({
                    currentViewsCount: doc.data().viewsCount
                })
            }
        })
        .catch((error) => {
            console.log(error)
        })

        Firebase.firestore()
        .collection('globalPosts')
        .doc(this.state.postID)
        .set({
            viewsCount: this.state.currentViewsCount + 1
        }, { merge: true })

        this.getCollection()
    }
    
    componentWillUnmount = () => {
        console.log("unmounted comments")
    }

    getCollection = async () => {
            const commentsArray = [];

            await Firebase.firestore()
            .collection('comments')
            .doc(this.state.postID)
            .collection('comments')
            .orderBy("date_created", "asc")
            .get()
            .then(function(doc) {
                doc.forEach((res) => {
                    const { 
                        commentLikes,
                        commentText,
                        commentorUID,
                        commentorUsername,
                        date_created,
                        replyCount} = res.data();
        
                        commentsArray.push({
                            key: res.id,
                            commentLikes,
                            commentText,
                            commentorUID,
                            commentorUsername,
                            date_created,
                            replyCount
                            
                        });
                })

                this.setState({
                    commentsArray,
                    isLoading: false,   
                });

            }.bind(this));

            // if (commentsArray.length == 0) {
            //     this.setState({
            //         // commentsArray,
            //         isLoading: false,   
            //     });
            // }
            

            

            // console.log(this.state.commentsArray)
    }
    

    renderGainLoss = () => {

        if(this.state.gain_loss == "gain") {
            return (
                <Text style={styles.pnlContainer}>
                    <Text style={styles.gainText}>${this.state.profit_loss}</Text>
                    <Text style={styles.regularTradeText}>  🚀  </Text>
                    <Text style={styles.gainText}>{this.state.percent_gain_loss}%</Text>
                </Text>
                
            )
        }
        else if (this.state.gain_loss == "loss") {
            return (
                <Text style={styles.pnlContainer}>
                    <Text style={styles.lossText}>-${this.state.profit_loss}</Text>
                    <Text style={styles.tradeText}>  🥴  </Text>
                    <Text style={styles.lossText}>-{this.state.percent_gain_loss}%</Text>
                </Text>
            )
        }
        return (
            <Text style={styles.pnlContainer}>
                 <Text style={styles.yoloText}>${this.state.profit_loss}  🙏  trade</Text>
            </Text>
        )
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.firestoreRef.onSnapshot(this.getCollection);
    };

    renderListHeader = () => {
        if (this.state.isLoading) {
            return (
                <View style= {styles.noCommentsContainer} >
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        return (
            <View style= {this.getContainerStyle()} >

            {/* <Modal
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
            </Modal> */}

            <View>
            <View style={{flexDirection: 'row', padding: 6, justifyContent: 'space-between',  alignItems: 'left' }}>

                <View style={{flexDirection: 'column', paddingTop: 10, paddingLeft: 4}}>
                    <View style ={{flexDirection: 'row', paddingLeft: 12,}}>
                            <UserComponent 
                                postID={this.state.postID} 
                                navigation={this.props.navigation} 
                            />
                    </View>
                    
                </View>

                <View style={{flexDirection: 'column', paddingTop: 10, paddingRight: 10}}>
                        <Text style={styles.tradeText}>${this.state.ticker}</Text>
                        <Text style={{fontSize: 18, fontWeight: 'bold', alignContent: 'center', color: '#696969', paddingRight: 10}}>#{this.state.security} </Text>
                </View>




                </View>
                {/* </View> */}
                {/* { this.renderGainLoss() } */}
            </View>
            


                {/* <TouchableOpacity   
                    onPress={() => this.openImageModal()} 
                    style={{alignItems: "center", marginLeft: Dimensions.get('window').width * 0.2, marginRight: Dimensions.get('window').width * 0.2}}>

                        <Image
                            source={{ uri: this.state.image }}
                            style={styles.thumbnail}
                        />
                </TouchableOpacity> */}


                
                <View style={styles.descriptionContainer}>

                    <Text style = {styles.descriptionText}> {this.state.description}</Text> 

                </View>

                <View style={styles.timeContainer}>
                    <TimeAgo style={{color: '#696969'}} time = {this.state.date_created} />
                </View>



                {/* <View style = {{flexDirection: 'row', color: '#FFFFFF'}}>
                    <View style={styles.buttonContainer}>

                        <LikeComponent postID = {this.state.postID} />

                    </View>

                    <View style={styles.buttonContainer}>

                         <CommentIconComponent postID = {this.state.postID} />

                    </View>

                    <View style={styles.buttonContainer}>


                        <Ionicons name="eye-sharp" size={30} color="white" />
                        <Text style = {{color: '#FFFFFF', paddingLeft: 4}}>{this.state.currentViewsCount}</Text>


                    </View>
                </View> */}
                <View style = {styles.lineStyle} />

            </View>
        )
    }

    getContainerStyle = () => {
        if (this.state.commentsArray.length == 0) {
            return {
                paddingTop: 20,
                paddingBottom: 20,
                backgroundColor: '#000000',
                color: '#000000',
                height: Dimensions.get('window').height
            }
        }
        return {
            paddingTop: 20,
            paddingBottom: 20,
            backgroundColor: '#000000',
            color: '#000000',
        }
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
        /*
                button = {
                    <ReplyButton
                     postID = {this.state.postID}
                     commentID={item.key}
                     replyingToUsername = {item.commentorUsername}
                     replyTo={item.commentorUsername}
                     replyingToUID={item.commentorUID}
                     replierUsername={this.props.user.username}
                     replierAuthorUID={this.state.currentUser}
                     commentLikes={0}

                    />
                } 
        */
        const renderItem = ({ item}) => (

            <CommentCellClass 
                key = {item.key}
                commentLikes= {item.commentLikes}
                commentText = {item.commentText}
                commentorUID = {item.commentorUID}
                commentorUsername = {item.commentorUsername}
                navigation = {navigation}
                date_created = {item.date_created.toDate()}
                commentID = {item.key}
                postID = {this.state.postID}
                replyCount={item.replyCount}
                button = {
                    <TouchableOpacity
                    onPress={() =>{
                        //just set state of replyTo in componentUpdate from async storage
                        //StoreReplyTo
                       const storeReplyTo = async (value) => {
                        try {
                          await AsyncStorage.setItem('replyTo', value)
                        } catch (e) {
                          // saving error
                        }
                      }
   
                      storeReplyTo(`${item.commentorUsername}`);
                      this.setState({replyTo:`${item.commentorUsername}`})

                      //sotre who to reply to
                      let replyDataObj = {
                        postID: `${this.state.postID}`, //post the comment I am replying to 
                        commentID: `${item.key}`, //Id of the comment I am replying to 
                        replyingToUsername: `${item.commentorUsername}`,
                        replyingToUID: `${item.commentorUID}`, //person who made the comment I am replying to
                        replierAuthorUID: `${this.state.currentUser}`, //person sending the reply
                        replierUsername: `${this.props.user.username}`,
                        commentLikes: 0
                        //may need to change
                        }
                        console.log(replyDataObj);
                      
                        //replyData that will be stored in the DB
                      const storeReplyData = async (value) => {
                        try {
                          const jsonValue = JSON.stringify(value)
                          await AsyncStorage.setItem('replyData', jsonValue)
                        } catch (e) {
                          // saving error
                        }
                      }
                      this.setState({replyData:replyDataObj});
                      storeReplyData(replyDataObj);
                      
                    }}>

                        <View style={{paddingLeft: 15, paddingRight: 15}}>

                            <Entypo name="reply" size={22} color="white" />
                        
                        </View>
                    </TouchableOpacity>
                } 
                    
                //pass a reply button as a prop

            />
        );

        return (
            <View style ={{backgroundColor: '#000000'}}> 

                    <FlatList
                        data={this.state.commentsArray}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => String(index)} //keyExtractor={item => item.key}
                        ListHeaderComponent={this.renderListHeader}
                        contentContainerStyle={{ paddingBottom: Dimensions.get('window').height }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        onRefresh={this._refresh}
                        refreshing={this.state.isLoading}
                    />

                    <KeyboardAvoidingView style={styles.commentFooter}
                    behavior="padding" enabled   
                    keyboardVerticalOffset={100}>
                        <CommentComponent postID = {this.state.postID} replyTo={this.state.replyTo} replyData={this.state.replyData}/>
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
        paddingBottom: 20,
        backgroundColor: '#000000',
        color: '#000000',
        height: Dimensions.get('window').height
    },
    tradeText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignContent: 'center',
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
        justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        // backgroundColor: '#121212'
    },
    securityContainer: {
        alignContent: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 12
        
    },
    descriptionContainer: {
        alignItems: 'flex-start',
        paddingLeft: 22,
        padding: 10,
        backgroundColor: '#000000'
    },
    timeContainer: {
        paddingLeft: 25,
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
    descriptionText: {
        fontSize: 15,
        color: '#FFFFFF',
        alignContent: 'center',
        paddingRight: 10,
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
        borderColor:'white',
        width: Dimensions.get('window').width,
        marginTop: 15
        // margin: 10
   }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClickedPostPage);