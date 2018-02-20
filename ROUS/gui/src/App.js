import React, { Component } from 'react';
import beaver1 from './beaver1.svg';
import './App.css';
import {Button, Dropdown} from './user-objects.js';

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
        <Dropdown />
        <LedState />
        
        

      </div>
    );

    
  }
  constructor(props) {
    super(props)
    // the initial application state
    this.state = {
      led: null
    }
  }
  
  
  // App "actions" (functions that modify state)
  signIn(led) {
    // This is where you would call Firebase, an API etc...
    // calling setState will re-render the entire app (efficiently!)
    this.setState({
      led: {
        led
        
      }
    })
  }
  
  signOut() {
    // clear out user from state
    this.setState({led: null})
  }
  
  
  
}

class LedState extends React.Component {
  
  // Using a class based component here because we're accessing DOM refs
 
  handle_led(e) {
    e.preventDefault()
    let led = this.refs.led_on.value
   
    this.props.onSignIn(led)
  }
  
  render() {
    return (
      <form onClick={this.handle_led.bind(this)}>
        <button type="button" ref="led_on" name="led_on">Turn LED ON</button>
        <button type="button" ref="led_off" name="led_off">Turn LED OFF</button>
      </form>
    )
  }

}




export default App;
