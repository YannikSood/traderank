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

const initialReplyState = {
  reply: '',
};
//
//Reducer
//
const UserReducer = (state = initialUserState, action) => {
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

//reply reducer
// const replyReducer = (state = initialReplyState, action) => {
//   switch (action.type) {
//     case 'setReply':
//       return {
//         ...state,
//         reply,
//         isReplying: true,
//       };
//     case 'clearReply':
//       return {
//         ...state,
//         reply,
//         isReplying: false,
//       };
//     case 'getReply':
//       return {
//         ...state,
//         isReplying: true,
//       };
//     default:
//       return state;
//   }
// };

//
//Action
//



//
//Store
//
// const store = createStore(userReducer, applyMiddleware(thunkMiddleware));
export { UserReducer };
export { authUser };
export { getUser };
export { clearUser };

//Reply
// const replyStore = createStore(replyReducer, applyMiddleware(thunkMiddleware));
// export { replyStore };
// export { setReply };
// export { getReply };
// export { clearReply };
