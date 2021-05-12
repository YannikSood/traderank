import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Share, FlatList } from 'react-native'
import Firebase from '../../firebase'

import NotificationCellClass from '../cells/notificationCell';
import * as Analytics from 'expo-firebase-analytics';

class Notification extends React.Component {
    constructor(props) {
        super(props);

        // this.firestoreRef = Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).collection('notifications').orderBy("date_created", "desc").limit(5)

        this.state = {
          isLoading: true,
          notificationsArray: [],
          navigation: this.props.navigation
        };
    }

    componentDidMount() {
        this.getCollection()
        Analytics.logEvent("Notifications_Clicked")
        Analytics.setCurrentScreen("NotificationScreen")
    }
    
    // componentDidUpdate() {
    //     this.getCollection()
    // }

    _refresh = () => {
        this.setState({ isLoading: true });
        this.getCollection()
    };

    onShare = async () => {
        try {
            const result = await Share.share({
                title: 'you are invited',
                message: 'hey! i want you to join traderank!!', 
                url: 'https://apps.apple.com/us/app/traderank/id1546959332'
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
    getCollection = async() => {

            Firebase.firestore()
            .collection('users')
            .doc(Firebase.auth().currentUser.uid)
            .set({
                hasNotifications: false
            }, {merge: true})

            const notificationsArray = [];


            await Firebase.firestore()
            .collection('users')
            .doc(Firebase.auth().currentUser.uid)
            .collection('notifications')
            .orderBy("date_created", "desc")
            .limit(7)
            .get()
            .then(function(querySnapshot) {

                querySnapshot.forEach((res) => {
                    const { 
                        type,
                        senderUID,
                        recieverUID,
                        postID,
                        read,
                        recieverToken,
                        date_created,
                        mention,
                        chatRoom
                        } = res.data();

                        notificationsArray.push({
                            key: res.id,
                            type,
                            senderUID,
                            recieverUID,
                            postID,
                            read,
                            recieverToken,
                            date_created,
                            mention,
                            chatRoom
                        });

                });

                this.setState({
                    notificationsArray,
                    isLoading: false,   
                });

            }.bind(this))

    }

    getMore = async() => {
        const lastItemIndex = this.state.notificationsArray.length - 1

        await Firebase
        .firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .collection('notifications')
        .orderBy("date_created", "desc")
        .startAfter(this.state.notificationsArray[lastItemIndex].date_created)
        .limit(7)
        .get()
        .then(function(querySnapshot) {

            const newNotificationsArray = []

            querySnapshot.forEach((res) => {
                const { 
                    type,
                    senderUID,
                    recieverUID,
                    postID,
                    read,
                    recieverToken,
                    date_created,
                    mention,
                    chatRoom
                    } = res.data();

                    newNotificationsArray.push({
                        key: res.id,
                        type,
                        senderUID,
                        recieverUID,
                        postID,
                        read,
                        recieverToken,
                        date_created,
                        mention,
                        chatRoom
                    });
                });

                
            this.setState({
                notificationsArray: [...new Set(this.state.notificationsArray.concat(newNotificationsArray))]
            });


        }.bind(this))
    }

    render() {
        const { navigation } = this.props;
        const renderItem = ({ item }) => (
    
            <NotificationCellClass 
                type={item.type} 
                senderUID={item.senderUID} 
                recieverUID={item.recieverUID}
                postID={item.postID}
                read={item.read}
                recieverToken={item.recieverToken}
                date_created={item.date_created.toDate()}
                navigation={navigation}
                mention={item.mention}
                chatRoom={item.chatRoom}
            />
        );
        if(this.state.isLoading){
            return(
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
              </View>
            )
        }    

        if(this.state.notificationsArray.length == 0) {
            return (
                <View style={styles.container}>
                    <Text style = {styles.buttonText}>no notifications yet! do something:</Text>

                    <TouchableOpacity 
                        style = {styles.button} 
                        onPress={() => this.props.navigation.navigate('EditProfile')} >
                        <Text style = {styles.buttonText}>edit profile</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style = {styles.button} 
                        onPress={() => this.props.navigation.navigate('Create')} >
                        <Text style = {styles.buttonText}>post something</Text>
                    </TouchableOpacity>

                   
                </View>
            )
            
        }

        return (
            <View style={styles.listContainer}>
                <FlatList
                    data={this.state.notificationsArray}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => String(index)}
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    listContainer: {
        backgroundColor: '#000000'
    },
    button: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 5,
        width: 300
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
})

export default Notification