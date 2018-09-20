import React from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { default as getJSONP } from 'browser-jsonp'; // eslint-disable-line import/no-named-default
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  hexToRGB, getBbox, getTickColors, getFeatureIndex
} from '../misc';
import store from '../store';
import {
  requestConfig, receiveConfig,
  requestCountries, receiveCountries,
  requestStates, receiveStates,
  setViewMode, setXVar, setYVar, setTickColors, setIndex,
  requestMunis, receiveMunis, setMapLoaded, setHovGeo
} from '../actions';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

// const ccolors = ["#ffeda0", 0, "#ffeda0", 0.2, "#fed976", 0.4, "#feb24c",
// 0.6, "#fd8d3c", 0.8, "#fc4e2a", 0.9, "#e31a1c", 1, "#bd0026"];

// mapboxgl.accessToken = 'pk.eyJ1IjoicmhhZmVuIiwiYSI6ImNpdnY5M25oaDAwc24yb281cnFoY3g2YTYifQ.aSlJqMyxuFCtaP6euwu-QA';

const paintStyle = {
  border: {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#444444',
      '#ffffff'
    ],
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      2,
      1
    ],
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      0.5
    ]
  },
  fill: {
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.75,
      0.8
    ]
  }
};

const MapboxMap = class MapboxMap extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    countries: PropTypes.object.isRequired,
    states: PropTypes.object.isRequired,
    munis: PropTypes.object.isRequired,
    viewMode: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    yVar: PropTypes.string.isRequired,
    tickColors: PropTypes.func.isRequired,
    mapLoaded: PropTypes.bool.isRequired,
    hovGeo: PropTypes.object.isRequired,
    loadMuniData: PropTypes.func.isRequired,
    changeMapLoaded: PropTypes.func.isRequired,
    changeViewMode: PropTypes.func.isRequired,
    changeHovGeo: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      attributionControl: false,
      center: [0, 0],
      zoom: 0
    }).addControl(new mapboxgl.AttributionControl({
      compact: true
    }));

    const _this = this;
    this.map.on('load', () => {
      _this.props.changeMapLoaded();
      _this.map.on('click', (e) => {
        _this.handleMapClick(e);
      });
    });

    this.hoveredStateId = null;

    // this is not required but is added for browser refresh in development mode
    if (this.props.states.isLoaded) {
      if (this.props.viewMode.level === 'country') {
        this.addStatesLayer();
      } else if (this.props.viewMode.level === 'state') {
        this.addStatesLayer();
        this.addMunisLayer();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.config.isLoaded && this.props.config.isLoaded) {
      this.map
      .setStyle(this.props.config.data.mapStyle)
      .setCenter([0, 0])
      .setZoom(0);
    }

    if (!prevProps.mapLoaded && this.props.mapLoaded) {
      // now we can load countries, etc.
      store.dispatch(requestCountries());
      getJSONP({
        url: 'data/geojson/countries.jsonp',
        callbackName: ctryCallback
        // error: err => store.dispatch(setErrorMessage(
        //   `Couldn't load config: ${err.url}`
        // ))
      });
    }

    if (!prevProps.countries.isLoaded && this.props.countries.isLoaded) {
      this.map.addSource('countries', {
        type: 'geojson',
        data: this.props.countries.data
      });

      this.map.addLayer({
        id: 'countries',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': '#555555'
        }
      }, 'state-label-sm');

      this.map.setLayoutProperty('country-label-lg', 'visibility', 'none');
      this.map.setLayoutProperty('country-label-md', 'visibility', 'none');
      this.map.setLayoutProperty('country-label-sm', 'visibility', 'none');
    }

    if (!prevProps.states.isLoaded && this.props.states.isLoaded) {
    }

    if (this.props.states.isLoaded && this.props.viewMode.level === 'country') {
    }

    if (prevProps.viewMode !== this.props.viewMode) {
      const stateFillId = `state-${this.props.viewMode.code.country}-fill`;

      if (prevProps.viewMode.level === 'state') {
        const pccode = prevProps.viewMode.code.country;
        const pscode = prevProps.viewMode.code.state;
        this.removeMunisLayer(`muni-${pccode}-${pscode}`);
        this.map.setFilter(stateFillId); // add filtered state back in
      }

      if (this.props.viewMode.level === 'country') {
        if (!this.map.getSource('states')) {
          this.map.addSource('states', {
            type: 'geojson',
            data: this.props.states.data[this.props.viewMode.code.country]
          });
        }
        this.addStatesLayer();
        this.map.fitBounds(this.props.states.data[this.props.viewMode.code.country].bbox,
          { padding: 20 });
      }
      if (this.props.viewMode.level === 'state') {
        const ccode = this.props.viewMode.code.country;
        const scode = this.props.viewMode.code.state;
        const muni_id = `muni-${ccode}-${scode}`;
        const lname = `${muni_id}-border`

        if (!this.map.getSource(muni_id)) {
          this.map.addSource(muni_id, {
            type: 'geojson',
            data: this.props.munis.data[scode]
          });
        }
        this.addMunisLayer();
        this.map.fitBounds(this.props.munis.data[scode].bbox,
          { padding: 20 });
        this.map.setFilter(stateFillId, ['!=', scode, ['get', 'code']])
        // this.map.setLayoutProperty(stateFillId, 'visibility', 'none');
      }
    }

    if (
      (this.props.index !== -1 && prevProps.index !== this.props.index) ||
      (this.props.yVar !== '' && prevProps.yVar !== this.props.yVar)
    ) {
      this.setFill();
      // at muni view we also want the states to update their color when index changes
      if (this.props.viewMode.level === 'state') {
        this.setFill(`state-${this.props.viewMode.code.country}-fill`);
      }
    }

    // map.setLayoutProperty(clickedLayer, 'visibility', 'none');
  }

  addMunisLayer() {
    const ccode = this.props.viewMode.code.country;
    const scode = this.props.viewMode.code.state;
    const id = `muni-${ccode}-${scode}`;

    const lname = `${id}-border`;

    if (!this.map.getLayer(lname)) {
      this.map.addLayer({
        id: lname,
        type: 'line',
        source: id,
        paint: paintStyle.border
      }, 'state-label-sm');
    }

    const lname2 = `${id}-fill`;

    if (!this.map.getLayer(lname2)) {
      this.map.addLayer({
        id: lname2,
        type: 'fill',
        source: id,
        paint: paintStyle.fill
      }, lname);
    }

    this.setFill();

    const _this = this;
    this.map.on('mousemove', lname2, (e) => {
      if (e.features.length > 0) {
        if (_this.hoveredStateId) {
          _this.map.setFeatureState({source: id, id: _this.hoveredStateId}, { hover: false});
          // _this.props.changeHovGeo({ level: '', id: '' }, _this.props.hovGeo);
        }
        _this.hoveredStateId = e.features[0].id;
        _this.map.setFeatureState({source: id, id: _this.hoveredStateId}, { hover: true});
        _this.props.changeHovGeo({ level: 'muni', id: e.features[0].properties.code }, _this.props.hovGeo);
      }
    });
    // When the mouse leaves the state fill layer, update the feature state of the
    // previously hovered feature.
    this.map.on('mouseleave', lname2, function() {
      if (_this.hoveredStateId) {
        _this.map.setFeatureState({source: id, id: _this.hoveredStateId}, { hover: false});
      }
      _this.hoveredStateId =  null;
      _this.props.changeHovGeo({ level: '', id: '' }, _this.props.hovGeo);
    });
  }

  removeMunisLayer(id) {
    this.map.removeLayer(`${id}-border`);
    this.map.removeLayer(`${id}-fill`);
  }

  addStatesLayer() {
    const ccode = this.props.viewMode.code.country;
    const id = `state-${ccode}`;

    const lname = `${id}-border`;

    if (!this.map.getLayer(lname)) {
      this.map.addLayer({
        id: lname,
        type: 'line',
        source: 'states',
        paint: paintStyle.border
      }, 'countries');
    }

    const lname2 = `${id}-fill`;

    if (!this.map.getLayer(lname2)) {
      this.map.addLayer({
        id: lname2,
        type: 'fill',
        source: 'states',
        paint: paintStyle.fill
      }, lname);
    }

    this.setFill();

    const _this = this;
    this.map.on('mousemove', lname2, (e) => {
      if (e.features.length > 0) {
        if (_this.hoveredStateId) {
          _this.map.setFeatureState({source: 'states', id: _this.hoveredStateId}, { hover: false});
          // _this.props.changeHovGeo({ level: '', id: '' }, _this.props.hovGeo);
        }
        _this.hoveredStateId = e.features[0].id;
        _this.map.setFeatureState({source: 'states', id: _this.hoveredStateId}, { hover: true});
        _this.props.changeHovGeo({ level: 'state', id: e.features[0].properties.code }, _this.props.hovGeo);
      }
    });
    // When the mouse leaves the state fill layer, update the feature state of the
    // previously hovered feature.
    this.map.on('mouseleave', lname2, function() {
      if (_this.hoveredStateId) {
        _this.map.setFeatureState({source: 'states', id: _this.hoveredStateId}, { hover: false});
      }
      _this.hoveredStateId =  null;
      _this.props.changeHovGeo({ level: '', id: '' }, _this.props.hovGeo);
    });
  }

  handleMapClick(e) {
    const state_id = `state-${this.props.viewMode.code.country}-fill`;
    if (this.map.getLayer(state_id)) {
      const features = this.map.queryRenderedFeatures(e.point,
        { layers: [state_id] });
      if (!features.length) {
        // a state wasn't selected... refocus on country and if in muni view, change view mode
        if (this.props.viewMode.level === 'state') {
          this.props.changeViewMode(this.props.viewMode.code.country, '', 'country');
        }
        this.map.fitBounds(this.props.states.data[this.props.viewMode.code.country].bbox,
          { padding: 20 });
      } else {
        // a state was selected...
        const ccode = features[0].properties.country_code;
        const mcode = features[0].properties.code;
        const lname = `muni-${ccode}-${mcode}`;
        if (
          // this.props.munis.data[ccode] !== undefined &&
          // this.props.munis.data[ccode][mcode] !== undefined
          this.props.munis.data[mcode] !== undefined
        ) {
          this.props.changeViewMode(ccode, mcode, 'state');
        } else {
          // load the data and then trigger a view mode change
          this.props.loadMuniData(ccode, mcode);
        }
        // }
        // if (this.map.getLayer(lname)) {
        // } else {

        // }

        // if (this.map.getLayer('province-fills')) {
        //   this.removeProvinceLayer(this.map);
        // }
        // this.setZoomCountry(features[0].properties, this.map);
      }
    }
  }

  setFill(ln) {
    let lname = ln;
    if (!ln) {
      if (this.props.viewMode.level === 'country') {
        lname = `state-${this.props.viewMode.code.country}-fill`;
      } else if (this.props.viewMode.level === 'state') {
        lname = `muni-${this.props.viewMode.code.country}-${this.props.viewMode.code.state}-fill`;
      }
    }

    // TODO: pre-calculate this in a selector
    const tcks = this.props.config.data.variables[this.props.yVar].breaks;
    const tmp = tcks.map(d => [d, hexToRGB(this.props.tickColors(d), '#f3f3f1', 0.9, 0.6)]);
    const stepColors = ['#aaaaaa', ...[].concat.apply([], tmp)];

    if (this.map.getLayer(lname)) {
      this.map.setPaintProperty(lname, 'fill-color',
        [
          "step",
          ["number", ['at', this.props.index, ['get', this.props.yVar]], 0],
          ...stepColors
        ]
      );
    }
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    config: state.config,
    countries: state.countries,
    states: state.states,
    munis: state.munis,
    viewMode: state.viewMode,
    index: state.index,
    yVar: state.yVar,
    tickColors: state.tickColors,
    mapLoaded: state.mapLoaded,
    hovGeo: state.hovGeo // eslint-disable-line react/no-unused-prop-types
  };
}

