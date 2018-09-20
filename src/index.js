import React from 'react';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import blue from '@material-ui/core/colors/blue';
import lightBlue from '@material-ui/core/colors/lightBlue';
import './index.css';
import rootReducer from './reducers';
import store from './store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }
}

const theme = createMuiTheme({
  palette: {
    primary: { light: blue['A100'], main: blue['A200'] },
    secondary: { light: lightBlue[200], main: lightBlue[700] }
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontWeightLight: 200,
    body1: {
      fontSize: 16
    },
    fontWeightRegular: 300,
    fontWeightMedium: 400
  }
});

render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    render(
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </MuiThemeProvider>,
      document.getElementById('root')
    );
  });
}

registerServiceWorker();
