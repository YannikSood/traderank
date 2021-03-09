import * as Analytics from 'expo-firebase-analytics';
import Firebase from '../firebase';

import {
  GLOBAL_POSTS,
  POSTS_LOADING,
} from '../types/Posts.Types';

export const fetchCollection = () => (dispatch) => {
  dispatch(setPostsLoading(true));
  const globalPostsArray = [];
  Analytics.logEvent('First_5_Loaded');

  return Firebase.firestore()
    .collection('globalPosts')
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

        globalPostsArray.push({
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

      dispatch(setGlobalPosts(globalPostsArray));
      dispatch(setPostsLoading(false));
    });
};

export const fetchMorePosts = () => (dispatch, getState) => {
  dispatch(setPostsLoading(true));
  const { PostsReducer: { globalPostsArray } } = getState();

  const array = getState(globalPostsArray);

  const lastItemIndex = array.length - 1;
  Analytics.logEvent('More_5_Loaded');

  Firebase.firestore()
    .collection('globalPosts')
    .orderBy('date_created', 'desc')
    .startAfter(array[lastItemIndex].date_created)
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

      dispatch(setGlobalPosts(newPostsArray));
      dispatch(setPostsLoading(false));
    });
};

function setPostsLoading(value) {
  return {
    type: POSTS_LOADING,
    payload: value,
  };
}

function setGlobalPosts(value) {
  return {
    type: GLOBAL_POSTS,
    payload: value,
  };
}
