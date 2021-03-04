import { combineReducers } from 'redux';
import PostsReducer from './Posts.Reducer';
import PermissionsReducer from './Permissions.Reducer';
import UserReducer from './User.Reducer';

/**
 * It looks like you are trying to create multiple reducers in the app-redux.js file, which is ok for proof of concept but you need to break those out.
 * Follow the pattern in the PostsReducer file for the UserReducer and ReplyReducer and then import them here. Youll add them to the combineReducers object.
 */

const rootReducer = combineReducers({
  PostsReducer,
  PermissionsReducer,
  UserReducer
});

export default rootReducer;
