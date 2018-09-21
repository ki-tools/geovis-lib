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
    primary: { light: blue.A100, main: blue.A200 },
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

const geovisApp = (id, width, height) => {
  const el = document.getElementById(id);

  if (!width || width === '100%') {
    width = window.innerWidth; // eslint-disable-line no-param-reassign
  }

  if (!height || height === '100%') {
    height = window.innerHeight; // eslint-disable-line no-param-reassign
  }

  el.style.width = width;
  el.style.height = height;

  render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
    document.getElementById(id)
  );

  if (module.hot) {
    module.hot.accept('./App', () => {
      render(
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <App />
          </Provider>
        </MuiThemeProvider>,
        document.getElementById(id)
      );
    });
  }

  registerServiceWorker();
  return ({});
};

window.geovisApp = geovisApp;

if (process.env.NODE_ENV !== 'production') {
  geovisApp('root');
}
