import {
    AUTH_USER,
    GET_USER,
    CLEAR_USER
} from '../types/User.Types';
  
  const INITIAL_STATE = {
    user: {
        id: 'tempID',
        username: 'tempUN',
        email: 'tempEMAIL',
      },
      isLoggedIn: false,
  };

  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case AUTH_USER:
        return {
            ...state,
            user: {
              id: action.id,
              username: action.username,
              email: action.email,
            },
            isLoggedIn: true,
          };
      case GET_USER:
        return {
            ...state,
            user: {
              id,
              username,
              email,
            },
            isLoggedIn: true,
          };
      case CLEAR_USER:
        return {
            ...state,
            user: {
              id: action.id,
              username: action.username,
              email: action.email,
            },
            isLoggedIn: false,
          };
      default:
        return state;
    }
  };
  