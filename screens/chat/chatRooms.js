import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
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

    render() {
        return (
            <View style={styles.container}>
            
                    <View style = {{flexDirection: 'column'}}>
                        {/* <Text style={styles.headerText}>Chat Rooms</Text> */}

                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "lounge"
                                })
                            }
                            style={styles.button}>
                                <Text style={styles.buttonText}>chill lounge 🚬</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "stocks"
                                })
                            }
                            style={styles.button}>

                                <Text style={styles.buttonText}>stock talk 💎</Text>

                        </TouchableOpacity>


                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "options"
                                })
                            }
                            style={styles.button}>
                                <Text style={styles.buttonText}>options chat 🚀</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "crypto"
                                })
                            }
                            style={styles.button}>
                                <Text style={styles.buttonText}>crypto conference 💰</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "spacs"
                                })
                            }
                            style={styles.button}>
                                <Text style={styles.buttonText}>SPAC clack 🪄</Text>
                        </TouchableOpacity>


                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "ideas"
                                })
                            }
                            style={styles.button}>
                                <Text style={styles.buttonText}>ideas space 💡</Text>
                        </TouchableOpacity>


                        


                        <TouchableOpacity 
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "devs"
                                })
                            }
                            style={styles.button}>
                                <Text style={styles.buttonText}>talk to the developers 🤝</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity 
                            onPress={() => this.props.navigation.push('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>feedback and feature request</Text>
                        </TouchableOpacity> */}



                    </View>

            
                

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
    }
})

export default ChatRooms;