import React, { useState } from 'react';
import {  FlatList, View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Image, Dimensions, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import TimeAgo from 'react-native-timeago';
import Modal from 'react-native-modal';
import { Ionicons, Entypo } from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import LikeComponent from '../cells/TFCcomponents/likeComponent';
import DeleteComponent from '../cells/TFCcomponents/deleteComponent';
import CommentIconComponent from '../cells/TFCcomponents/commentIconComponent';
import MiscUserComponent from '../cells/FollowCellComps/userComponent';
import CachedImage from '../image/CachedImage';
import { Video, AVPlaybackStatus } from 'expo-av';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});

/**
 *Single post information.
 */
class ThoughtsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.route.params.username,
      image: this.props.route.params.image,
      description: this.props.route.params.description,
      postID: this.props.route.params.postID,
      link: this.props.route.params.link,
      navigation: this.props.route.params.navigation,
      date_created: this.props.route.params.date_created,
      viewsCount: this.props.route.params.viewsCount,
      isLoading: true,
      currentUser: firebase.auth().currentUser.uid,
      posterUID: this.props.route.params.uid,
      mediaType: this.props.route.params.mediaType,
      modalOpen: false,
      commentsArray: [],
      currentViewsCount: 0,
    };
    // console.log(this.props.Tusername + " username")
  }

  async componentDidMount() {
    //Not replying ot anyone
    //update replyingTo storage variable here?
    Analytics.logEvent('Thoughts_Details_Clicked');
    Analytics.setCurrentScreen('ThoughtsDetailsScreen');
    await firebase.firestore()
      .collection('thoughts')
      .doc(this.state.postID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            currentViewsCount: doc.data().viewsCount,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    await firebase.firestore()
      .collection('thoughts')
      .doc(this.state.postID)
      .set({
        viewsCount: this.state.currentViewsCount + 1,
      }, { merge: true });

    this.getCollection();
  }



    componentWillUnmount = () => {
      console.log('unmounted post');
    }

    getCollection = () => {
      const commentsArray = [];
      this.setState({
        commentsArray,
        isLoading: false,
      });
    }


    showThoughtsCommentsPage = async() => {
      // console.log(this.state.Tusername)
      this.props.navigation.push('ThoughtsComments',
        {
          username: this.state.username,
          description: this.state.description,
          image: this.state.image,
          date_created: this.state.date_created,
          likesCount: this.state.likesCount,
          commentsCount: this.state.commentsCount,
          viewsCount: this.state.viewsCount,
          category: this.state.category,
          postID: this.state.postID,
          posterUID: this.state.posterUID,
          link: this.state.link,
          mediaType: this.state.mediaType,
        });
    }

    _refresh = () => {
      this.setState({ isLoading: true });
      this.getCollection()
    };

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
              onPress={() => this.showThoughtsCommentsPage()}
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
                <DeleteComponent postID={this.state.postID} />
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
            onPress={() => this.showThoughtsCommentsPage()}
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

    renderListHeader = () => {
      if (this.state.isLoading) {
        return (
          <View style={styles.noCommentsContainer}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }
      return (
        <View style={this.getContainerStyle()}>

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
              <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
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

          { this.renderCellComponents() }

        </View>
      );
    }



    getContainerStyle = () => {
      if (this.state.commentsArray.length == 0) {
        return {
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: '#000000',
          color: '#000000',
          height: Dimensions.get('window').height,
        };
      }
      return {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#000000',
        color: '#000000',
      };
    }

    openImageModal = () => {
      this.setState({ modalOpen: true });
    }

    closeImageModal = () => {
      this.setState({ modalOpen: false });
    }

    render() {
      const { navigation } = this.props;

      return (
        <View style={{ backgroundColor: '#000000' }}>

          <FlatList
            // data={this.state.commentsArray}
            // renderItem={renderItem}
            keyExtractor={(item, index) => String(index)} //keyExtractor={item => item.key}
            ListHeaderComponent={this.renderListHeader}
            contentContainerStyle={{ paddingBottom: Dimensions.get('window').height }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onRefresh={this._refresh}
            refreshing={this.state.isLoading}
          />
        </View>

      );
    }
}


const styles = StyleSheet.create({

  container: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#000000',
    color: '#000000',
  },
  noCommentsContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#000000',
    color: '#000000',
    height: Dimensions.get('window').height,
  },
  tradeText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignContent: 'center',
    color: '#FFFFFF',
    // paddingTop: 20
  },
  regularText: {
    fontSize: 18,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  regularTradeText: {
    fontSize: 20,
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  gainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00cc00',
  },
  lossText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cc0000',
  },
  yoloText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  textContainer: {
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#000000',
  },
  pnlContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 35,
    paddingLeft: 25,
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    // backgroundColor: '#121212'
  },
  securityContainer: {
    alignContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,

  },
  descriptionContainer: {
    alignItems: 'flex-start',
    paddingLeft: 22,
    padding: 10,
    backgroundColor: '#000000',
  },
  timeContainer: {
    paddingLeft: 25,
    // color: '#FFFFFF',
    // backgroundColor: '#FFFFFF'
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 22,
    marginRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  thumbnail: {
    width:  Dimensions.get('window').width - 50,
    height: 300,
    borderRadius: 15,
  },
  descriptionText: {
    fontSize: 15,
    color: '#FFFFFF',
    alignContent: 'center',
    paddingRight: 10,
  },
  fullScreenImage: {
    width:  Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  noCommentsFooter: {
    width: Dimensions.get('window').width,
    color: '#fff',
    backgroundColor: '#000000',
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 50,
  },
  commentFooter: {
    width: Dimensions.get('window').width,
    color: '#fff',
    backgroundColor: '#000000',
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 20,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'white',
    width: Dimensions.get('window').width,
    marginTop: 15,
    // margin: 10
  },
  thumbnailContainer: {
    // flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingRight: 25,
    // backgroundColor: '#121212',
  },
});

export default connect(mapStateToProps)(ThoughtsDetails);