const muniCallback = '__geovis_muni__'

const mapDispatchToProps = dispatch => ({
  loadMuniData: (ccode, scode) => {
    window[muniCallback] = (json) => {
      json.bbox = getBbox(json);
      json.fIdx = getFeatureIndex(json);
      dispatch(receiveMunis({ [scode]: json }));
      dispatch(setViewMode({
        code: { country: ccode, state: scode },
        level: "state",
        mode: "geo"
      }));
    }

    dispatch(requestMunis());
    getJSONP({
      url: `data/geojson/munis/${ccode}/${scode}.jsonp`,
      callbackName: muniCallback
      // error: err => store.dispatch(setErrorMessage(
      //   `Couldn't load config: ${err.url}`
      // ))
    });
  },
  changeViewMode: (ccode, scode, level) => {
    dispatch(setViewMode({
      code: { country: ccode, state: scode },
      level: level,
      mode: "geo"
    }));
  },
  changeMapLoaded: () => {
    dispatch(setMapLoaded(true));
  },
  changeHovGeo: (obj, prev) => {
    // don't want to trigger these a large number of times...
    if (obj.level !== prev.level || obj.id !== prev.id)
      dispatch(setHovGeo(obj));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapboxMap);


//  get data
store.dispatch(requestConfig());

const ctryCallback = '__geovis_country__'
window[ctryCallback] = (json) => {
  json.bbox = getBbox(json);
  json.fIdx = getFeatureIndex(json);
  store.dispatch(receiveCountries(json));

  store.dispatch(requestStates());

  const viewMode = store.getState().config.data.defaultViewMode;
  if (viewMode.level === 'country') {
    getJSONP({
      url: `data/geojson/states/${viewMode.code.country}.jsonp`,
      callbackName: stateCallback
    });
  }

  // json.features.map((d) => {
  //   getJSONP({
  //     url: `data/geojson/states/${d.properties.code}.jsonp`,
  //     callbackName: stateCallback
  //   });
  // });
}

const stateCallback = '__geovis_state__'
window[stateCallback] = (json) => {
  json.bbox = getBbox(json);
  json.fIdx = getFeatureIndex(json);
  store.dispatch(receiveStates({
    [json.features[0].properties.country_code]: json
  }));

  store.dispatch(setViewMode(store.getState().config.data.defaultViewMode));
}

const cfgCallback = '__geovis_config__'
window[cfgCallback] = (json) => {

  store.dispatch(receiveConfig(json));

  const tcks = json.variables[json.defaultYVar].breaks;
  const colors = getTickColors(tcks);
  store.dispatch(setTickColors(colors));
  store.dispatch(setXVar(json.defaultXVar));
  store.dispatch(setYVar(json.defaultYVar));
  store.dispatch(setIndex(json.defaultIndex));
}

getJSONP({
  url: 'config.jsonp',
  callbackName: cfgCallback
  // error: err => store.dispatch(setErrorMessage(
  //   `Couldn't load config: ${err.url}`
  // ))
});
