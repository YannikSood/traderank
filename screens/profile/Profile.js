import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Image } from 'react-native'
import Firebase from '../../firebase'
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

//Profile Components 
import ProfilePic from './profileComponents/profilePic.js'
import ProfileStats from './profileComponents/profileStats.js'
import ProfileBio from './profileComponents/profileBio.js'
import FeedCellClass from '../cells/feedCellClass'

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
        }

        this.firestoreRef = 
        Firebase.firestore()
        .collection('globalPosts')
        .where("uid", "==", this.state.userUID)
        .orderBy("date_created", "desc");
        
    }

    componentDidMount() {
        this.pullUserInfo()
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.pullUserInfo()
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
            date_created
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
                date_created
            });
        });

        this.setState({
            userPostsArray,
        });

        // console.log(this.state.userPostsArray)
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
                isLoading: false
            })

        }.bind(this))
    } 

    gotToSettings() {
        this.state.navigation.navigate('Settings')
    }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }

    renderListHeader = () => {
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

                <View style={{ flexDirection: "row", padding: 20 }}>
                    <Text style = {styles.subheader}> {this.state.user.username} </Text>
                </View>
                
                <View style={{ flex: 1, flexDirection: "row", alignItems: 'center',
                    justifyContent: 'center',}}>

                    <TouchableOpacity   
                    onPress={() => this.openImageModal()} >

                        <ProfilePic storage_image_uri = {this.state.storage_image_uri} /> 

                    </TouchableOpacity>
                    

                    <View style={{paddingLeft:30}}> 
                        <ProfileStats postCount = {this.state.postCount} followerCount = {this.state.followerCount} followingCount = {this.state.followingCount}/>
                    </View>
                    
                </View>


                <ProfileBio bio = {this.state.bio}/>

                <TouchableOpacity 
                    onPress={() => this.gotToSettings()}>
                    <Ionicons name="ios-settings" size={35} color="white" />
                </TouchableOpacity>

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
            />
        );

        if(this.state.isLoading){
            return(
              <View styles = {styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    
        if(this.state.userPostsArray.length == 0) {
            return (
                <View style = {styles.emptyContainer}>
    
                    <Modal
                        animationType="slide"
                        visible={this.state.modalOpen}
                        presentationStyle="pageSheet"
                        onDismiss={() => this.closeImageModal()}
                    >
                            
                        <View  style={{flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity 
                                style={{padding: 15}}
                                onPress = { () => this.closeImageModal() }>
                                <Ionicons name="ios-close-circle" size={30} color="red" />
                            </TouchableOpacity>

                            <Image
                                source={{ uri: this.state.storage_image_uri }}
                                style={styles.fullScreenImage}
                            />
                        </View>
                    </Modal>

                    <View style={{ flexDirection: "row", padding: 20 }}>
                        <Text style = {styles.subheader}> {this.state.user.username} </Text>
                    </View>
                    
                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center',
                        justifyContent: 'center',}}>
    
                    <TouchableOpacity   
                    onPress={() => this.openImageModal()} >

                        <ProfilePic storage_image_uri = {this.state.storage_image_uri} /> 

                    </TouchableOpacity>
    
                        <View style={{paddingLeft:30}}> 
                            <ProfileStats postCount = {this.state.postCount} followerCount = {this.state.followerCount} followingCount = {this.state.followingCount}/>
                        </View>
                        
                    </View>
    
    
                    <ProfileBio bio = {this.state.bio}/>
    
                    <TouchableOpacity 
                        onPress={() => this.gotToSettings()}>
                        <Ionicons name="ios-settings" size={35} color="white" />
                    </TouchableOpacity>
    
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
                />
            </View>   
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        paddingBottom: Dimensions.get("window").height * 0.5
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
   }
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);