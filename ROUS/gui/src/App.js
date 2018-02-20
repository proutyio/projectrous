import React, { Component } from 'react';
import beaver1 from './beaver1.svg';
import './App.css';
import {LedsForm, Button, Dropdown, LedState, printForm} from './user-objects.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={beaver1} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ROUS</h1>
        </header>
        <p className="App-intro">
         
        </p>
        
        <LedsForm />
        <printForm />
      </div>
    );
  } 
}

export default App;
