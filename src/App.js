import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

class App extends Component {
  componentWillMount() {
    // Initialize Firebase
    const config = {
      apiKey: 'AIzaSyCK-rDdR-zx7L_Jp3qBCafw-3shDXX9_Wo',
      authDomain: 'manager-9d9c8.firebaseapp.com',
      databaseURL: 'https://manager-9d9c8.firebaseio.com',
      storageBucket: 'manager-9d9c8.appspot.com',
      messagingSenderId: '906313210863'
    };
   firebase.initializeApp(config);
}
  render() {
      const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
      return (
        <Provider store={store}>
          <Router />
        </Provider>
      );
  }
}

export default App;
