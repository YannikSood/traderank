import React, { useState, useEffect }  from 'react';
import {  FlatList, View, Text, StyleSheet, KeyboardAvoidingView, Image, Dimensions, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import TimeAgo from 'react-native-timeago';
import * as Analytics from 'expo-firebase-analytics';
import { connect, useDispatch } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Firebase from '../../firebase';
import UserComponent from '../cells/FFCcomponents/userComponent';
import CommentCellClass from '../cells/commentCellClass';
import CommentComponent from '../cells/FFCcomponents/commentComponent';
// import ReplyButton from './replyButton';


const mapStateToProps = state => ({
  user: state.UserReducer.user,
});

const ClickedPostPage = ({ props, route, navigation }) => {
  const { username, image, ticker, security, description, profit_loss, percent_gain_loss, gain_loss, postID, date_created } = route.params;


  const [isLoading, setIsLoading] = useState(false);
  const currentUser = Firebase.auth().currentUser.uid;
  const [currentUsername, setCurrentUsername] = useState('');
  const [commentsArray, setCommentsArray] = useState([]);
  const [currentViewsCount, setCurrentViewsCount] = useState(0);
  const [replyTo, setReplyTo] = useState('');
  const [replyData, setReplyData] = useState({});

  useEffect(() => {
    setIsLoading(true);
    Analytics.logEvent('Comments_Clicked');
    Analytics.setCurrentScreen('CommentsScreen');

    Firebase.firestore()
      .collection('globalPosts')
      .doc(postID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCurrentViewsCount(doc.data().viewsCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    Firebase.firestore()
      .collection('users')
      .doc(currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCurrentUsername(doc.data().username);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    Firebase.firestore()
      .collection('globalPosts')
      .doc(postID)
      .set({
        viewsCount: currentViewsCount + 1,
      }, { merge: true });

    fetchCollection();
  }, []);

  const refresh = () => {
    setIsLoading(true);
    fetchCollection();
  };

  const fetchCollection = async() => {
    const tempCommentsArray = [];

    await Firebase.firestore()
      .collection('comments')
      .doc(postID)
      .collection('comments')
      .orderBy('date_created', 'asc')
      .get()
      .then((doc) => {
        doc.forEach((res) => {
          const {
            commentLikes,
            commentText,
            commentorUID,
            commentorUsername,
            date_created,
            replyCount } = res.data();

          tempCommentsArray.push({
            key: res.id,
            commentLikes,
            commentText,
            commentorUID,
            commentorUsername,
            date_created,
            replyCount,

          });
        });

        setCommentsArray(tempCommentsArray);
        setIsLoading(false);
      });
  };

  const renderGainLoss = () => {
    if (gain_loss === 'gain') {
      return (
        <Text style={styles.pnlContainer}>
          <Text style={styles.gainText}>
$
            {profit_loss}
          </Text>
          <Text style={styles.regularTradeText}>  🚀  </Text>
          <Text style={styles.gainText}>
            {percent_gain_loss}
%
          </Text>
        </Text>

      );
    }
    if (gain_loss === 'loss') {
      return (
        <Text style={styles.pnlContainer}>
          <Text style={styles.lossText}>
-$
            {profit_loss}
          </Text>
          <Text style={styles.tradeText}>  🥴  </Text>
          <Text style={styles.lossText}>
-
            {percent_gain_loss}
%
          </Text>
        </Text>
      );
    }
    return (
      <Text style={styles.pnlContainer}>
        <Text style={styles.yoloText}>
$
          {profit_loss}
          {' '}
🙏  trade
        </Text>
      </Text>
    );
  };

  const renderListHeader = () => {
    if (isLoading) {
      return (
        <View style={styles.noCommentsContainer}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <View style={getContainerStyle()}>

        <View>
          <View style={{ flexDirection: 'row', padding: 6, justifyContent: 'space-between', alignItems: 'left' }}>

            <View style={{ flexDirection: 'column', paddingTop: 10, paddingLeft: 4 }}>
              <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
                <UserComponent
                  postID={postID}
                  navigation={navigation}
                />
              </View>

            </View>

            <View style={{ flexDirection: 'column', paddingTop: 10, paddingRight: 10 }}>
              <Text style={styles.tradeText}>
$
                {ticker}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', alignContent: 'center', color: '#696969', paddingRight: 10 }}>
#
                {security}
                {' '}
              </Text>
            </View>


          </View>
        </View>

        <View style={styles.descriptionContainer}>

          <Text style={styles.descriptionText}>
            {' '}
            {description}
          </Text>

        </View>

        <View style={styles.timeContainer}>
          <TimeAgo style={{ color: '#696969' }} time={date_created} />
        </View>

        <View style={styles.lineStyle} />

      </View>
    );
  };

  const getContainerStyle = () => {
    if (commentsArray.length === 0) {
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
    };
  };


  const renderItem = ({ item }) => (

    <CommentCellClass
      key={item.key}
      commentLikes={item.commentLikes}
      commentText={item.commentText}
      commentorUID={item.commentorUID}
      commentorUsername={item.commentorUsername}
      navigation={navigation}
      date_created={item.date_created.toDate()}
      commentID={item.key}
      postID={postID}
      replyCount={item.replyCount}
      button={(
        <TouchableOpacity
          onPress={() => {
            //just set state of replyTo in componentUpdate from async storage
            //StoreReplyTo
            const storeReplyTo = async(value) => {
              try {
                await AsyncStorage.setItem('replyTo', value);
              } catch (e) {
                // saving error
              }
            };

            storeReplyTo(`${item.commentorUsername}`);
            setReplyTo(`${item.commentorUsername}`);

            //sotre who to reply to
            const replyDataObj = {
              postID: `${postID}`, //post the comment I am replying to
              commentID: `${item.key}`, //Id of the comment I am replying to
              replyingToUsername: `${item.commentorUsername}`,
              replyingToUID: `${item.commentorUID}`, //person who made the comment I am replying to
              replierAuthorUID: `${currentUser}`, //person sending the reply
              replierUsername: `${currentUsername}`,
              commentLikes: 0,
              //may need to change
            };
            console.log(replyDataObj);

            //replyData that will be stored in the DB
            const storeReplyData = async(value) => {
              try {
                const jsonValue = JSON.stringify(value);
                await AsyncStorage.setItem('replyData', jsonValue);
              } catch (e) {
                // saving error
              }
            };
            setReplyData(replyDataObj);
            storeReplyData(replyDataObj);
          }}
        >

          <View style={{ paddingLeft: 15, paddingRight: 15 }}>

            <Entypo name="reply" size={22} color="white" />

          </View>
        </TouchableOpacity>
)}
    />
  );

  return (
    <View style={{ backgroundColor: '#000000' }}>

      <FlatList
        data={commentsArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)} //keyExtractor={item => item.key}
        ListHeaderComponent={renderListHeader()}
        contentContainerStyle={{ paddingBottom: Dimensions.get('window').height }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={isLoading}
      />

      <KeyboardAvoidingView
        style={styles.commentFooter}
        behavior="padding"
        enabled
        keyboardVerticalOffset={100}
      >
        <CommentComponent postID={postID} replyTo={replyTo} replyData={replyData} />
      </KeyboardAvoidingView>
    </View>

  );
};


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
    paddingBottom: 15,
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
    margin: 20,
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
});

export default connect(mapStateToProps)(ClickedPostPage);
