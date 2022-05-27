import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';

import MainPage from './containers/MainPage';
import RegisterPage from './containers/RegisterPage';
import RecuePage from './containers/RescuePage';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/rescue" component={RecuePage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
