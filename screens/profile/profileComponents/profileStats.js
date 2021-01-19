import React from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import Firebase from '../../../firebase'


class ProfileStats extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            postCount: this.props.postCount,
            followerCount: this.props.followerCount,
            followingCount: this.props.followingCount,
        }
    }
    //---------------------------------------------------------------

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
                <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                    <Text style = {styles.tradeText}>{this.state.postCount}</Text>
                    <Text style = {{ color: '#FFFFFF'}}> posts </Text>
                </View>

                <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                    <Text style = {styles.tradeText}>{this.state.followerCount}</Text>
                    <Text style = {{ color: '#FFFFFF'}}> followers </Text>
                </View>

                <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                    <Text style = {styles.tradeText}>{this.state.followingCount}</Text>
                    <Text style = {{ color: '#FFFFFF'}}> following </Text>
                </View>
                
            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        color: '#FFFFFF'
    },
})

export default ProfileStats;