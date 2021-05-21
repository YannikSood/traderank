import React from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import firebase from '../../../firebase'


class ProfileBio extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            bio: this.props.bio,
        }
    }

    //---------------------------------------------------------------

    render() {
        if (this.state.bio == "") {
            this.setState({ bio: "No bio yet!"})
        }
        return (
            <View style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
                <Text style = {styles.bioText}> {this.state.bio} </Text>
            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    bioText: {
        fontSize: 16,
        alignContent: 'center',
        padding: 20,
        color: '#FFFFFF'
    },
})

export default ProfileBio;