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
    width: uiConsts.legend.width,
    background: 'rgba(255, 255, 255, 0.85)',
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
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

const Legend = ({ classes, tickColors, config }) => {
  if (!config.data.isLoaded) {
    return <div />;
  }
debugger;
  const tcks = config.data.variables[config.data.yVar].breaks;
  const tmp = tcks.map(d => [hexToRGB(tickColors(d), '#f3f3f1', 0.9, 0.6), d]);
  const stepColors = [].concat.apply([], tmp);
  stepColors.push('#aaaaaa');

  const legend = {
    left: 10,
    top: 20,
    height: uiConsts.legend.entryHeight,
    entryWidth: (uiConsts.legend.width - 20) / stepColors.length
  };

  let curMarker = '';
  // const st = countryData.tcks[0];
  // const delta = countryData.tcks[1] - countryData.tcks[0];
  // if (hoverInfo.name !== undefined) {
  //   // let val = Math.round(hoverInfo.properties.avg_val);
  //   // val = ((((val - st) + delta) / delta) * legend.entryWidth) + legend.left;
  //   // https://codepen.io/chrisroselli/pen/oXyqRa - add animation
  //   curMarker = (
  //     <line
  //       x1={val}
  //       y1={legend.top - 2}
  //       x2={val}
  //       y2={legend.top + legend.height + 2}
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       stroke="black"
  //     />
  //   );
  // }

  // const tcks = [st - delta, ...countryData.tcks];

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
            "Data label"
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
                opacity="0.7"
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

const stateSelector = createSelector(
  tickColorsSelector, configSelector,
  (tickColors, config) => ({
    tickColors,
    config
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(withStyles(styles)(Legend));
