import React from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
// import Firebase from '../../firebase'


class Chat extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    //---------------------------------------------------------------

    render() {

        return (
            <View style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
                <Text style = {styles.bioText}> chat/daily discussion coming soon </Text>
            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    bioText: {
        fontSize: 16,
        alignContent: 'center',
        padding: 20,
        color: '#000000'
    },
})

export default Chat;