import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Firebase from '../../../firebase'


class ProfileStats extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            userUID: this.props.userUID,
            postCount: this.props.postCount,
            followerCount: this.props.followerCount,
            followingCount: this.props.followingCount,
        }
    }

    openFollowingList = () => {
        this.props.navigation.navigate('ClickedFollowPage', {
            clickedUID: this.state.userUID,
            followers_following: 'following',
            navigation: this.props.navigation
        })
    }

    openFollowerList = () => {
        this.props.navigation.navigate('ClickedFollowPage', {
            clickedUID: this.state.userUID,
            followers_following: 'followers',
            navigation: this.props.navigation
        })
    }


    //---------------------------------------------------------------

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}>
                <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                    <Text style = {styles.tradeText}>{this.state.postCount}</Text>
                    <Text style = {{ color: '#FFFFFF'}}> posts </Text>
                </View>

                <TouchableOpacity 
                   onPress={() => this.openFollowerList()}>
                    <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                        <Text style = {styles.tradeText}>{this.state.followerCount}</Text>
                        <Text style = {{ color: '#FFFFFF'}}> followers </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                   onPress={() => this.openFollowingList()}>
                    <View style = {{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>
                        <Text style = {styles.tradeText}>{this.state.followingCount}</Text>
                        <Text style = {{ color: '#FFFFFF'}}> following </Text>
                    </View>
                </TouchableOpacity>
                
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