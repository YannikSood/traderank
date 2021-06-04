import React from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Firebase from '../../../firebase';
import CachedImage from '../../image/CachedImage';

class ProfilePic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storage_image_uri: this.props.storage_image_uri,
      isLoaded: false,
    };
  }

  componentDidMount() {
    setTimeout(
      () => {
        this.setState({ isLoaded: true });
      },
      500,
    );
  }

  render() {
    return (
      <View>
        { this.state.isLoaded === true
          ? (
            <CachedImage
              source={{ uri: `${this.state.storage_image_uri}` }}
              cacheKey={`${this.state.storage_image_uri}t`}
              backgroundColor="transparent"
              style={styles.thumbnail}
            />
          )
          : <ActivityIndicator size="large" color="#9E9E9E" />
            }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ProfilePic;
