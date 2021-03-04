import {
  GLOBAL_POSTS,
  POSTS_LOADING,
} from '../types/Posts.Types';

const INITIAL_STATE = {
  postsLoading: false,
  globalPosts: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GLOBAL_POSTS:
      return { ...state, globalPosts: [...state.globalPosts, action.payload] };
    case POSTS_LOADING:
      return { ...state, postsLoading: action.payload };
    default:
      return state;
  }
};
