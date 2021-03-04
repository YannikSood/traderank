import {
    AUTH_USER,
    GET_USER,
    CLEAR_USER
} from '../types/User.Types';


export const authUser = (userid, userEmail, username) => ({
    type: 'AUTH_USER',
    id: userid,
    username,
    email: userEmail,  
  });
  
export const getUser = () => ({
    type: 'GET_USER',
    id: userid,
    username,
    email: userEmail,
  });
  
export const clearUser = temp => ({
    type: 'CLEAR_USER',
    id: temp,
    username: temp,
    email: temp,
  });

  function setAuthUser(value) {
    return {
      type: AUTH_USER,
      payload: value,
    };
  }
  
  function setGetUser(value) {
    return {
      type: GET_USER,
      payload: value,
    };
  }

  function setClearUseer(value) {
    return {
      type: CLEAR_USER,
      payload: value,
    };
  }
