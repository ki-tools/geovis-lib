import {
  SET_VIEW_MODE, SET_X_VAR, SET_Y_VAR, SET_TICK_COLORS, SET_INDEX, SET_MAP_LOADED, SET_HOV_GEO
} from '../constants';

export const viewMode = (state = {}, action) => {
  switch (action.type) {
    case SET_VIEW_MODE:
      return action.val;
    default:
  }
  return state;
};

export const xVar = (state = '', action) => {
  switch (action.type) {
    case SET_X_VAR:
      return action.val;
    default:
  }
  return state;
};

export const yVar = (state = '', action) => {
  switch (action.type) {
    case SET_Y_VAR:
      return action.val;
    default:
  }
  return state;
};

export const tickColors = (state = () => '#000000', action) => {
  switch (action.type) {
    case SET_TICK_COLORS:
      return action.val;
    default:
  }
  return state;
};

export const index = (state = 0, action) => {
  switch (action.type) {
    case SET_INDEX:
      return action.val;
    default:
  }
  return state;
};

export const mapLoaded = (state = false, action) => {
  switch (action.type) {
    case SET_MAP_LOADED:
      return action.val;
    default:
  }
  return state;
};

export const hovGeo = (state = { level: '', id: '' }, action) => {
  switch (action.type) {
    case SET_HOV_GEO:
      return action.val;
    default:
  }
  return state;
};
