// import { json as d3json } from 'd3-request';
import {
  REQUEST_CONFIG, RECEIVE_CONFIG,
  REQUEST_COUNTRIES, RECEIVE_COUNTRIES,
  REQUEST_STATES, RECEIVE_STATES,
  REQUEST_MUNIS, RECEIVE_MUNIS,
  SET_VIEW_MODE, SET_X_VAR, SET_Y_VAR,
  SET_TICK_COLORS, SET_INDEX,
  SET_MAP_LOADED, SET_HOV_GEO
} from '../constants';

export const requestConfig = () => ({
  type: REQUEST_CONFIG
});

export const receiveConfig = json => ({
  type: RECEIVE_CONFIG,
  data: json,
  receivedAt: Date.now()
});

export const requestCountries = () => ({
  type: REQUEST_COUNTRIES
});

export const receiveCountries = json => ({
  type: RECEIVE_COUNTRIES,
  data: json,
  receivedAt: Date.now()
});

export const requestStates = () => ({
  type: REQUEST_STATES
});

export const receiveStates = json => ({
  type: RECEIVE_STATES,
  data: json,
  receivedAt: Date.now()
});

export const requestMunis = () => ({
  type: REQUEST_MUNIS
});

export const receiveMunis = json => ({
  type: RECEIVE_MUNIS,
  data: json,
  receivedAt: Date.now()
});

export const setViewMode = val => (
  { type: SET_VIEW_MODE, val }
);

export const setXVar = val => (
  { type: SET_X_VAR, val }
);

export const setYVar = val => (
  { type: SET_Y_VAR, val }
);

export const setTickColors = val => (
  { type: SET_TICK_COLORS, val }
);

export const setIndex = val => (
  { type: SET_INDEX, val }
);

export const setMapLoaded = val => (
  { type: SET_MAP_LOADED, val }
);

export const setHovGeo = val => (
  { type: SET_HOV_GEO, val }
);

// import { json, csv } from 'd3-request';
// import { } from '../constants';

// export const setActiveStep = val => ({
//   type: SET_ACTIVE_STEP,
//   val
// });

// export const requestMetadata = () => ({
//   type: REQUEST_METADATA
// });

// export const receiveMetadata = dat => ({
//   type: RECEIVE_METADATA,
//   data: dat,
//   receivedAt: Date.now()
// });

// export const fetchConfig = (config = '/config') =>
//   (dispatch) => {
//     dispatch(requestConfig());

//     json(config, (cfg) => {
//       dispatch(requestMetadata());
//       json('/dataset/metadata', (metadat) => {
//         dispatch(receiveMetadata(metadat));
//       })
//         .on('error', err => dispatch(setErrorMessage(
//           `Couldn't load config: ${err.target.responseURL}`
//         )));
//   };

