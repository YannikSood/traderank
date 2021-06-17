import React, { useState, useEffect } from 'react';
import {  Alert, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import TimeAgo from 'react-native-timeago';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../../firebase';
import LikeComponent from './FFCcomponents/likeComponent';
import UserComponent from './FFCcomponents/userComponent';
import ShareComponent from './FFCcomponents/shareComponent';
import CommentIconComponent from './FFCcomponents/commentIconComponent';
import DeleteComponent from './FFCcomponents/deleteComponent';
import MiscUserComponent from './FollowCellComps/userComponent';
import CachedImage from '../image/CachedImage';

//The cell you see when you scroll through the home screen

const FeedCellClass = (props) => {
      const { username, image, ticker, security, description, profit_loss, percent_gain_loss, gain_loss, postID, navigation, date_created, viewsCount} = props;
 

      const [isLoaded, setIsLoaded] = useState(false);
      const currentUser = firebase.auth().currentUser.uid;
      const [currentUserPosted, setCurrentUserPosted] = useState(false);
      const [modalOpen, setModalOpen] = useState(false);
      const posterUID = props.uid;
    
  
  useEffect(() => {
    console.log(`posterUID: ${posterUID}`);
    // setTimeout(
    //   function() {
    //       setIsLoaded(true);
    //   }
    //   .bind(this),
    //   500
    // );
    // setTimeout(() => setIsLoaded(true), 500)
    setIsLoaded(true);

    if (posterUID == currentUser) {
      setCurrentUserPosted(true);
    }

  })

  if (isLoaded === false) {
    setIsLoaded(true);
    return (
      <View style={{ flexDirection: 'row', color: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
   
  }

    const renderGainLoss = () => {
      if (gain_loss === 'gain') {
        return (
          <View styles={{ flexDirection: 'row' }}>
            <Text style={styles.pnlContainer}>
              <Text style={styles.gainText}>
  $
                {profit_loss}
              </Text>

              <Text style={styles.regularTradeText}> 🚀</Text>
              <Text style={styles.gainText}>
                {percent_gain_loss}
  %
              </Text>
            </Text>

          </View>

        );
      }
      if (gain_loss === 'loss') {
        return (
          <View styles={{ flexDirection: 'row' }}>
            <Text style={styles.pnlContainer}>
              <Text style={styles.lossText}>
-$
                {profit_loss}
              </Text>
              <Text style={styles.tradeText}> 🥴 </Text>
              <Text style={styles.lossText}>
-
                {percent_gain_loss}
%
              </Text>
              {/* <Text style={styles.tradeText}> on </Text> */}
            </Text>
          </View>
        );
      }
      return (
        <View styles={{ flexDirection: 'row' }}>
          <View>
            <Text style={styles.pnlContainer}>
              <Text style={styles.yoloText}>
    $
                {profit_loss}

    🙏TRADE
              </Text>
              {/* <Text style={styles.yoloText}>    </Text> */}
            </Text>
          </View>

        </View>
      );
    }

    const showPostPage = () => {
      // console.log(date_created);
      navigation.push('ClickedPostPage',
        {
          username: username,
          image: image,
          ticker: ticker,
          security: security,
          description: description,
          profit_loss: profit_loss,
          percent_gain_loss: percent_gain_loss,
          gain_loss: gain_loss,
          postID: postID,
          date_created: date_created,
        });
    }

    const renderCellComponents = () => {
      if (posterUID == currentUser) {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 4, color: '#FFFFFF' }}>

            <View style={styles.buttonContainer}>

              <View style={{ paddingTop: 2 }}>
                <LikeComponent postID={postID} />

              </View>

            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => showPostPage()}
            >


              <CommentIconComponent postID={postID} />

            </TouchableOpacity>

            <View style={styles.buttonContainer}>

              <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
                <Ionicons name="eye-sharp" size={24} color="white" />
                <Text style={{ color: '#FFFFFF', paddingLeft: 4, paddingTop: 4 }}>{viewsCount}</Text>
              </View>

            </View>


            <View style={styles.buttonContainer}>

              <ShareComponent
                postID={postID}
                image={image}
                gain_loss={gain_loss}
                profit_loss={profit_loss}
              />

            </View>


            <View style={styles.buttonContainer}>

              <View style={{ paddingBottom: 4 }}>
                <DeleteComponent postID={postID} postType={gain_loss} />
              </View>

            </View>

          </View>
        );
      }

      return (

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 4, color: '#FFFFFF' }}>

          <View style={styles.buttonContainer}>

            <LikeComponent postID={postID} />

          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => showPostPage()}
          >


            <CommentIconComponent postID={postID} />

          </TouchableOpacity>

          <View style={styles.buttonContainer}>


            <View style={{ paddingBottom: 2, flexDirection: 'row' }}>
              <Ionicons name="eye-sharp" size={24} color="white" />
              <Text style={{ color: '#FFFFFF', paddingLeft: 4, paddingTop: 4 }}>{viewsCount}</Text>
            </View>

          </View>

          <View style={styles.buttonContainer}>

            <ShareComponent
              postID={postID}
              image={image}
              gain_loss={gain_loss}
              profit_loss={profit_loss}
            />

          </View>


        </View>
      );
    }

    const openImageModal = () => {
      setModalOpen(true);
    }

    const closeImageModal = () => {
      setModalOpen(false);
    }



      if (isLoaded === false) {
        return (
          <View style={styles.gainFeedCell}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }

      return (
        <View style={styles.gainFeedCell}>

          <Modal
            isVisible={modalOpen}
            animationIn="fadeIn"
            onSwipeComplete={() => closeImageModal()}
            swipeDirection="down"
          >

            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>


            { isLoaded === true ? 
                <CachedImage
                  source={{ uri: `${image}` }}
                  cacheKey={`${image}t`}
                  backgroundColor="transparent"
                  style={styles.fullScreenImage}
                />
                :
                <ActivityIndicator size="large" color="#9E9E9E" />
            }

            </View>
          </Modal>

          <View>
            {/* <View style={{flexDirection: 'column', padding: 6, justifyContent: 'center', alignItems: 'left' }}> */}

            <View style={{ flexDirection: 'column', paddingTop: 10, paddingLeft: 4 }}>
              <View style={{ flexDirection: 'row', paddingLeft: 17 }}>
                <MiscUserComponent uid={posterUID} navigation={navigation} />
              </View>


            </View>
            {/* </View> */}


            {/* <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.push('Chat',
                                {
                                    roomName: "announcements"
                                })
                            }
                            style={styles.subscriptionCell}>
                                <Text style={styles.buttonText}>📌 announcements </Text>
                                { this.renderAnnouncementBadge() }
                        </TouchableOpacity> */}

          </View>

          <View style={styles.descriptionContainer}>

            <Text style={styles.descriptionText}>

              {description}
            </Text>

          </View>


          <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 5 }}>
            {renderGainLoss() }
            <TouchableOpacity
              onPress={() => props.navigation.navigate('SingleStockPosts', {
                ticker: ticker,
              })
                        }
              style={{ backgroundColor: 'transparent',
                borderColor: '#696969',
                borderWidth: 1,
                borderRadius: 15,
                marginTop: 10,
                marginBottom: 12,
                marginLeft: 5,
                padding: 0 }}
            >
              <Text style={styles.tradeText}>
                        $
                {ticker}
              </Text>

            </TouchableOpacity>

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#696969', paddingTop: 10, marginLeft: 10 }}>
    #
              {security}
              {' '}
            </Text>
          </View>

          <TouchableOpacity onPress={() => openImageModal()}>
            <View style={styles.thumbnailContainer}>

            { isLoaded === true ? 
                        <CachedImage
                        source={{ uri: `${image}` }}
                        cacheKey={`${image}t`}
                        backgroundColor="transparent"
                        style={styles.thumbnail}
                    />
                            :
                            <ActivityIndicator size="large" color="#9E9E9E" />
              }
            </View>
          </TouchableOpacity>


          {/* <View style={styles.lineStyle} /> */}


          {renderCellComponents()}


          {/* <View style={styles.lineStyle} /> */}


        </View>
      );
    
}


const styles = StyleSheet.create({
  gainFeedCell: {
    marginTop: 10,
    // // paddingVertical: 5,
    // backgroundColor: '#FFFFFF',
    // opacity: 0.08,
    // shadowColor: '#FFFFFF',
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 15,
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

export default FeedCellClass;
