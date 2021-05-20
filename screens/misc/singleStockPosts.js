import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { View, StyleSheet, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Analytics from 'expo-firebase-analytics';
import { useScrollToTop } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import FeedCellClass from '../cells/feedCellClass.js';
import firebase from '../../firebase';
// import PostsReducer from '../../redux/Posts.Reducer';


//Pass param ticker
//Where param ticker == post ticker
//Show the posts

// Convert your React.Component to a function (functional component)
const SingleStockPosts = ({ props, route, navigation }) => {
  const { ticker } = route.params;
  /**
     * Any refs that you have in the component will be instantiated as a constant at the top of the function with the `useRef()` hook (which you will import from react),
     * passing in the initialValue (if it's known on page load) as the param.
     */

  // Refs
  const scrollRef = useRef(null);


  // Props
  // const { postsLoading } = props;

  /**
     * The `useDispatch()` hook is given to us from react-redux and it allows us to make calls to our action creators
     */

  // Dispatch
  const dispatch = useDispatch();

  /**
     * We no longer need to use the `constructor` with `super(props)` or as a way to set the initial `this.state`. The `useState()` hook handles that, passing in
     * the initial state as the param
     */

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [pushStatus, setPushStatus] = useState(true);
  const [globalPostsArray, setGlobalPostsArray] = useState([]);

  /**
     * The `useEffect()` hook with an empty array replaces your `componentDidMount`
     */

  // Effects
  useEffect(() => {
    // useScrollToTop(scrollRef);
    fetchCollection();
    Analytics.setUserId(firebase.auth().currentUser.uid);
    Analytics.setCurrentScreen('SingleStockPosts_');
  }, []);

  /**
     * Anytime the postsLoading value changes, this useEffect will run
     */
  // useEffect(() => {
  //   setIsLoading(postsLoading);
  // }, [postsLoading]);

  const refresh = () => {
    setIsLoading(true);
    fetchCollection();
  };

  const handleFetchMorePosts = () => {
    fetchMorePosts();
  };

  //

  const fetchCollection = async() => {
    const tempGlobalPostsArray = [];
    Analytics.logEvent('First_5_Loaded');

    await firebase.firestore()
      .collection('globalPosts')
      .where('ticker', '==', ticker)
      .orderBy('date_created', 'desc')
      .limit(5)
      .get()
      .then((querySnapshot) => {
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

          tempGlobalPostsArray.push({
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

        setGlobalPostsArray(tempGlobalPostsArray);
        setIsLoading(false);
      });
  };

  const fetchMorePosts = async() => {
    // setIsLoading(true);
    const lastItemIndex = globalPostsArray.length - 1;
    Analytics.logEvent('More_5_Loaded');

    await firebase.firestore()
      .collection('globalPosts')
      .where('ticker', '==', ticker)
      .orderBy('date_created', 'desc')
      .startAfter(globalPostsArray[lastItemIndex].date_created)
      .limit(5)
      .get()
      .then((querySnapshot) => {
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

        setGlobalPostsArray(globalPostsArray.concat(newPostsArray));
        setIsLoading(false);
      });
  };


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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <View style={styles.view}>
      <FlatList
        ref={scrollRef}
        data={globalPostsArray}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={isLoading}
        onEndReached={handleFetchMorePosts}
      />
      <KeyboardSpacer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  view: {
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
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
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

const mapStateToProps  = (state) => {
  const { PostsReducer } = state;
  return {
    globalPosts: PostsReducer.globalPosts,
    postsLoading: PostsReducer.postsLoading,
  };
};

export default connect(mapStateToProps)(SingleStockPosts);
