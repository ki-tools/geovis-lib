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

const InfoOverlay = ({ classes, countries, states, munis, hovGeo, viewMode, config, xVar, yVar }) => {
  let res = <div />;
  if (viewMode.mode === 'grid') {
    res = <div />;
  } else if (hovGeo === '') {
    let countryHeader = '';
    if (viewMode.code && viewMode.code.country !== '' && countries.features) {
      const idx = countries.fIdx;
      const countryProps = countries.features[idx[viewMode.code.country]].properties;
      const nState = states[viewMode.code.country].features.length;
      countryHeader = (
        <div>
          <div className={classes.countryTitle}>{countryProps.name}</div>
          <div>{`${nState} states`}</div>
        </div>
      );
    }

    res = (
      <div className={classes.overlay}>
        {countryHeader}
        <h3 className={classes.hInfo}>
          {`Hover a state to see the progression of '${yVar}' over time`}
        </h3>
      </div>
    );
  } else if (viewMode.level === 'country') {
// economy (cut off first 3 chars)
// gdp_md_est
// income_grp (cut off first 3 chars)
// lastcensus
// pop_est
// region_wb
// <dt className={classes.dt}><strong>GDP per cap.</strong></dt>
// <dd className={classes.dd}>{addCommas(hoverInfo.properties.gdp_md_est)}</dd>

// <dl className={classes.dl}>
//   <dt className={classes.dt}><strong>Economy</strong></dt>
//   <dd className={classes.dd}>{hoverInfo.properties.economy.substring(3)}</dd>
//   <dt className={classes.dt}><strong>Income Group</strong></dt>
//   <dd className={classes.dd}>{hoverInfo.properties.income_grp.substring(3)}</dd>
//   <dt className={classes.dt}><strong>Population</strong></dt>
//   <dd className={classes.dd}>{addCommas(hoverInfo.properties.pop_est)}</dd>
// </dl>

// <SeriesPlot
//   width={200}
//   height={160}
//   data={hoverInfo.data}
//   xrange={xrange}
//   yrange={yrange}
// />

// <SeriesPlot
//   width={200}
//   height={160}
//   data={hoverInfo.data}
//   xrange={xrange}
//   yrange={yrange}
// />


    const idx = states[viewMode.code.country].fIdx;
    const stateProps = states[viewMode.code.country].features[idx[hovGeo]].properties;
    const plotDat = [];
    for (var i = 0; i < stateProps.data.length; i += 1) {
      plotDat.push({
        x: config.years[i],
        y: stateProps.data[i]
      });
    }

    res = (
      <div className={classes.overlay}>
        <h3 className={classes.h}>Brazil</h3>
        <h4 className={classes.h}>{stateProps.name}</h4>
        <hr className={classes.hr} />
        <div className={classes.plotWrapper}>
          <SeriesPlot
            width={200}
            height={160}
            data={plotDat}
            xrange={[2006, 2015]}
            yrange={[0, 1]}
            xLab={config.variables[xVar].name}
            yLab={config.variables[yVar].name}
          />
        </div>
        <div>
          <h4 className={`${classes.hInfo} ${classes.spacer}`}>
            Click state to see municipalities
          </h4>
        </div>
      </div>
    );
  } else if (viewMode.level === 'state') {
    let plotDiv;
    // if (hoverInfo.data.length === 0) {
    if (1 === 0) {
      plotDiv = (
        <h4 className={`${classes.hInfo} ${classes.spacer}`}>
          State-level data not available
        </h4>
      );
    } else {
      plotDiv = (
        <div>
          <div className={classes.plotWrapper}>
          </div>
        </div>
      );
    }
    res = (
      <div className={classes.overlay}>
        <h3 className={classes.h}>hoverInfo.name</h3>
        <h4 className={classes.h}>hoverInfo.properties.geonunit</h4>
        {plotDiv}
        <div>
          <h5 className={`${classes.hInfo} ${classes.spacer}`}>
            Click anywhere to change focus
          </h5>
        </div>
      </div>
    );
  }
  return res;
};

InfoOverlay.propTypes = {
  classes: PropTypes.object,
  xrange: PropTypes.array,
  yrange: PropTypes.array,
  viewMode: PropTypes.object,
  xVar: PropTypes.string,
  yVar: PropTypes.string
};

// ------ static styles ------

const staticStyles = {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 210,
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
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
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

const stateSelector = createSelector(
  countryDataSelector,
  stateDataSelector,
  muniDataSelector,
  hovGeoSelector,
  viewModeSelector,
  configSelector,
  xVarSelector,
  yVarSelector,
  (countries, states, munis, hovGeo, viewMode, config, xVar, yVar) => ({
    countries,
    states,
    munis,
    hovGeo,
    viewMode,
    config,
    xVar,
    yVar
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(withStyles(staticStyles)(InfoOverlay));
