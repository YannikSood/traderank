import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import Firebase from '../../firebase'

class ChatRooms extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            image: null
        }
    }

    componentDidMount () {
        Analytics.setCurrentScreen("ChatRooms")
    }

    
    render() {
        this.setChatNotifications()
        Analytics.setCurrentScreen("ChatRooms")
    }

    setChatNotifications = () => {
        Firebase.firestore()
        .collection('users')
        .doc(Firebase.auth().currentUser.uid)
        .set({ hasChatNotifications: false }, {merge: true})
    }
    
    // renderChatRoomBadge = () => {
    //     // const hasLoungeNotifications
    // }

    getUserSubscriptions = () => {

    }

    renderSubscriptionHeader = () => {
        return (
            <View style={styles.container}>
            
                    <View style = {{flexDirection: 'column'}}>

                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "announcements"
                                })
                            }
                            style={styles.subscriptionCell}>
                                <Text style={styles.buttonText}>📌 announcements </Text>

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
                        </TouchableOpacity>


                    </View>

            
                

            </View>
        )
    }

    render() {
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
                    // onRefresh={this._refresh}
                    // refreshing={this.state.isLoading}
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
        paddingBottom: Dimensions.get('window').height - 100
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
    }
})

export default ChatRooms;