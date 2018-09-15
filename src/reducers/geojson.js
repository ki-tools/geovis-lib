import {
  REQUEST_COUNTRIES, RECEIVE_COUNTRIES,
  REQUEST_STATES, RECEIVE_STATES,
  REQUEST_MUNIS, RECEIVE_MUNIS
} from '../constants';

export const countries = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: {}
}, action) => {
  switch (action.type) {
    case REQUEST_COUNTRIES:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_COUNTRIES:
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

export const states = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: {}
}, action) => {
  switch (action.type) {
    case REQUEST_STATES:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_STATES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: Object.assign({}, state.data, action.data),
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export const munis = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  data: {}
}, action) => {
  switch (action.type) {
    case REQUEST_MUNIS:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_MUNIS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        data: Object.assign({}, state.data, action.data),
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};
