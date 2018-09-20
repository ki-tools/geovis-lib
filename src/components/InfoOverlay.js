import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import SeriesPlot from './SeriesPlot';
// import uiConsts from '../assets/styles/uiConsts';

// if zoomed
//   - show country-level info when nothing is hovered
//     - add note at bottom of this saying
//       - if province info: "Hover a state/province for state-specific information"
//       - else: "State-specific information currently not available for this country"
//     - plus "Click anywhere to exit country-level view"
// if not zoomed
//   - if nothing hovered, show "Hover a country for info"
//   - if country hovered, show country-level info + "Click to view states/provinces"

// const addCommas = x =>
//   x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const InfoOverlay = ({
  classes, countries, states, munis, hovGeo, viewMode, config, xVar, yVar, index
}) => {
  let plotContent = '';
  let subText = '';
  let infoText = '';
  if (viewMode.mode === 'grid') {
    return (<div />);
  } else if (hovGeo.level === '') {
    if (viewMode.level === 'country') {
      // const idx = countries.fIdx;
      // const countryProps = countries.features[idx[viewMode.code.country]].properties;
      const nState = states[viewMode.code.country].features.length;

      subText = (
        <div>{`${nState} states`}</div>
      );

      infoText = (
        <h4 className={`${classes.hInfo} ${classes.spacer}`}>
          {`Hover a state to see the progression of '${yVar}' over time`}
        </h4>
      );
    } else if (viewMode.level === 'state') {
      const nMunis = munis[viewMode.code.state].features.length;
      const idx = states[viewMode.code.country].fIdx;
      const stateProps = states[viewMode.code.country].features[idx[viewMode.code.state]].properties;

      subText = (
        <div>
          <h4>State: <strong>{stateProps.name}</strong></h4>
          <div>{`${nMunis} municipalities`}</div>
        </div>
      );

      infoText = (
        <div className={`${classes.hInfo} ${classes.spacer}`}>
          {`Hover a municipality to see the progression of '${yVar}' over time`}
        </div>
      );
    }
  } else if (hovGeo.level === 'state') {
    const idx = states[viewMode.code.country].fIdx;
    const stateProps = states[viewMode.code.country].features[idx[hovGeo.id]].properties;
    const plotDat = [];
    for (var i = 0; i < stateProps.data.length; i += 1) {
      plotDat.push({
        x: stateProps[xVar][i],
        y: stateProps[yVar][i]
      });
    }

    plotContent = (
      <div className={classes.plotWrapper}>
        <SeriesPlot
          width={250}
          height={180}
          data={plotDat}
          indexYear={stateProps[xVar][index]}
          xrange={config.variables[xVar].range}
          yrange={config.variables[yVar].range}
          xLab={config.variables[xVar].name}
          yLab={config.variables[yVar].name}
        />
      </div>
    );

    subText = (
      <h4>State: <strong>{stateProps.name}</strong></h4>
    );

    infoText = (
      <div className={`${classes.hInfo} ${classes.spacer}`}>
        Click the state to see municipalities
      </div>
    );
  } else if (hovGeo.level === 'muni' && viewMode.code.state !== '') {
    const stIdx = states[viewMode.code.country].fIdx;
    const stateProps = states[viewMode.code.country].features[stIdx[viewMode.code.state]].properties;

    const idx = munis[viewMode.code.state].fIdx;
    const muniProps = munis[viewMode.code.state].features[idx[hovGeo.id]].properties;
    const plotDat = [];
    for (var i = 0; i < muniProps.data.length; i += 1) {
      plotDat.push({
        x: muniProps[xVar][i],
        y: muniProps[yVar][i]
      });
    }

    plotContent = (
      <div className={classes.plotWrapper}>
        <SeriesPlot
          width={250}
          height={180}
          data={plotDat}
          indexYear={muniProps[xVar][index]}
          xrange={config.variables[xVar].range}
          yrange={config.variables[yVar].range}
          xLab={config.variables[xVar].name}
          yLab={config.variables[yVar].name}
        />
      </div>
    );

    subText = (
      <div>
        <h4>State: <strong>{stateProps.name}</strong></h4>
        <h4>Municipality: <strong>{muniProps.name}</strong></h4>
      </div>
    );

    infoText = (
      <div className={`${classes.hInfo} ${classes.spacer}`}>
        Click to return to state-level view
      </div>
    );
  }

  return (
    <div className={classes.overlay}>
      <h3 className={classes.countryTitle}>Brazil</h3>
      {subText}
      <hr className={classes.hr} />
      {plotContent}
      <div>
      {infoText}
      </div>
    </div>
  );
};

InfoOverlay.propTypes = {
  classes: PropTypes.object,
  countries: PropTypes.object,
  states: PropTypes.object,
  munis: PropTypes.object,
  hovGeo: PropTypes.object,
  config: PropTypes.object,
  viewMode: PropTypes.object,
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  index: PropTypes.number
};


// ------ static styles ------

const staticStyles = {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 260,
    background: 'rgba(255, 255, 255, 0.85)',
    // marginRight: 10,
    // marginTop: 10,
    // borderRadius: 5,
    // padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 1
  },
  h: {
    marginBefore: 0,
    marginAfter: 0
    // fontWeight: 300
  },
  hInfo: {
    fontSize: 11,
    lineHeight: '14px',
    marginBefore: 0,
    marginAfter: 0,
    fontWeight: 300
  },
  dl: {
    fontSize: 12,
    width: '100%',
    overflow: 'hidden',
    padding: 0,
    margin: 0
  },
  dt: {
    float: 'left',
    width: '38%',
    padding: 0,
    margin: 0
  },
  dd: {
    float: 'left',
    width: '62%',
    padding: 0,
    margin: 0
  },
  hr: {
    border: 0,
    height: 0,
    borderTop: '1px solid rgba(0, 0, 0, 0)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
  },
  spacer: {
    marginTop: 10
  },
  plotWrapper: {
    paddingTop: 10
  },
  countryTitle: {
    fontWeight: 600,
    fontSize: 20
  }
};

// ------ redux container ------

const hovGeoSelector = state => state.hovGeo;
const countryDataSelector = state => state.countries.data;
const stateDataSelector = state => state.states.data;
const muniDataSelector = state => state.munis.data;
const viewModeSelector = state => state.viewMode;
const configSelector = state => state.config.data;
const xVarSelector = state => state.xVar;
const yVarSelector = state => state.yVar;
const indexSelector = state => state.index;

const stateSelector = createSelector(
  countryDataSelector,
  stateDataSelector,
  muniDataSelector,
  hovGeoSelector,
  viewModeSelector,
  configSelector,
  xVarSelector,
  yVarSelector,
  indexSelector,
  (countries, states, munis, hovGeo, viewMode, config, xVar, yVar, index) => ({
    countries,
    states,
    munis,
    hovGeo,
    viewMode,
    config,
    xVar,
    yVar,
    index
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(withStyles(staticStyles)(InfoOverlay));
