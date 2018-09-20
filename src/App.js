import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
import MapboxMap from './components/MapboxMap';
import Controls from './components/Controls';
import InfoOverlay from './components/InfoOverlay';
import Legend from './components/Legend';

// const styles = {
//   root: {
//     flex: 1,
//     paddingBottom: 20
//   },
//   bodyWrap: {
//     // maxWidth: 1000,
//     // paddingLeft: 20,
//     // paddingRight: 20
//     // margin: 'auto'
//   }
// };

const App = () => (
  <div>
    <MapboxMap />
    <Controls />
    <InfoOverlay />
    <Legend />
  </div>
);

export default App;

// <ErrorSnack />
