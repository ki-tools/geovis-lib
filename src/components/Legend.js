import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { hexToRGB, getTickColors } from '../misc';
// import { quantize } from 'd3-interpolate';
import uiConsts from '../uiConsts';

const styles = {
  box: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: uiConsts.legend.width + 40,
    background: 'rgba(255, 255, 255, 0.5)',
    // marginRight: 5,
    // marginBottom: 5,
    // borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 40,
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 1
  },
  text: {
    fontSize: 12
  },
  tickLabel: {
    fontSize: 9
  }
};

const Legend = ({
  classes, tickColors, config, yVar, index, hovGeo,
  viewMode, states, munis
}) => {
  if (!config.isLoaded || yVar === '') {
    return <div />;
  }

  const tcks = config.data.variables[yVar].breaks;
  const stepColors = tcks.map(d => hexToRGB(tickColors(d), '#f3f3f1', 0.9, 0.6));

  const legend = {
    left: 10,
    top: 20,
    height: uiConsts.legend.entryHeight,
    entryWidth: (uiConsts.legend.width - 20) / (stepColors.length + 1)
  };

  let curMarker = '';
  let curDat = undefined;

  if (hovGeo.level !== '' && index !== -1) {
    if (hovGeo.level === 'state') {
      const idx = states[viewMode.code.country].fIdx;
      const stateProps = states[viewMode.code.country].features[idx[hovGeo.id]].properties;
      curDat = stateProps[yVar][index];
      debugger;
    } else if (hovGeo.level === 'muni' && viewMode.code.state !== '') {
      const idx = munis[viewMode.code.state].fIdx;
      const muniProps = munis[viewMode.code.state].features[idx[hovGeo.id]].properties;
      curDat = muniProps[yVar][index];
    }
  }

  if (curDat) {
    const st = tcks[0];
    const delta = tcks[1] - tcks[0];
    const val = (((curDat - st) / delta) * legend.entryWidth) + legend.left;
    // https://codepen.io/chrisroselli/pen/oXyqRa - add animation
    curMarker = (
      <line
        x1={val}
        y1={legend.top - 2}
        x2={val}
        y2={legend.top + legend.height + 2}
        strokeWidth="2"
        strokeLinecap="round"
        stroke="black"
      />
    );
  }
console.log(stepColors)
  return (
    <div className={classes.box}>
      <svg
        width={uiConsts.legend.width}
        height={42}
      >
        <g>
          <text
            x={legend.left}
            y={legend.top - 8}
            className={classes.text}
          >
            {config.data.variables[yVar].name}
          </text>
          <rect
            x={legend.left}
            y={legend.top}
            height={legend.height}
            width={stepColors.length * legend.entryWidth}
            fill="#ffffff"
            stroke="#000000"
            strokeOpacity="0.5"
          />
          {
            stepColors.map((d, i) => (
              <rect
                key={`legend-${i}`}
                x={legend.left + (i * legend.entryWidth)}
                y={legend.top}
                height={legend.height}
                width={legend.entryWidth}
                fill={d}
                opacity="0.8"
              />
            ))
          }
          {
            tcks.map((d, i) => (
              <text
                key={`legend-lbl-${i}`}
                x={legend.left + (i * legend.entryWidth)}
                y={legend.top + legend.height + 10}
                className={classes.tickLabel}
                textAnchor="middle"
              >
                {d}
              </text>
            ))
          }
          {curMarker}
        </g>
      </svg>
    </div>
  );

  // const res = (
  //   <div className={classes.box}>
  //     <span className={classes.text}>{countryData.label}</span>
  //   </div>
  // );
  // return res;
};

Legend.propTypes = {
  classes: PropTypes.object,
  tickColors: PropTypes.func,
  config: PropTypes.object
};

// ------ redux container ------

const tickColorsSelector = state => state.tickColors;
const configSelector = state => state.config;
const yVarSelector = state => state.yVar;
const indexSelector = state => state.index;
const hovGeoSelector = state => state.hovGeo;
const viewModeSelector = state => state.viewMode;
const stateDataSelector = state => state.states.data;
const muniDataSelector = state => state.munis.data;


const stateSelector = createSelector(
  tickColorsSelector, configSelector, yVarSelector,
  indexSelector, hovGeoSelector, viewModeSelector,
  stateDataSelector, muniDataSelector,
  (tickColors, config, yVar, index, hovGeo, viewMode, states, munis) => ({
    tickColors,
    config,
    yVar,
    index,
    hovGeo,
    viewMode,
    states,
    munis
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(withStyles(styles)(Legend));
