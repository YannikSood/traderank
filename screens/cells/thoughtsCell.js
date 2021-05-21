/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import {  Alert, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import TimeAgo from 'react-native-timeago';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Video, AVPlaybackStatus } from 'expo-av';
import firebase from '../../firebase';
import LikeComponent from './FFCcomponents/likeComponent';
import CommentIconComponent from './FFCcomponents/commentIconComponent';
import DeleteComponent from './FFCcomponents/deleteComponent';
import MiscUserComponent from './FollowCellComps/userComponent';
import CachedImage from '../image/CachedImage';


//The cell you see when you scroll through the home screen

class ThoughtsCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      image: this.props.image,
      description: this.props.description,
      postID: this.props.postID,
      link: this.props.link,
      navigation: this.props.navigation,
      date_created: this.props.date_created,
      viewsCount: this.props.viewsCount,
      isLoading: true,
      currentUser: firebase.auth().currentUser.uid,
      posterUID: this.props.uid,
      currentUserPosted: false,
      mediaType: this.props.mediaType,
      modalOpen: false,
    };
  }

  componentDidMount() {
    if (this.state.posterUID === this.state.currentUser) {
      this.setState({ currentUserPosted: true });
    }
    this.setState({ isLoading: false });
  }

    openImageModal = () => {
      this.setState({ modalOpen: true });
    }

    closeImageModal = () => {
      this.setState({ modalOpen: false });
    }

    renderImageOrVideo = () => (
        <View>
          { this.state.mediaType === 'image' ? (
            <TouchableOpacity onPress={() => this.openImageModal()}>
              <View style={styles.thumbnailContainer}>
    
                 <CachedImage
                  source={{ uri: `${this.state.image}` }}
                  cacheKey={`${this.state.image}t`}
                  backgroundColor="transparent"
                  style={styles.thumbnail}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.thumbnailContainer}>
              <Video
                source={{ uri: this.state.image }}
                style={styles.thumbnail}
                isLooping
                useNativeControls
                // shouldPlay
              />
            </View>
          ) }
        </View>
    )

    renderCellComponents = () => {
      if (this.state.posterUID === this.state.currentUser) {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 4, color: '#FFFFFF' }}>

            <View style={styles.buttonContainer}>

              <View style={{ paddingTop: 2 }}>
                <LikeComponent postID={this.state.postID} />

              </View>

            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.showPostPage()}
            >


              <CommentIconComponent postID={this.state.postID} />

            </TouchableOpacity>

            {/* <View style={styles.buttonContainer}>

              <ShareComponent
                postID={this.state.postID}
                image={this.state.image}
                gain_loss={this.state.gain_loss}
                profit_loss={this.state.profit_loss}
              />

            </View> */}


            <View style={styles.buttonContainer}>

              <View style={{ paddingBottom: 4 }}>
                <DeleteComponent postID={this.state.postID} postType={this.state.gain_loss} />
              </View>

            </View>

          </View>
        );
      }
      return (

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 4, color: '#FFFFFF' }}>

          <View style={styles.buttonContainer}>

            <LikeComponent postID={this.state.postID} />

          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.showPostPage()}
          >


            <CommentIconComponent postID={this.state.postID} />

          </TouchableOpacity>

          {/* <View style={styles.buttonContainer}>

            <ShareComponent
              postID={this.state.postID}
              image={this.state.image}
              gain_loss={this.state.gain_loss}
              profit_loss={this.state.profit_loss}
            />

          </View> */}


        </View>
      );
    }

    render() {
      if (this.state.isLoading) {
        return (
          <View style={styles.gainFeedCell}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }

      return (
        <View style={styles.gainFeedCell}>

          <Modal
            isVisible={this.state.modalOpen}
            animationIn="fadeIn"
            onSwipeComplete={() => this.closeImageModal()}
            swipeDirection="down"
          >

            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                <CachedImage
                  source={{ uri: `${this.state.image}` }}
                  cacheKey={`${this.state.image}t`}
                  backgroundColor="transparent"
                  style={styles.fullScreenImage}
                />
            </View>
          </Modal>

          <View>
            {/* <View style={{flexDirection: 'column', padding: 6, justifyContent: 'center', alignItems: 'left' }}> */}

            <View style={{ flexDirection: 'column', paddingTop: 10, paddingLeft: 4 }}>
              <View style={{ flexDirection: 'row', paddingLeft: 17 }}>
                <MiscUserComponent uid={this.state.posterUID} navigation={this.state.navigation} />
              </View>


            </View>
          </View>

          <View style={styles.descriptionContainer}>

            <Text style={styles.descriptionText}>

              {this.state.description}
            </Text>

          </View>

          { this.state.mediaType === 'none' ? <View /> : (
            this.renderImageOrVideo()
          ) }

        </View>
      );
    }
}


const styles = StyleSheet.create({
  gainFeedCell: {
    marginTop: 10,
    // marginBottom: 5,
    // // paddingVertical: 5,
    // backgroundColor: '#FFFFFF',
    // opacity: 0.08,
    // shadowColor: '#FFFFFF',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderRadius: 15,
    // width: Dimensions.get('window').width - 20,
    // flex: 1 / 3,
    backgroundColor: '#121212',
    color: '#FFFFFF',
    // alignItems: 'center'
  },
  tradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    // paddingTop: 15,
    color: '#FFFFFF',
    // paddingTop: 20
  },
  regularText: {
    fontSize: 18,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
    paddingHorizontal: 0,
  },
  regularTradeText: {
    fontSize: 18,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  gainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00cc00',
  },
  lossText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000',
  },
  yoloText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  descriptionText: {
    fontSize: 15,
    color: '#FFFFFF',
    alignContent: 'center',
    paddingRight: 10,
  },
  textContainer: {
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#121212',
  },
  pnlContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    // backgroundColor: '#121212'
  },
  securityContainer: {
    flexDirection: 'column',
    alignContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  descriptionContainer: {
    alignItems: 'flex-start',
    paddingLeft: 27,
    padding: 10,
    backgroundColor: '#121212',
  },
  // timeContainer: {
  //     paddingLeft: 20,
  //     color: '#FFFFFF',
  //     // backgroundColor: '#696969'
  // },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    // marginRight: 22,
    paddingTop: 5,
    paddingBottom: 10,
    color: '#FFFFFF',
    // backgroundColor: '#696969'
  },
  thumbnailContainer: {
    flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingRight: 25,
    backgroundColor: '#121212',
  },
  thumbnail: {
    width:  Dimensions.get('window').width - 50,
    height: 300,
    borderRadius: 15,
  },
  fullScreenImage: {
    width:  Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: '#696969',
    width: Dimensions.get('window').width,
    // marginBottom: 10,
  },
});

export default ThoughtsCell;
