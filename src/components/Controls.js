import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from '@material-ui/lab/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
// import {
//   mean, min, max,
//   extent, ticks
// } from 'd3-array';
import {
  setIndex, setYVar, setTickColors
} from '../actions';
import { getTickColors } from '../misc';

const styles = theme => ({
  root: {
    border: '1px solid white',
    width: 300,
    height: 120,
    position: 'absolute',
    left: 0,
    background: 'rgb(255, 255, 255, 0.8)',
    bottom: 0
    // display: 'flex'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 280
  },
  sliderContainer: {
    display: 'flex'
  },
  slider: {
    width: 250
  },
  sliderText: {
    paddingLeft: 3,
    lineHeight: '31px'
  }
});

const Controls = ({
  classes, index, xVar, yVar, config, sliderChange, yVarChange
}) => {
  if (config.name === undefined || xVar === '' || yVar === '') {
    return '';
  }
  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="y-var">variable</InputLabel>
        <Select
          value={yVar}
          onChange={e => yVarChange(e, config)}
          inputProps={{
            name: 'y variable',
            id: 'y-var'
          }}
        >
          {
            Object.keys(config.variables).map(d => (
              <MenuItem value={d} key={`y-${d}`}>
                <strong>{`${d}`}</strong>
                {`: ${config.variables[d].name}`}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <div className={classes.sliderContainer}>
        <div className={classes.slider}>
          <Slider
            value={index}
            min={0}
            max={config.years.length - 1}
            step={1}
            onChange={sliderChange}
          />
        </div>
        <div className={classes.sliderText}>{config.years[index]}</div>
      </div>
    </div>
  );
};

Controls.propTypes = {
  classes: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  sliderChange: PropTypes.func.isRequired,
  xVar: PropTypes.string.isRequired,
  yVar: PropTypes.string.isRequired,
  // xVarChange: PropTypes.func.isRequired,
  yVarChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  index: state.index,
  xVar: state.xVar,
  yVar: state.yVar,
  config: state.config.data
});

const mapDispatchToProps = dispatch => ({
  sliderChange: (event, val) => {
    dispatch(setIndex(val));
  },
  // xVarChange: event => {
  //   dispatch(setXVar(event.target.value));
  // },
  yVarChange: (event, config) => {
    // first set ticks
    const yVar = event.target.value;

    const tcks = config.variables[yVar].breaks;
    const colors = getTickColors(tcks);

    dispatch(setTickColors(colors));
    dispatch(setYVar(yVar));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Controls));
