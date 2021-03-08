import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, FlatList, Share } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import * as Analytics from 'expo-firebase-analytics';
import Firebase from '../../firebase';
import FeedCellClass from '../cells/feedCellClass.js';


class FriendsScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      followingPosts: [],
      followingUsers: [''],
      isFollowingSomeone: false,

    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true, followingUsers: [''] });

    Analytics.setCurrentScreen('FollowingScreen');

    await Firebase.firestore()
      .collection('following')
      .doc(Firebase.auth().currentUser.uid)
      .collection('following')
      .get()
      .then((following) => {
        const followingUsers = [];
        following.forEach((user) => {
          followingUsers.push(user.id);
        });
        followingUsers.push(Firebase.auth().currentUser.uid);
        this.setState({ followingUsers });
      })
      .then(() => this.getCollection());
  }

  componentWillUnmount() {
    this.getCollection();
  }

    _refresh = () => {
      this.setState({ isLoading: true });
      this.getCollection();
    };

    onShare = async() => {
      try {
        const result = await Share.share({
          title: 'traderank invite',
          message: 'join traderank, the social network for stock traders!',
          url: 'https://testflight.apple.com/join/eHiBK1S3',
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

    //username: this.state.username,
    // description: this.state.description,
    // uid: this.state.uid,
    // ticker: this.state.ticker,
    // image: this.state.storage_image_uri,
    // gain_loss: this.state.gain_loss,
    // date_created: new Date(),
    // likesCount: 0,
    // profit_loss: this.state.profit_loss,
    // percent_gain_loss: this.state.percent_gain_loss,
    // security: this.state.security,
    // postID: this.state.postID
    getCollection = async() => {
      this.setState({ isLoading: true, followingUsers: [''] });
      Analytics.logEvent('First_5_Following_Loaded');


      await Firebase.firestore()
        .collection('following')
        .doc(Firebase.auth().currentUser.uid)
        .collection('following')
        .get()
        .then((following) => {
          const followingUsers = [];
          following.forEach((user) => {
            followingUsers.push(user.id);
          });
          followingUsers.push(Firebase.auth().currentUser.uid);
          this.setState({ followingUsers });
        });

      const followingPosts = [];

      this.state.followingUsers.forEach((res) => {
        Firebase.firestore()
          .collection('globalPosts')
          .where('uid', '==', res)
          .orderBy('date_created', 'desc')
          .limit(5)
          .get()
          .then((querysnapshot) => {
            querysnapshot.forEach((post) => {
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
              } = post.data();


              followingPosts.push({
                key: post.id,
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

            // console.log(followingPosts)

            followingPosts.sort((a, b) => b.date_created.toDate() - a.date_created.toDate());

            this.setState({
              followingPosts,
              isLoading: false,
            });
          });
      });
    }

    getMore = async() => {
      const lastItemIndex = this.state.followingPosts.length - 1;
      Analytics.logEvent('More_5_Following_Loaded');

      this.state.followingUsers.forEach((res) => {
        Firebase.firestore()
          .collection('globalPosts')
          .where('uid', '==', res)
          .orderBy('date_created', 'desc')
          .startAfter(this.state.followingPosts[lastItemIndex].date_created)
          .limit(5)
          .get()
          .then((querysnapshot) => {
            const newPostsArray = [];
            querysnapshot.forEach((post) => {
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
              } = post.data();


              newPostsArray.push({
                key: post.id,
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

            // newPostsArray.sort(function(a,b) {
            //     return b.date_created.toDate() - a.date_created.toDate()
            // })

            this.setState({
              followingPosts: [...new Set(this.state.followingPosts.concat(newPostsArray))],
              isLoading: false,
            });
          });
      });
    }


    render() {
      const { navigation } = this.props;
      const renderItem = ({ item }) => (

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
      );
      if (this.state.isLoading) {
        return (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#9E9E9E" />
          </View>
        );
      }

      if (this.state.followingPosts.length === 0) {
        return (
          <View style={styles.emptyContainer}>

            <Text style={styles.buttonText}>you aren't following anyone!</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onShare()}
            >
              <Text style={styles.buttonText}>invite friends to traderank</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this._refresh()}
            >
              <Text style={styles.buttonText}>followed people? refresh</Text>
            </TouchableOpacity>

          </View>
        );
      }

      return (
        <View style={styles.view}>
          <FlatList
            ref={this.props.scrollRef}
            data={this.state.followingPosts}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onRefresh={this._refresh}
            refreshing={this.state.isLoading}
                    // onEndReachedThreshold={0.5}
            onEndReached={() => { this.getMore(); }}
          />
        </View>
      );
      //
    }
}


const styles = StyleSheet.create({
  container: {
    // marginTop: 100,
    // marginBottom: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  emptyContainer: {
    // marginTop: 100,
    // marginBottom: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  view: {
    // alignItems: 'center',
    backgroundColor: '#000000',
  },
  thumbnail: {
    width: 300,
    height: 300,
    paddingBottom: 20,
    resizeMode: 'contain',
  },

  inputBox: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#5233FF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  button: {
    marginTop: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#5233FF',
    borderRadius: 5,
    width: 300,
  },
  globalFeedCell: {
    marginTop: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    width: Dimensions.get('window').width - 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerText: {
    fontSize: 30,
    alignItems: 'center',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingBottom: 10,
  },
  tradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
  },
  regularText: {
    fontSize: 16,
    alignContent: 'center',
    paddingBottom: 10,
  },
  textContainer: {
    alignContent: 'center',
    paddingBottom: 10,
    paddingTop: 20,
  },
  twoPickers: {
    width: 200,
    height: 88,
  },
  twoPickerItems: {
    height: 88,
  },
});

export default function(props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <FriendsScreen {...props} scrollRef={ref} />;
}
