import {
  PUSH_STATUS,
} from '../types/Permissions.Types';

const INITIAL_STATE = {
  pushStatus: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PUSH_STATUS:
      return { ...state, pushStatus: action.payload };
    default:
      return state;
  }
};
