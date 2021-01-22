import React from 'react'
import { View, Linking, StyleSheet, Text, ActivityIndicator, Dimensions, FlatList } from 'react-native'
import Firebase from '../../firebase'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import FeedCellClass from '../cells/feedCellClass.js';
import * as Permissions from 'expo-permissions';
import * as Notifications from "expo-notifications";



class GlobalScreen extends React.Component {

    constructor(props) {
        super(props);
        this.firestoreRef = Firebase.firestore().collection('globalPosts').orderBy("date_created", "desc").limit(5);
        this.state = {
          isLoading: true,
          globalPostsArray: [],
          navigation: this.props.navigation,
          pushStatus: true,
        };
    }

    async componentDidMount() {
        this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    
        await Permissions.getAsync(Permissions.NOTIFICATIONS)
        .then((response) =>
            response.status === 'granted'
                ? response
                : Permissions.askAsync(Permissions.NOTIFICATIONS)
        )
        .then(async(response) => {
            if (response.status !== 'granted') {

                this.setState({
                    pushStatus: false
                })


                return Promise.reject(new Error('Push notifications permission was rejected'));
            }

            
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
            return token;
        })
        .then(token => {
            Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).set({
                token: token,
                pushStatus: this.state.pushStatus
            }, { merge: true })
        })
        .catch((error) => {
            console.log('Error while registering device push token', error);
        });
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
    getCollection = (querySnapshot) => {

            const globalPostsArray = [];

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

                    globalPostsArray.push({
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
                globalPostsArray,
                isLoading: false, 
            });



    }

    getMore = async() => {
        const newPostsArray = []

        const lastItemIndex = this.state.globalPostsArray.length - 1

        await Firebase.firestore()
        .collection('globalPosts')
        .orderBy("date_created", "desc")
        .startAfter(this.state.globalPostsArray[lastItemIndex].date_created)
        .limit(5)
        .onSnapshot(querySnapshot => {
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
                    globalPostsArray: this.state.globalPostsArray.concat(newPostsArray)
                });

        })
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
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    

        return (
            <View style={styles.view}>
                <FlatList
                    data={this.state.globalPostsArray}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onRefresh={this._refresh}
                    refreshing={this.state.isLoading}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {this.getMore()}}
                />
                <KeyboardSpacer />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // marginTop: 100,
        // marginBottom: 100,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        color: '#FFFFFF'
    },
    view: {
        backgroundColor: '#000000',
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

export default GlobalScreen