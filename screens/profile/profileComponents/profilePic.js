import React from 'react'
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native'
import firebase from '../../../firebase'


class ProfilePic extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            storage_image_uri: this.props.storage_image_uri,
        }
    }
    //---------------------------------------------------------------

    render() {
        return (
            <View >
                <Image
                    source={{ uri: this.state.storage_image_uri }}
                    style={styles.thumbnail}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 50
      }
})

export default ProfilePic;