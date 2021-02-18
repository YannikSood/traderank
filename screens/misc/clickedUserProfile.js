import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions,  Image, ActivityIndicator, Linking } from 'react-native'
import Firebase from '../../firebase'
import { connect } from 'react-redux';
import { clearUser } from '../../redux/app-redux';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import FeedCellClass from '../cells/feedCellClass';
import * as Analytics from 'expo-firebase-analytics';

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

//Only thing left is displaying the Post feed and styling the follow/unfollow/hide modal buttons
class ClickedUserProfile extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            //Poster information from users collection
            posterUID: this.props.route.params.posterUID,
            posterUsername: "",
            posterFollowerCount: "",
            posterFollowingCount: "",
            posterPostCount: "",
            posterBio: "",
            storage_image_uri: '',
            posterTwitter: "",
            posterInstagram: "",
            //Current user information
            currentUserUID: Firebase.auth().currentUser.uid,
            currentUserUsername: "",
            currentFollowerCount: 0,
            currentFollowingCount: 0,

            //Other Stuff
            isLoading: true,
            navigation: this.props.navigation,
            isFollowing: false,

            userPostsArray: [],
            //clickedUserUID: this.props.clickedUserUID, posterUID
            //navigation: this.props.navigation
            notificationUID: "",
            modalOpen: false,
            dateJoined: null,
            followsYou: false
        }

        this.firestoreRef = 
        Firebase.firestore()
        .collection('globalPosts')
        .where("uid", "==", this.state.posterUID)
        .orderBy("date_created", "desc")
        .limit(5);
        
    }

    //Do this every time the component mounts
    //----------------------------------------------------------
    componentDidMount() {
        Analytics.logEvent("Profile_Clicked")
        Analytics.setCurrentScreen("ClickedProfileScreen")
        this.getPosterInfo()
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.getPosterInfo()
    };

    writeToUserNotifications = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .collection('notifications')
        .add({
            type: 2,
            senderUID: this.state.currentUserUID,
            recieverUID: this.state.posterUID,
            postID: "",
            read: false,
            date_created: new Date(),
            recieverToken: ""
        })
        .then((docref) => this.setState({notificationUID: docref.id}))
        .catch(function(error) {
            console.error("Error writing document to user posts: ", error);
        });

        const writeNotification = Firebase.functions().httpsCallable('writeNotification');
            writeNotification({ 
                type: 2,
                senderUID: this.state.currentUserUID,
                recieverUID: this.state.posterUID,
                postID: "",
                senderUsername: this.state.currentUserUsername
            })
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    removeFromUserNotifications = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .collection('notifications')
        .doc(this.state.notificationUID)
        .delete()
        .catch(function(error) {
            console.error("Error writing document to user posts: ", error);
        });
    }
    
    //Get the poster UID and the poster username for display purposes
    getPosterInfo = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState ({
                    posterUsername: doc.data().username,
                    posterFollowerCount: doc.data().followerCount,
                    posterFollowingCount: doc.data().followingCount,
                    posterPostCount: doc.data().postCount,
                    posterBio: doc.data().bio,
                    storage_image_uri: doc.data().profilePic,
                    dateJoined: doc.data().signupDate.toDate(),
                    posterTwitter: doc.data().twitter,
                    posterInstagram: doc.data().instagram,
                    isLoading: false
                })
            } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
            }
        }.bind(this));

        //We also need some user information, like their follower/following count so we can update that if they decide to follow
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.currentUserUID)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                this.setState({
                    currentUserUsername: doc.data().username,
                    currentFollowerCount: doc.data().followerCount,
                    currentFollowingCount: doc.data().followingCount,
                })
            } else {
                console.log("No such document!");
            }
        }.bind(this));

        console.log(this.state.posterTwitter + " twitter")
    }

    getCollection = (querySnapshot) => {
        const userPostsArray = [];
        querySnapshot.forEach((res) => {
        const { 
            username,
            uid,
            image,
            ticker,
            security,
            description,
            percent_gain_loss,
            profit_loss,
            gain_loss,
            date_created,
            viewsCount
            } = res.data();

            userPostsArray.push({
                key: res.id,
                username,
                uid,
                image,
                ticker,
                security,
                description,
                percent_gain_loss,
                profit_loss,
                gain_loss,
                date_created,
                viewsCount
            });
        });

        this.setState({
            userPostsArray,
        });

    }

    getMore = async() => {

        const lastItemIndex = this.state.userPostsArray.length - 1

        await Firebase.firestore()
        .collection('globalPosts')
        .where("uid", "==", this.state.posterUID)
        .orderBy("date_created", "desc")
        .startAfter(this.state.userPostsArray[lastItemIndex].date_created)
        .limit(5)
        .onSnapshot(querySnapshot => {
            const newPostsArray = []
            querySnapshot.forEach((res) => {
                const { 
                    username,
                    uid,
                    image,
                    ticker,
                    security,
                    description,
                    percent_gain_loss,
                    profit_loss,
                    gain_loss,
                    date_created,
                    viewsCount
                    } = res.data();
    
                    newPostsArray.push({
                        key: res.id,
                        username,
                        uid,
                        image,
                        ticker,
                        security,
                        description,
                        percent_gain_loss,
                        profit_loss,
                        gain_loss,
                        date_created,
                        viewsCount
                    });
                });

                this.setState({
                    userPostsArray: this.state.userPostsArray.concat(newPostsArray)
                });

        })
    }

    //If the current user is already following the poster, check here.
    isFollowing = async() => {
        await Firebase.firestore()
        .collection('following')
        .doc(this.state.currentUserUID)
        .collection('following')
        .doc(this.state.posterUID)
        .get()
        .then(function(doc){
            if (doc.exists) {
                this.setState ({
                    isFollowing: true
                })
            } 
            else {
                this.setState ({
                    isFollowing: false
                })
            }
        }.bind(this));

    }

    openFollowingList = () => {
        this.props.navigation.push('ClickedFollowPage', {
            clickedUID: this.state.posterUID,
            followers_following: 'following',
            navigation: this.state.navigation
        })
    }

    openFollowerList = () => {
        this.props.navigation.push('ClickedFollowPage', {
            clickedUID: this.state.posterUID,
            followers_following: 'followers',
            navigation: this.state.navigation
        })
    }

    // followsYou = async() => {
    //     await Firebase.firestore()
    //     .collection('following')
    //     .doc(this.state.posterUID)
    //     .collection('following')
    //     .doc(this.state.currentUserUID)
    //     .get()
    //     .then(function(doc){
    //         if (doc.exists) {
    //             this.setState ({
    //                 followsYou: true
    //             })
    //         } 
    //         else {
    //             this.setState ({
    //                 followsYou: false
    //             })
    //         }
    //     }.bind(this));

    // }

    //Follow a user
    followUser = async() => {
        //The current user now follows the poster with logic
        await Firebase.firestore()
        .collection('following')
        .doc(this.state.currentUserUID)
        .collection('following')
        .doc(this.state.posterUID)
        .set  ({
            uid: this.state.posterUID
        })

        //The poster now has the current user as a follower
        await Firebase.firestore()
        .collection('followers')
        .doc(this.state.posterUID)
        .collection('followers')
        .doc(this.state.currentUserUID)
        .set  ({
            uid: this.state.currentUserUID
        })

        //Update the following count for the current user
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.currentUserUID)
        .set  ({
            followingCount: this.state.currentFollowingCount + 1
        }, { merge: true })
        .then(() => this.setState({currentFollowingCount: this.state.currentFollowingCount + 1}))
        

        //Update the follower count for the poster user
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .set  ({
            followerCount: this.state.posterFollowerCount + 1
        }, { merge: true })
        .then(() => this.setState({posterFollowerCount: this.state.posterFollowerCount + 1}))
        .then(() => this.writeToUserNotifications())
    }

     //Unfollow a user
     unfollowUser = async() => {
        
        //Delete the poster user from the current users following list
        await Firebase.firestore()
        .collection('following')
        .doc(this.state.currentUserUID)
        .collection('following')
        .doc(this.state.posterUID)
        .delete()

        //Delete the current user from the posters follower list
        await Firebase.firestore()
        .collection('followers')
        .doc(this.state.posterUID)
        .collection('followers')
        .doc(this.state.currentUserUID)
        .delete()

        //Update the following count for the current user, remove one because they unfollowed
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.currentUserUID)
        .set  ({
            followingCount: this.state.currentFollowingCount - 1
        }, { merge: true })
        .then(() => this.setState({currentFollowingCount: this.state.currentFollowingCount - 1}))

        //Update the follower count for the poster user, remove one because they unfollowed
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.posterUID)
        .set  ({
            followerCount: this.state.posterFollowerCount - 1
        }, { merge: true })
        .then(() => this.setState({posterFollowerCount: this.state.posterFollowerCount - 1}))
        .then(() => this.removeFromUserNotifications())
    }

    renderFollowButton = () => {
        this.isFollowing()

        if(this.state.isFollowing) {
            return (
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                                style={ styles.button2 }
                                onPress={() => {
                                    this.unfollowUser();
                                }}>

                                <Text style={{color: '#000000', fontWeight: 'bold', fontSize: 18}}>unfollow</Text>
                    </TouchableOpacity>
            
                </View>
            )
                
        }
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                        style={ styles.button }
                        onPress={() => {
                            this.followUser();
                        }}>

                        <Text style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>follow</Text>
            </TouchableOpacity>
            </View>
        )
    }

    // renderFollowsYou = () => {
    //     this.followsYou()

    //     if(this.state.followsYou) {
    //         return (
    //             <View>
    //                 <Text style={{color: '#FFFFFF'}}>{this.state.posterUsername} follows you</Text>
    //             </View>
    //         )
    //     }
    //     return ( 
    //         <View><Text style={{color: '#FFFFFF'}}> </Text></View>
    //     )
    // }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }

    renderTwitterAndInstagram = () => {
        if (this.state.posterTwitter == undefined && this.state.posterInstagram == undefined) {
            return (
                <View></View>
            )
        }
        else if (this.state.posterTwitter != undefined && this.state.posterInstagram == undefined){
            return (
                <View style={{flexDirection: 'row', paddingLeft: 24, paddingTop: 10}}>
                    <FontAwesome name="twitter" size={19} color="#1DA1F2" />
                    <Text 
                    style ={{color: '#FFFFFF'}}
                    onPress={() => Linking.openURL('http://twitter.com/' + this.state.posterTwitter)}> @{this.state.posterTwitter} </Text>
                </View>
            )
        }
        else if (this.state.posterTwitter == undefined && this.state.posterInstagram != undefined) {
            return (
                <View style={{flexDirection: 'row', paddingLeft: 24, paddingTop: 10}}>
                    <AntDesign name="instagram" size={18} color="#E1306C" />
                    <Text style ={{color: '#FFFFFF'}}
                        onPress={() => Linking.openURL('http://instagram.com/' + this.state.posterInstagram)}> @{this.state.posterInstagram} </Text>
                </View>
            )
        }
        else {
            return (
                <View>
                    <View style={{flexDirection: 'row', paddingLeft: 24, paddingTop: 10}}>
                        <FontAwesome name="twitter" size={19} color="#1DA1F2" />
                        <Text 
                        style ={{color: '#FFFFFF'}}
                        onPress={() => Linking.openURL('http://twitter.com/' + this.state.posterTwitter)}> @{this.state.posterTwitter} </Text>
                    </View>

                    <View style={{flexDirection: 'row', paddingLeft: 24, paddingTop: 10}}>
                        <AntDesign name="instagram" size={18} color="#E1306C" />
                        <Text style ={{color: '#FFFFFF'}}
                            onPress={() => Linking.openURL('http://instagram.com/' + this.state.posterInstagram)}> @{this.state.posterInstagram} </Text>
                    </View>
                </View>
            )
        }
    }
    renderListHeader = () => {
        if (this.state.userPostsArray.length === 0) {
            return (
                <View style = {styles.noPostContainer}>
                        <Modal
                        isVisible={this.state.modalOpen}
                        animationIn='fadeIn'
                        onSwipeComplete={() => this.closeImageModal()}
                        swipeDirection="down"
                    >
                
                    <View  style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>

                        <Image
                            source={{ uri: this.state.storage_image_uri }}
                            style={styles.fullScreenImage}
                        />
                    </View>
                </Modal>
                    
                    <View style={{ flexDirection: "row", paddingBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style = {styles.subheader}> {this.state.posterUsername}'s profile </Text>
                    </View>

                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity   
                        onPress={() => this.openImageModal()} >

                            <Image
                                source={{ uri: this.state.storage_image_uri }}
                                style={styles.thumbnail}
                            />

                        </TouchableOpacity>
                            
                            <View style={{flexDirection: 'row', paddingLeft:30}}> 
                                <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                                    <Text style = {styles.tradeText}>{this.state.posterPostCount}</Text>
                                    <Text style={{color: '#FFFFFF'}}> posts </Text>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => this.openFollowerList()}>
                                    <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                                        <Text style = {styles.tradeText}>{this.state.posterFollowerCount}</Text>
                                        <Text style={{color: '#FFFFFF'}}> followers </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => this.openFollowingList()}>
                                    <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                                        <Text style = {styles.tradeText}>{this.state.posterFollowingCount}</Text>
                                        <Text style={{color: '#FFFFFF'}}> following </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>  
                        </View>

                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                        <Text style={styles.bioText}> {this.state.posterBio} </Text>
                    </View> 

                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 25, paddingTop: 15}}>
    
                        <Text style={{flexDirection: 'row', color: '#FFFFFF'}}>

                            <FontAwesome name="birthday-cake" size={14} color="#FCAF45" />
                            <Text>  {this.state.posterUsername} joined </Text>
                            <TimeAgo style={{color: '#FFFFFF'}} time = {this.state.dateJoined} />
                            <Text> </Text>

                        </Text>

                    </View>

                    { this.renderTwitterAndInstagram() }

                    {/* { this.renderFollowsYou() } */}
                    { this.renderFollowButton() }

            </View>
            )
        }
        return (
            <View style = {styles.container}>
                    <Modal
                        isVisible={this.state.modalOpen}
                        animationIn='fadeIn'
                        onSwipeComplete={() => this.closeImageModal()}
                        swipeDirection="down"
                    >
                
                    <View  style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>

                        <Image
                            source={{ uri: this.state.storage_image_uri }}
                            style={styles.fullScreenImage}
                        />
                    </View>
                </Modal>
                    
                    <View style={{ flexDirection: "row", paddingBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style = {styles.subheader}> {this.state.posterUsername}'s profile </Text>
                    </View>

                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity   
                        onPress={() => this.openImageModal()} >

                            <Image
                                source={{ uri: this.state.storage_image_uri }}
                                style={styles.thumbnail}
                            />

                        </TouchableOpacity>
                            
                            <View style={{flexDirection: 'row', paddingLeft:30}}> 
                                <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                                    <Text style = {styles.tradeText}>{this.state.posterPostCount}</Text>
                                    <Text style={{color: '#FFFFFF'}}> posts </Text>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => this.openFollowerList()}>
                                    <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                                        <Text style = {styles.tradeText}>{this.state.posterFollowerCount}</Text>
                                        <Text style={{color: '#FFFFFF'}}> followers </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => this.openFollowingList()}>
                                    <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                                        <Text style = {styles.tradeText}>{this.state.posterFollowingCount}</Text>
                                        <Text style={{color: '#FFFFFF'}}> following </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>  
                        </View>

                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                        <Text style={styles.bioText}> {this.state.posterBio} </Text>
                    </View> 

                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 25, paddingTop: 15}}>
    
                        <Text style={{flexDirection: 'row', color: '#FFFFFF'}}>

                            <FontAwesome name="birthday-cake" size={14} color="#FCAF45" />
                            <Text>  {this.state.posterUsername} joined </Text>
                            <TimeAgo style={{color: '#FFFFFF'}} time = {this.state.dateJoined} />
                            <Text> </Text>

                        </Text>

                    </View>

                    { this.renderTwitterAndInstagram() }

                    {/* { this.renderFollowsYou() } */}
                    { this.renderFollowButton() }

            </View>
        )
    }
    

    render() {
        const { navigation } = this.props;
        const renderItem = ({ item, index }) => (
    
            <FeedCellClass 
                key = {item.key}
                username={item.username} 
                description={item.description} 
                image={item.image}
                security={item.security}
                ticker={item.ticker}
                percent_gain_loss={item.percent_gain_loss}
                profit_loss={item.profit_loss}
                gain_loss={item.gain_loss}
                postID={item.key}
                navigation={navigation}
                date_created = {item.date_created.toDate()}
                uid = {item.uid}
                viewsCount={item.viewsCount}
            />
        );
        //We want to render a profile pic and username side by side lookin nice and clickable. 
        //When clicked, the modal opens with all the user info. 
        //You can follow/unfollow from here.    
        if(this.state.isLoading){
            return(
              <View style = {styles.container}>
                <ActivityIndicator size="large" color="#FFFFFF"/>
              </View>
            )
        } 

        return (
            <View style={{backgroundColor: '#000000'}}>
                <FlatList
                    data={this.state.userPostsArray}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => String(index)} //keyExtractor={item => item.key}
                    ListHeaderComponent={this.renderListHeader}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onRefresh={this._refresh}
                    refreshing={this.state.isLoading}
                    onEndReached={() => {this.getMore()}}
                />
            </View>   
        )
        
        
    }
}

