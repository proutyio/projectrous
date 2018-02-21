import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import beaver1 from './beaver1.svg';
import './App.css';
import {LedsForm, Dropdown, LedState, PrintForm} from './user-objects.js';

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
        <PrintForm />
        
      
      
      </div>
    );
  } 
}
/*
const Example = ({items, removeItemHandler}) => {
  return (
    <div>
      <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
        {items.map(function(item) {
          return (
            <div key={item.id} className="todo-item" onClick={removeItemHandler.bind(null, item)}>
              {item.name}
            </div>
          );
        })}
      </ReactCSSTransitionGroup>
    </div>
  );
};

Example.propTypes = {
  items: React.PropTypes.array.isRequired,
  removeItemHandler: React.PropTypes.func.isRequired
};
*/

export default App;
