import {
    AUTH_USER,
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
              id: action.payload.id,
              username: action.payload.username,
              email: action.payload.email,
            },
            isLoggedIn: true,
        };
      case CLEAR_USER:
        return {
            ...state,
            user: {
              id: action.payload.id,
              username: action.payload.username,
              email: action.payload.email,
            },
            isLoggedIn: false,
          };
      default:
        return state;
    }
  };
  