import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions,  Image, ActivityIndicator } from 'react-native'
import Firebase from '../../firebase'
import { connect } from 'react-redux';
import { clearUser } from '../../redux/app-redux';
import Modal from 'react-native-modal';
import TimeAgo from 'react-native-timeago';
import { FontAwesome } from '@expo/vector-icons';

import FeedCellClass from '../cells/feedCellClass';
import { ThemeConsumer } from 'react-native-elements';
import console = require('console');

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
            clickedUID: this.props.route.params.clickedUID,
            followers_following: this.props.route.params.follower_following,
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
        this.unsubscribe = this.firestoreRef.get().then(this.getCollection);
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.getCollection()
    };

    
    getCollection = (querySnapshot) => {
        const userFollowerFollowingArray = [];
        
        querySnapshot.forEach((res) => {
            console.log(res)
        // const { 
        //     uid
        //     } = res.data();

        //     userFollowerFollowingArray.push({
        //         key: res.id,
        //         uid,
        //     });
        // });

        // this.setState({
        //     userFollowerFollowingArray,
        // });
        })

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
                    keyExtractor={item => item.key}
                    ListHeaderComponent={this.renderListHeader}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onRefresh={this._refresh}
                    refreshing={this.state.isLoading}
                    onEndReachedThreshold={0.5}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(ClickedFollowPage);