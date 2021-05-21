import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import firebase from '../firebase';

import {
  PUSH_STATUS,
} from '../types/Permissions.Types';

export const fetchPermissions = () => (dispatch, getState) => Permissions.getAsync(Permissions.NOTIFICATIONS)
  .then(res => (res.status === 'granted' ? res : Permissions.askAsync(Permissions.NOTIFICATIONS)))
  .then(async(response) => {
    if (response.status !== 'granted') {
      dispatch(setPushStatus(false));

      return Promise.reject(new Error('Push notifications permission was rejected'));
    }


    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    return token;
  })
  .then((token) => {
    const { PermissionsReducer: { pushStatus } } = getState(); // This allows you to access the current redux store
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
      token,
      pushStatus,
    }, { merge: true });
  })
  .catch((error) => {
    console.log('Error while registering device push token', error);
  });

function setPushStatus(value) {
  return {
    type: PUSH_STATUS,
    payload: value,
  };
}
