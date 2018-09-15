import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MapboxMap from './components/MapboxMap';
import Controls from './components/Controls';
import InfoOverlay from './components/InfoOverlay';

const styles = {
  root: {
    flex: 1,
    paddingBottom: 20
  },
  bodyWrap: {
    // maxWidth: 1000,
    // paddingLeft: 20,
    // paddingRight: 20
    // margin: 'auto'
  }
};

const App = ({ classes }) => (
  <div>
    <MapboxMap />
    <Controls />
    <InfoOverlay />
  </div>
);

export default withStyles(styles)(App);

// <Body />
// <Footer />
// <ErrorSnack />
