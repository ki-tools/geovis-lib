import { REQUEST_CONFIG, RECEIVE_CONFIG } from '../constants';

const config = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: {}
}, action) => {
  switch (action.type) {
    case REQUEST_CONFIG:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_CONFIG:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: action.data,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export default config;
