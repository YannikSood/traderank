import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions,  Image, ActivityIndicator } from 'react-native'
import Firebase from '../../firebase'
import { connect } from 'react-redux';
import { clearUser } from '../../redux/app-redux';

import FollowCell from '../cells/followCell';

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
class ClickedFollowPage extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            //Poster information from users collection
            clickedUID: this.props.route.params.clickedUID, //Which user do we query for?
            followers_following: this.props.route.params.followers_following, //Do we query the following or follower db?

            //Other Stuff
            isLoading: true,
            navigation: this.props.navigation,
            userFollowerFollowingArray: [],
        }

        this.firestoreRef = 
        Firebase.firestore()
        .collection(this.state.followers_following)
        .doc(this.state.clickedUID)
        .collection(this.state.followers_following)
    }

    //Do this every time the component mounts
    //----------------------------------------------------------
    componentDidMount() {
        this.setState({ isLoading: true });
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection)

    }

    componentWillUnmount() {
        this.unsubscribe()
    }


    _refresh = () => {
        this.setState({ isLoading: true });
        this.firestoreRef.onSnapshot(this.getCollection)
    };

    
    getCollection = (querySnapshot) => {
        const userFollowerFollowingArray = [];


        querySnapshot.forEach((res) => {
            userFollowerFollowingArray.push({ key: res.id,
            id: res.id})
        })

        this.setState({userFollowerFollowingArray, isLoading: false})

        

    }

    // getMore = async() => {

    //     const lastItemIndex = this.state.userPostsArray.length - 1

    //     await Firebase.firestore()
    //     .collection('globalPosts')
    //     .where("uid", "==", this.state.posterUID)
    //     .orderBy("date_created", "desc")
    //     .startAfter(this.state.userPostsArray[lastItemIndex].date_created)
    //     .limit(5)
    //     .onSnapshot(querySnapshot => {
    //         const newPostsArray = []
    //         querySnapshot.forEach((res) => {
    //             const { 
    //                 username,
    //                 uid,
    //                 image,
    //                 ticker,
    //                 security,
    //                 description,
    //                 percent_gain_loss,
    //                 profit_loss,
    //                 gain_loss,
    //                 date_created,
    //                 viewsCount
    //                 } = res.data();
    
    //                 newPostsArray.push({
    //                     key: res.id,
    //                     username,
    //                     uid,
    //                     image,
    //                     ticker,
    //                     security,
    //                     description,
    //                     percent_gain_loss,
    //                     profit_loss,
    //                     gain_loss,
    //                     date_created,
    //                     viewsCount
    //                 });
    //             });

    //             this.setState({
    //                 userPostsArray: this.state.userPostsArray.concat(newPostsArray)
    //             });

    //     })
    // }

    renderListHeader = () => {
            if (this.state.userFollowerFollowingArray.length === 0) {
                return (
                    <View style = {styles.noPostContainer}>
                            
                            <Text style ={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 20}}>
                                No {this.state.followers_following}
                            </Text>
                        
        
                    </View>
        
                )
            }
            return (
                <View style = {styles.container}>
                         <Text style ={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 20}}>
                                {this.state.followers_following}
                            </Text>
                        
        
                    </View>
    
            )
    }

    

    render() {
        const { navigation } = this.props;
        const renderItem = ({ item }) => (
    
            <FollowCell 
                uid={item.id} 
                navigation={navigation}
            />
        );

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
                    data={this.state.userFollowerFollowingArray}
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
        paddingTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
        backgroundColor: '#000000',
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
    noPostContainer: {
        paddingTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
        backgroundColor: '#000000',
        paddingBottom: Dimensions.get("window").height * 0.9
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ClickedFollowPage);