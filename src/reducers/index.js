import { combineReducers } from 'redux';
import config from './config';
import {
  countries, states, munis
} from './geojson';
import {
  viewMode, xVar, yVar, tickColors, index, mapLoaded, hovGeo
} from './app';

const rootReducer = combineReducers({
  config,
  countries,
  states,
  munis,
  viewMode,
  xVar,
  yVar,
  tickColors,
  index,
  mapLoaded,
  hovGeo
});

export default rootReducer;
