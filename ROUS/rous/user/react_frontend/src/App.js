import React, { Component } from 'react';
import { columns } from 'react-columns';
import beaver1 from './beaver1.svg';
import './admin_app.css';
import {Dropdown, Master_log, Node} from './admin_objects.js';

class App extends Component {
  
  
  
  render() {
    
    var Columns = require('react-columns');
    return (
      <div className="App">
        <header className="App-header">
          <div className="beaver_container">
            <img src= {beaver1} className="App-logo" alt="logo" />
          </div>
          <h1 className="App-title">Welcome to ROUS</h1>
        </header>
        <p className="App-intro">
         
        </p>
        <Columns columns="2" gap="10px">
          <Master_log  />
          <Node />
        </Columns>
      
      
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
