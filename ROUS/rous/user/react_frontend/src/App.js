import React, { Component } from 'react';
import { columns } from 'react-columns';
import beaver1 from './beaver1.svg';
import './admin_app.css';
import { Master_log, Node } from './admin_objects.js';

class App extends Component {
  
  
  
  render() {
    
    var Columns = require('react-columns');
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title"><b>ROUS</b> Admin</h1>
          <div className="beaver_container">
            <img src= {beaver1} className="App-logo" alt="logo" />
          </div>
          
        </header>
        <div className="App-content">
          <p className="App-intro"> </p>
          <div id="left_side">
            <Master_log  />
            </div>
            <div id="right_side">
              <Node  />
              <Node  />
              <Node  />
            </div>
            
        </div>
      
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