const styles = StyleSheet.create({
    
    container: {
        paddingTop: 20,
        flex: 1,
        paddingBottom: 20,
        backgroundColor: '#000000',
    },
    noPostContainer: {
        paddingTop: 20,
        flex: 1,
        paddingBottom: 20,
        backgroundColor: '#000000',
        paddingBottom: Dimensions.get("window").height * 0.5
    },
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        color: '#FFFFFF'
    },
    fullScreenImage: {
        width:  Dimensions.get('window').height * 0.4,
        height: Dimensions.get('window').height * 0.4,
        borderRadius: Dimensions.get('window').height * 0.2
    },
    profileInfoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        width: Dimensions.get('window').width,
        margin: 5
   },
   subheader: {
        fontSize: 22,
        fontWeight: 'bold',
        alignContent: 'center',
        color: '#FFFFFF'
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    clickedPostFeedContainer: {
        marginTop: Dimensions.get('window').height * 0.24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullScreenImage: {
        width:  Dimensions.get('window').height * 0.4,
        height: Dimensions.get('window').height * 0.4,
        borderRadius: Dimensions.get('window').height * 0.2
    },
    bioText: {
        fontSize: 16,
        alignContent: 'center',
        padding: 20,
        color: '#FFFFFF'
    },
    button: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 150,
        marginRight: 10,
        marginLeft: 10,
    },
    button2: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 150,
        marginRight: 10,
        marginLeft: 10,
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ClickedUserProfile);