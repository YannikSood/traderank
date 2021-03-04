import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//
//Initial State
//

const initialUserState = {
  user: {
    id: 'tempID',
    username: 'tempUN',
    email: 'tempEMAIL',
  },
  isLoggedIn: false,
};

//
//Reducer
//
const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'authUser':
      return {
        ...state,
        user: {
          id: action.id,
          username: action.username,
          email: action.email,
        },
        isLoggedIn: true,
      };
    case 'clearUser':
      return {
        ...state,
        user: {
          id: action.id,
          username: action.username,
          email: action.email,
        },
        isLoggedIn: false,
      };
    case 'getUser':
      return {
        ...state,
        user: {
          id,
          username,
          email,
        },
        isLoggedIn: true,
      };
    default:
      return state;
  }
};

//
//Action
//
const authUser = (userid, userEmail, username) => ({
  type: 'authUser',
  id: userid,
  username,
  email: userEmail,

});

const getUser = () => ({
  type: 'getUser',
  id: userid,
  username,
  email: userEmail,

});

const clearUser = temp => ({
  type: 'clearUser',
  id: temp,
  username: temp,
  email: temp,
});

//
//Store
//
const store = createStore(userReducer, applyMiddleware(thunkMiddleware));
export { store };
export { authUser };
export { getUser };
export { clearUser };
