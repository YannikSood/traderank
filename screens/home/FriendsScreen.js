import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native'
import Firebase from '../../firebase'

import FeedCellClass from '../cells/feedCellClass.js';



class FriendsScreen extends React.Component {

    constructor() {
        super();
        this.firestoreRef = Firebase.firestore().collection('following').doc(Firebase.auth().currentUser.uid).collection('following');
        this.state = {
          isLoading: true,
          followingPosts: []
        };
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
    
    //username: this.state.username,
    // description: this.state.description,
    // uid: this.state.uid,
    // ticker: this.state.ticker,
    // image: this.state.storage_image_uri,
    // gain_loss: this.state.gain_loss,
    // date_created: new Date(),
    // likesCount: 0,
    // profit_loss: this.state.profit_loss,
    // percent_gain_loss: this.state.percent_gain_loss,
    // security: this.state.security,
    // postID: this.state.postID
    getCollection = async (querySnapshot) => {
        const followingPosts = [];

        await Firebase.firestore()
        .collection('globalPosts')
        .where("uid", "==", Firebase.auth().currentUser.uid)
        .onSnapshot(function(query) {
            query.forEach((doc) =>  {
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
                    } = doc.data();
        
                    followingPosts.push({
                        key: doc.id,
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
            })
        
        });

        querySnapshot.forEach(async (res) => {
            await Firebase.firestore()
            .collection('globalPosts')
            .where("uid", "==", res.data().uid)
            .onSnapshot(function(query) {
                query.forEach((doc) =>  {
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
                        } = doc.data();

            
                        followingPosts.push({
                            key: doc.id,
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
                    
                })
                followingPosts.sort(function(a,b){ 

                    return b.date_created.toDate() - a.date_created.toDate()
            
                })
            
            });

        });

        this.setState({
            followingPosts,
            isLoading: false,   
        });

        

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
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }    

        return (
            <View style={styles.view}>
                <FlatList
                    data={this.state.followingPosts}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onRefresh={this._refresh}
                    refreshing={this.state.isLoading}
                />
            </View>   
        )
        // 

        
    }
}

                            

const styles = StyleSheet.create({
    container: {
        // marginTop: 100,
        // marginBottom: 100,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    emptyContainer: {
        // marginTop: 100,
        // marginBottom: 100,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    view: {
        alignItems: 'center',
        backgroundColor: '#000000'
    },
    thumbnail: {
        width: 300,
        height: 300,
        paddingBottom: 20,
        resizeMode: "contain"
    },
    
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    nextButton: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    button: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    globalFeedCell: {
        marginTop: 10,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        width: Dimensions.get('window').width - 20
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    headerText: {
        fontSize: 30,
        alignItems: 'center',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10
    },
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        paddingTop: 20
    },
    regularText: {
        fontSize: 16,
        alignContent: 'center',
        paddingBottom: 10
    },
    textContainer: {
        alignContent: 'center',
        paddingBottom: 10,
        paddingTop: 20
    },
    twoPickers: {
        width: 200,
        height: 88,
    },
    twoPickerItems: {
    height: 88,
    },
})

export default FriendsScreen