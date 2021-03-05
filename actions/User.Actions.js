import {
    AUTH_USER,
    CLEAR_USER
} from '../types/User.Types';

  
export const authUser = (userid, userEmail, username) => (dispatch) => {

    const data = {
        id: userid,
        username: username,
        email: userEmail,
    }
    dispatch(setAuthUser(data))
    
};

  
export const clearUser = (userid, userEmail, username) => (dispatch) => {
    const data = {
        id: userid,
        username: username,
        email: userEmail,
    }
    dispatch(setClearUser(data))
    
};

  function setAuthUser(value) {
    return {
      type: AUTH_USER,
      payload: value,
    };
  }
  
  function setClearUser(value) {
    return {
      type: CLEAR_USER,
      payload: value,
    };
  }
