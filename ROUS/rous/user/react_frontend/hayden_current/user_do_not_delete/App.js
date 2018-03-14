import React, { Component } from 'react';
import { columns } from 'react-columns';
import beaver1 from './beaver1.svg';
import './App.css';
import {LedsForm, Dropdown, LedState, PrintForm} from './user-objects.js';

class App extends Component {
  
  
  
  render() {
    
    var Columns = require('react-columns');
    return (
      <div className="App">
        <header className="App-header">
          <div className="beaver_container">
            <img src={beaver1} className="App-logo" alt="logo" />
          </div>
          <h1 className="App-title">Welcome to ROUS</h1>
        </header>
        <p className="App-intro">
         
        </p>
        <Columns columns="2" gap="10px">
        <PrintForm />
        <LedsForm />  
        </Columns>
      
      
      </div>
    );
  } 
}



export default App;