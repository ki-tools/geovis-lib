import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production' || window.location.hash === '#log') {
  middleware = [...middleware, createLogger()];
}

const store = createStore(
  rootReducer,
  // { initial state... },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(...middleware)
);

export default store;
