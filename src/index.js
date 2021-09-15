import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Restaurant from "./restaurantMenu/Restaurant"
import Profile from "./userProfile/Profile"
import Login from "./userLogin/Login"
import Signup from "./userSignup/Signup"
import Home from "./home/Home"
import * as serviceWorker from './serviceWorker';
import { Router, Route} from 'react-router';
import { createHashHistory } from 'history';


ReactDOM.render((
  <Router history = {createHashHistory()}>
     <Route exact path = "/" component = {Login}/>
     <Route path="/login" component={Login}/>
     <Route path="/restaurant/:id" component={Restaurant}/>
     <Route path="/home" component={Home}/>
     <Route path="/signup" component={Signup}/>
     <Route path="/user" component={Profile}/>
  </Router>
), document.getElementById('root'));


serviceWorker.unregister();
