import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import * as Analytics from 'expo-firebase-analytics';

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
        return (
            <View style={styles.container}>
            
                    <View style = {{flexDirection: 'column'}}>
                    <Text style={styles.headerText}>Chat Rooms</Text>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('Chat')}
                            style={styles.button}>

                                <Text style={styles.buttonText}>Stocks</Text>

                        </TouchableOpacity>


                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Options</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Cryptos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>SPACS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Daily Discussion</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Questions</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Feedback</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Ideas</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>Lounge</Text>
                        </TouchableOpacity>

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
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent:'center',
        color: '#696969'
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
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#FFFFFF'
    }
})

export default ChatRooms;