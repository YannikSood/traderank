import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Image, Share, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';

//Profile Components
import TimeAgo from 'react-native-timeago';
import * as Analytics from 'expo-firebase-analytics';
import { connect } from 'react-redux';
import ProfilePic from './profileComponents/profilePic.js';
import ProfileStats from './profileComponents/profileStats.js';
import ProfileBio from './profileComponents/profileBio.js';
import FeedCellClass from '../cells/feedCellClass';
import ThoughtsCell from '../cells/thoughtsCell';

//Redux
import firebase from '../../firebase';

const mapStateToProps = state => ({
  user: state.UserReducer.user,
});


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      bio: '',
      storage_image_uri: '',
      postCount: 0,
      followerCount: 0,
      followingCount: 0,
      isLoading: true,
      navigation: this.props.navigation,
      userUID: firebase.auth().currentUser.uid,
      userPostsArray: [],
      userThoughtsArray: [],
      modalOpen: false,
      dateJoined: null,
      twitter: '',
      instagram: '',
      postType: 'TRADES',
    };

    // console.log(firebase.auth().currentUser.uid);

    this.firestoreRef = firebase.firestore()
      .collection('globalPosts')
      .where('uid', '==', `${firebase.auth().currentUser.uid}`)
      .orderBy('date_created', 'desc')
      .limit(5);
  }

  componentDidMount() {
    this.pullUserInfo();
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    Analytics.logEvent('Profile_Clicked');
    Analytics.setCurrentScreen('MyProfileScreen');
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

    _refresh = () => {
      this.setState({ isLoading: true });
      this.pullUserInfo();
    };

    onShare = async() => {
      try {
        const result = await Share.share({
          title: 'you are invited',
          message: `hey! i want you to join traderank!! follow me @${this.state.user.username}`,
          url: 'https://apps.apple.com/us/app/traderank/id1546959332',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };


    getCollection = (querySnapshot) => {
      const userPostsArray = [];
      querySnapshot.forEach((res) => {
        const {
          username,
          uid,
          image,
          ticker,
          security,
          description,
          percent_gain_loss,
          profit_loss,
          gain_loss,
          date_created,
          viewsCount,
        } = res.data();

        userPostsArray.push({
          key: res.id,
          username,
          uid,
          image,
          ticker,
          security,
          description,
          percent_gain_loss,
          profit_loss,
          gain_loss,
          date_created,
          viewsCount,
        });
      });

      this.setState({
        userPostsArray,
      });
    }

    getMore = async() => {
      const lastItemIndex = this.state.userPostsArray.length - 1;

      await firebase.firestore()
        .collection('globalPosts')
        .where('uid', '==', `${firebase.auth().currentUser.uid}`)
        .orderBy('date_created', 'desc')
        .startAfter(this.state.userPostsArray[lastItemIndex].date_created)
        .limit(5)
        .onSnapshot((querySnapshot) => {
          const newPostsArray = [];
          querySnapshot.forEach((res) => {
            const {
              username,
              uid,
              image,
              ticker,
              security,
              description,
              percent_gain_loss,
              profit_loss,
              gain_loss,
              date_created,
              viewsCount,
            } = res.data();

            newPostsArray.push({
              key: res.id,
              username,
              uid,
              image,
              ticker,
              security,
              description,
              percent_gain_loss,
              profit_loss,
              gain_loss,
              date_created,
              viewsCount,
            });
          });


          this.setState({
            userPostsArray: this.state.userPostsArray.concat(newPostsArray),
          });
        });
    }

    getThoughtsCollection = async() => {
      const userThoughtsArray = [];

      await firebase.firestore()
        .collection('thoughts')
        .where('uid', '==', `${firebase.auth().currentUser.uid}`)
        .orderBy('date_created', 'desc')
        .limit(10)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((res) => {
            const {
              username,
              description,
              image,
              date_created,
              likesCount,
              commentsCount,
              viewsCount,
              category,
              postID,
              uid,
              link,
              mediaType,
            } = res.data();

            userThoughtsArray.push({
              key: res.id,
              username,
              description,
              image,
              date_created,
              likesCount,
              commentsCount,
              viewsCount,
              category,
              postID,
              uid,
              link,
              mediaType,
            });
          });

          this.setState({
            userThoughtsArray,
          });
        });
    }

    getMoreThoughts = async() => {
      const lastItemIndex = this.state.userThoughtsArray.length - 1;

      await firebase.firestore()
        .collection('thoughts')
        .where('uid', '==', `${firebase.auth().currentUser.uid}`)
        .orderBy('date_created', 'desc')
        .startAfter(this.state.userThoughtsArray[lastItemIndex].date_created)
        .limit(7)
        .get()
        .then((querySnapshot) => {
          const newThoughtsArray = [];
          querySnapshot.forEach((res) => {
            const {
              username,
              uid,
              image,
              ticker,
              security,
              description,
              percent_gain_loss,
              profit_loss,
              gain_loss,
              date_created,
              viewsCount,
            } = res.data();

            newThoughtsArray.push({
              key: res.id,
              username,
              uid,
              image,
              ticker,
              security,
              description,
              percent_gain_loss,
              profit_loss,
              gain_loss,
              date_created,
              viewsCount,
            });
          });


          this.setState({
            userPostsArray: this.state.userThoughtsArray.concat(newThoughtsArray),
          });
        });
    }

    pullUserInfo = async() => {
      firebase.firestore()
        .collection('users')
        .doc(this.state.userUID)
        .get()
        .then((doc) => {
          this.setState({
            postCount: doc.data().postCount,
            followerCount: doc.data().followerCount,
            followingCount: doc.data().followingCount,
            storage_image_uri: doc.data().profilePic,
            bio: doc.data().bio,
            dateJoined: doc.data().signupDate.toDate(),
            twitter: doc.data().twitter,
            instagram: doc.data().instagram,
            isLoading: false,
          });
        })
        .catch((err) => {
          reject(err);
        });
    }

    gotToSettings() {
      this.state.navigation.navigate('Settings');
    }

    goToEditProfile() {
      this.state.navigation.navigate('EditProfile');
    }

    openImageModal = () => {
      this.setState({ modalOpen: true });
    }

    closeImageModal = () => {
      this.setState({ modalOpen: false });
    }

    renderTwitterAndInstagram = () => {
      if (this.state.twitter === undefined && this.state.instagram === undefined) {
        return (
          <View />
        );
      }
      if (this.state.twitter !== undefined && this.state.instagram === undefined) {
        return (
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <FontAwesome
              onPress={() => Linking.openURL(`http://twitter.com/${this.state.twitter}`)}
              name="twitter"
              size={35}
              color="#1DA1F2"
            />
          </View>
        );
      }
      if (this.state.twitter === undefined && this.state.instagram !== undefined) {
        return (
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <AntDesign
              onPress={() => Linking.openURL(`http://instagram.com/${this.state.instagram}`)}
              name="instagram"
              size={35}
              color="#E1306C"
            />
          </View>
        );
      }

      if (this.state.twitter === '' && this.state.instagram === '') {
        return (
          <View />
        );
      }
      if (this.state.twitter !== '' && this.state.instagram === '') {
        return (
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <FontAwesome
              onPress={() => Linking.openURL(`http://twitter.com/${this.state.twitter}`)}
              name="twitter"
              size={35}
              color="#1DA1F2"
            />
          </View>
        );
      }
      if (this.state.twitter === '' && this.state.instagram !== '') {
        return (
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <AntDesign
              onPress={() => Linking.openURL(`http://instagram.com/${this.state.instagram}`)}
              name="instagram"
              size={35}
              color="#E1306C"
            />
          </View>
        );
      }

      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <FontAwesome
              onPress={() => Linking.openURL(`http://twitter.com/${this.state.twitter}`)}
              name="twitter"
              size={35}
              color="#1DA1F2"
            />
          </View>

          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <AntDesign
              onPress={() => Linking.openURL(`http://instagram.com/${this.state.instagram}`)}
              name="instagram"
              size={35}
              color="#E1306C"
            />
          </View>
        </View>
      );
    }


    renderListHeader = () => {
      if (this.state.userPostsArray.length === 0) {
        return (
          <View style={styles.noPostContainer}>
            <Modal
              isVisible={this.state.modalOpen}
              animationIn="fadeIn"
              onSwipeComplete={() => this.closeImageModal()}
              swipeDirection="down"
            >

              <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>

                <Image
                  source={{ uri: this.state.storage_image_uri }}
                  style={styles.fullScreenImage}
                />
              </View>
            </Modal>

            <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.subheader}>
                {' '}
                @
                {this.state.user.username}
                {' '}
              </Text>
            </View>

            <View style={{ flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center' }}
            >

              <TouchableOpacity
                onPress={() => this.openImageModal()}
              >

                <ProfilePic storage_image_uri={this.state.storage_image_uri} />

              </TouchableOpacity>


              <View style={{ paddingLeft: 30 }}>
                <ProfileStats navigation={this.props.navigation} userUID={this.state.userUID} postCount={this.state.postCount} followerCount={this.state.followerCount} followingCount={this.state.followingCount} />
              </View>

            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <ProfileBio bio={this.state.bio} />
            </View>


            {/* <View style={{ flexDirection: 'row', paddingLeft: 25, paddingTop: 15 }}>

              <Text style={{ flexDirection: 'row', color: '#FFFFFF' }}>

                <FontAwesome name="birthday-cake" size={14} color="#FCAF45" />
                <Text>
                  {' '}
                  {this.state.user.username}
                  {' '}
joined
                  {' '}
                </Text>
                <TimeAgo style={{ color: '#FFFFFF' }} time={this.state.dateJoined} />
                <Text />

              </Text>

            </View> */}

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              { this.renderTwitterAndInstagram() }
            </View>


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

              <TouchableOpacity
                onPress={() => this.goToEditProfile()}
                style={styles.button}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>edit profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.gotToSettings()}
                style={styles.button}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>settings</Text>
              </TouchableOpacity>


            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => this.onShare()}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>invite friends to traderank</Text>
              </TouchableOpacity>
            </View>


          </View>

        );
      }
      return (
        <View style={styles.container}>
          <Modal
            isVisible={this.state.modalOpen}
            animationIn="fadeIn"
            onSwipeComplete={() => this.closeImageModal()}
            swipeDirection="down"
          >

            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>

              <Image
                source={{ uri: this.state.storage_image_uri }}
                style={styles.fullScreenImage}
              />
            </View>
          </Modal>

          <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.subheader}>
              {' '}
              @
              {this.state.user.username}
              {' '}
            </Text>
          </View>

          <View style={{ flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center' }}
          >

            <TouchableOpacity
              onPress={() => this.openImageModal()}
            >

              <ProfilePic storage_image_uri={this.state.storage_image_uri} />

            </TouchableOpacity>


            <View style={{ paddingLeft: 30 }}>
              <ProfileStats navigation={this.props.navigation} userUID={this.state.userUID} postCount={this.state.postCount} followerCount={this.state.followerCount} followingCount={this.state.followingCount} />
            </View>

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ProfileBio bio={this.state.bio} />
          </View>


          {/* <View style={{ flexDirection: 'row', paddingLeft: 25, paddingTop: 15 }}>

            <Text style={{ flexDirection: 'row', color: '#FFFFFF' }}>

              <FontAwesome name="birthday-cake" size={14} color="#FCAF45" />
              <Text>
                {' '}
                {this.state.user.username}
                {' '}
joined
                {' '}
              </Text>
              <TimeAgo style={{ color: '#FFFFFF' }} time={this.state.dateJoined} />
              <Text />

            </Text>

          </View> */}

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            { this.renderTwitterAndInstagram() }
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

            <TouchableOpacity
              onPress={() => this.goToEditProfile()}
              style={styles.button}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.gotToSettings()}
              style={styles.button}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>settings</Text>
            </TouchableOpacity>

          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => this.onShare()}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>invite friends to traderank</Text>
            </TouchableOpacity>
          </View>


        </View>

      );
    }

    render() {
      const { navigation } = this.props;
      const renderItem = ({ item }) => (
        // { this.state.postType === 'TRADES' ?
        <FeedCellClass
          username={item.username}
          description={item.description}
          image={item.image}
          security={item.security}
          ticker={item.ticker}
          percent_gain_loss={item.percent_gain_loss}
          profit_loss={item.profit_loss}
          gain_loss={item.gain_loss}
          postID={item.key}
          navigation={navigation}
          date_created={item.date_created.toDate()}
          uid={item.uid}
          viewsCount={item.viewsCount}
        />

        //   :
        //     <ThoughtsCell
        //       username={item.username}
        //       description={item.description}
        //       image={item.image}
        //       postID={item.key}
        //       navigation={navigation}
        //       date_created={item.date_created}
        //       uid={item.uid}
        //       viewsCount={item.viewsCount}
        //       link={item.link}
        //       mediaType={item.mediaType}
        //     />

        // }
      );

      if (this.state.isLoading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }
      return (
        <View style={{ backgroundColor: '#000000' }}>
          <FlatList
            data={this.state.userPostsArray}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            ListHeaderComponent={this.renderListHeader}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onRefresh={this._refresh}
            refreshing={this.state.isLoading}
            onEndReached={() => { this.getMore(); }}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#000000',

  },
  noPostContainer: {
    paddingTop: 20,
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: '#000000',
    paddingBottom: Dimensions.get('window').height * 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',

  },
  profileInfoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  fullScreenImage: {
    width:  Dimensions.get('window').height * 0.4,
    height: Dimensions.get('window').height * 0.4,
    borderRadius: Dimensions.get('window').height * 0.2,
  },
  subheader: {
    fontSize: 22,
    fontWeight: 'bold',
    alignContent: 'center',
    color: '#FFFFFF',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    width: Dimensions.get('window').width,
    margin: 5,
  },
  button: {
    marginTop: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 150,
    marginRight: 10,
    marginLeft: 10,
  },
  shareButton: {
    marginTop: 15,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    width: 320,
  },
});

export default connect(mapStateToProps)(Profile);
