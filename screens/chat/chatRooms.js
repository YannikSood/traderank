import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import firebase from '../../firebase'

class ChatRooms extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            hasFeedbackNotifications: false,
            hasAnnouncementNotifications: false,
            hasDailyNotifications: false,
        }
    }

    componentDidMount () {
        Analytics.setCurrentScreen("ChatRooms");
        this.setChatNotifications();
    }

    
    // render() {
    //     this.setChatNotifications()
    //     Analytics.setCurrentScreen("ChatRooms")
    // }

    refresh = () => {
        this.setChatNotifications();
    }

    setChatNotifications = async() => {
      this.setState({ isLoading: true });

      await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({ hasChatNotifications: false }, { merge: true });
    
      
        await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chatNotifications')
        .doc('feedback')
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              hasFeedbackNotifications: doc.data().hasChatNotifications,
            });
          } else {
            console.log('No such document!');
          }
        })
        .then(() => this.getDailyNotifications())
        .then(() => this.getAnnouncementNotifications())
        .then(() => this.setState({ isLoading: false }));
    
    }


    getDailyNotifications = async() => {
      await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chatNotifications')
        .doc('daily discussion')
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              hasDailyNotifications: doc.data().hasChatNotifications,
            });
          } else {
            console.log('No such document!');
          }
        });
    }

    getAnnouncementNotifications = async() => {
      await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chatNotifications')
        .doc('announcements')
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({
              hasAnnouncementNotifications: doc.data().hasChatNotifications,
            });
          } else {
            console.log('No such document!');
          }
        });
    }
    
    renderAnnouncementBadge = () => {
        if (this.state.hasAnnouncementNotifications) {
            return (
                <Text style={{color: '#FFFFFF'}}>  🔺  new mentions! </Text>
            );
        }

        return <View />;
    }

    renderDiscussionBadge = () => {
        if (this.state.hasDailyNotifications) {
            return (
                <Text style={{color: '#FFFFFF'}}>  🔺  new mentions! </Text>
            );
        }

        return <View />;
    }

    renderFeedbackBadge = () => {
        if (this.state.hasFeedbackNotifications) {
            return (
                <Text style={{color: '#FFFFFF'}}>  🔺  new mentions! </Text>
            );
        }

        return <View />;
    }

    // getUserSubscriptions = () => {

    // }

    renderSubscriptionHeader = () => {
        return (
            <View style={styles.container}>
            
                    <View style = {{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "announcements"
                                })
                            }
                            style={styles.subscriptionCell}>
                                <Text style={styles.buttonText}>📌 announcements </Text>

                                { this.renderAnnouncementBadge() }

                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "daily discussion"
                                })
                            }
                            style={styles.subscriptionCell}>

                                <Text style={styles.buttonText}>📌 daily discussion </Text>

                                { this.renderDiscussionBadge() }
                        </TouchableOpacity>


                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "feedback"
                                })
                            }
                            style={styles.subscriptionCell}>
                                <Text style={styles.buttonText}>📌 feedback </Text>

                                { this.renderFeedbackBadge() }
                        </TouchableOpacity>

                        <Text style={styles.tempText}> more rooms coming soon 😁 </Text>


                    </View>

            
                

            </View>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#9E9E9E" />
              </View>
            );
          }
        return (
            <View style= {{backgroundColor: '#000000'}}>
                <FlatList
                    // data={this.state.userPostsArray}
                    // renderItem={renderItem}
                    // keyExtractor={item => item.key}
                    ListHeaderComponent={this.renderSubscriptionHeader}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onRefresh={ this.refresh }
                    refreshing={this.state.isLoading}
                    // onEndReached={() => {this.getMore()}}
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
        backgroundColor: '#000000',
        paddingBottom: Dimensions.get('window').height - 450,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    button: {
        paddingTop: 10,
        backgroundColor: '#121212',
        flex: 1,
        width: Dimensions.get('window').width,
        marginTop: 5,
        borderBottomWidth: 1,
        borderRadius: 15,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    subscriptionCell : {
        marginTop: 10,
        borderBottomWidth: 1,
        borderRadius: 15,
        // flex: 1/3,
        width: Dimensions.get('window').width,
        backgroundColor: '#121212',
        color: '#FFFFFF',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10
    },
    tempText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        justifyContent: 'center',
        paddingTop: 24,
    }
})

export default ChatRooms;