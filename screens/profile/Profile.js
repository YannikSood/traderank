import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Image, Share, Linking } from 'react-native'
import Firebase from '../../firebase'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';

//Profile Components 
import ProfilePic from './profileComponents/profilePic.js'
import ProfileStats from './profileComponents/profileStats.js'
import ProfileBio from './profileComponents/profileBio.js'
import FeedCellClass from '../cells/feedCellClass'
import TimeAgo from 'react-native-timeago';
import * as Analytics from 'expo-firebase-analytics';

//Redux
import { connect } from 'react-redux';
import { clearUser } from './../../redux/app-redux';

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


class Profile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            bio: "",
            storage_image_uri: '',
            postCount: 0,
            followerCount: 0,
            followingCount: 0,
            isLoading: true,
            navigation: this.props.navigation,
            userUID: Firebase.auth().currentUser.uid,
            userPostsArray: [],
            modalOpen: false,
            dateJoined: null,
            twitter: "",
            instagram: ""
        }

        this.firestoreRef = 
        Firebase.firestore()
        .collection('globalPosts')
        .where("uid", "==", this.state.userUID)
        .orderBy("date_created", "desc")
        .limit(5);
        
    }

    componentWillMount() {
        this.pullUserInfo()
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
        Analytics.logEvent("Profile_Clicked")
        Analytics.setCurrentScreen("MyProfileScreen")
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.pullUserInfo()
    };

    onShare = async () => {
        try {
          const result = await Share.share({
           title: 'traderank invite',
            message: 'join traderank, the social network for stock traders!', 
            url: 'https://testflight.apple.com/join/eHiBK1S3'
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };
    

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
        .where("uid", "==", this.state.userUID)
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

    pullUserInfo = async() => {
        await Firebase.firestore()
        .collection('users')
        .doc(this.state.userUID)
        .onSnapshot(function(doc){

            this.setState({
                postCount: doc.data().postCount,
                followerCount: doc.data().followerCount,
                followingCount: doc.data().followingCount,
                storage_image_uri: doc.data().profilePic,
                bio: doc.data().bio,
                dateJoined: doc.data().signupDate.toDate(),
                twitter: doc.data().twitter,
                instagram: doc.data().instagram,
                isLoading: false
            })


        }.bind(this))

    } 

    gotToSettings() {
        this.state.navigation.navigate('Settings')
    }

    goToEditProfile() {
        this.state.navigation.navigate('EditProfile')
    }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }

    renderTwitterAndInstagram = () => {
        if (this.state.twitter == "" && this.state.instagram == "") {
            return (
                <View></View>
            )
        }
        else if (this.state.twitter != "" && this.state.instagram == ""){
            return (
                <View style={{flexDirection: 'row', paddingLeft: 24, paddingTop: 10}}>
                    <FontAwesome name="twitter" size={19} color="#1DA1F2" />
                    <Text 
                    style ={{color: '#FFFFFF'}}
                    onPress={() => Linking.openURL('http://twitter.com/' + this.state.twitter)}> @{this.state.twitter} </Text>
                </View>
            )
        }
        else if (this.state.twitter == "" && this.state.instagram != "") {
            return (
                <View style={{flexDirection: 'row', paddingLeft: 24, paddingTop: 10}}>
                    <AntDesign name="instagram" size={18} color="#E1306C" />
                    <Text style ={{color: '#FFFFFF'}}
                        onPress={() => Linking.openURL('http://instagram.com/' + this.state.instagram)}> @{this.state.instagram} </Text>
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
                        onPress={() => Linking.openURL('http://twitter.com/' + this.state.twitter)}> @{this.state.twitter} </Text>
                    </View>

                    <View style={{flexDirection: 'row', paddingLeft: 24, paddingTop: 10}}>
                        <AntDesign name="instagram" size={18} color="#E1306C" />
                        <Text style ={{color: '#FFFFFF'}}
                            onPress={() => Linking.openURL('http://instagram.com/' + this.state.instagram)}> @{this.state.instagram} </Text>
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
    
                    <View style={{ flexDirection: "row", padding: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style = {styles.subheader}> {this.state.user.username} </Text>
                    </View>
                    
                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center',
                        justifyContent: 'center',}}>
    
                        <TouchableOpacity   
                        onPress={() => this.openImageModal()} >
    
                            <ProfilePic storage_image_uri = {this.state.storage_image_uri} /> 
    
                        </TouchableOpacity>
                        
    
                        <View style={{paddingLeft:30}}> 
                            <ProfileStats navigation = {this.props.navigation} userUID = {this.state.userUID} postCount = {this.state.postCount} followerCount = {this.state.followerCount} followingCount = {this.state.followingCount}/>
                        </View>
                        
                    </View>
    
                    <View style = {{ alignItems: 'center', justifyContent: 'center'}} >
                        <ProfileBio bio = {this.state.bio}/>
                    </View>
    
    
                    <View style={{flexDirection: 'row', paddingLeft: 25, paddingTop: 15}}>
    
                        <Text style={{flexDirection: 'row', color: '#FFFFFF'}}>
    
                            <FontAwesome name="birthday-cake" size={14} color="#FCAF45" />
                            <Text>  {this.state.user.username} joined </Text>
                            <TimeAgo style={{color: '#FFFFFF'}} time = {this.state.dateJoined} />
                            <Text> </Text>
    
                        </Text>
    
                    </View>
                    
                    {this.renderTwitterAndInstagram()}
    
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
    
                            <TouchableOpacity 
                                onPress={() => this.goToEditProfile()}
                                style={styles.button}>
                                <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>edit profile</Text>
                            </TouchableOpacity>
    
                            <TouchableOpacity 
                                onPress={() => this.gotToSettings()}
                                style={styles.button}>
                                <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>settings</Text>
                            </TouchableOpacity>
    
    
                    </View>
                    <View style = {{ alignItems: 'center', justifyContent: 'center'}} >
                        <TouchableOpacity  
                            style = {styles.shareButton} 
                            onPress={() => this.onShare()} >
                                <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>invite friends to traderank</Text>
                        </TouchableOpacity>
                    </View>
                    
    
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
    
                    <View style={{ flexDirection: "row", padding: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style = {styles.subheader}> {this.state.user.username} </Text>
                    </View>
                    
                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center',
                        justifyContent: 'center',}}>
    
                        <TouchableOpacity   
                        onPress={() => this.openImageModal()} >
    
                            <ProfilePic storage_image_uri = {this.state.storage_image_uri} /> 
    
                        </TouchableOpacity>
                        
    
                        <View style={{paddingLeft:30}}> 
                            <ProfileStats navigation = {this.props.navigation} userUID = {this.state.userUID} postCount = {this.state.postCount} followerCount = {this.state.followerCount} followingCount = {this.state.followingCount}/>
                        </View>
                        
                    </View>
    
                    <View style = {{ alignItems: 'center', justifyContent: 'center'}} >
                        <ProfileBio bio = {this.state.bio}/>
                    </View>
    
    
                    <View style={{flexDirection: 'row', paddingLeft: 25, paddingTop: 15}}>
    
                        <Text style={{flexDirection: 'row', color: '#FFFFFF'}}>
    
                            <FontAwesome name="birthday-cake" size={14} color="#FCAF45" />
                            <Text>  {this.state.user.username} joined </Text>
                            <TimeAgo style={{color: '#FFFFFF'}} time = {this.state.dateJoined} />
                            <Text> </Text>
    
                        </Text>
    
                    </View>
                    
                    {this.renderTwitterAndInstagram()}
    
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
    
                            <TouchableOpacity 
                                onPress={() => this.goToEditProfile()}
                                style={styles.button}>
                                <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>edit profile</Text>
                            </TouchableOpacity>
    
                            <TouchableOpacity 
                                onPress={() => this.gotToSettings()}
                                style={styles.button}>
                                <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>settings</Text>
                            </TouchableOpacity>
    
    
                    </View>
                    
                    <View style = {{ alignItems: 'center', justifyContent: 'center'}} >
                        <TouchableOpacity  
                            style = {styles.shareButton} 
                            onPress={() => this.onShare()} >
                                <Text style = {{color: '#FFFFFF', fontWeight: 'bold', fontSize: 18}}>invite friends to traderank</Text>
                        </TouchableOpacity>
                    </View>
                    
    
                </View>

        )
    }

    render() {

        const { navigation } = this.props;
        const renderItem = ({ item }) => (
    
            <FeedCellClass 
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
                date_created={item.date_created.toDate()}
                uid={item.uid}
                viewsCount={item.viewsCount}
            />
        );

        if(this.state.isLoading){
            return(
              <View style = {styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    
        return (
            <View style= {{backgroundColor: '#000000'}}>
                <FlatList
                    data={this.state.userPostsArray}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
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
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#000000',
        
    },
    noPostContainer: {
        paddingTop: 20,
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingBottom: 20,
        backgroundColor: '#000000',
        paddingBottom: Dimensions.get("window").height * 0.5
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        
    },
    profileInfoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    fullScreenImage: {
        width:  Dimensions.get('window').height * 0.4,
        height: Dimensions.get('window').height * 0.4,
        borderRadius: Dimensions.get('window').height * 0.2
    },
    subheader: {
        fontSize: 22,
        fontWeight: 'bold',
        alignContent: 'center',
        color: '#FFFFFF'
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        width: Dimensions.get('window').width,
        margin: 5
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
    shareButton: {
        marginTop: 15,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        width: 320
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);