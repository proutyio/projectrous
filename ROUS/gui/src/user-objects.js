import React, { Component } from 'react';
import { columns } from 'react-columns';
import beaver1 from './beaver1.svg';
import './App.css';

class print{


}
export
class Dropdown extends React.Component{
    render(){
        return(
            
            <select>
                <option value={this.props.option1}>{this.props.option1}</option>
                <option value={this.props.option2}>{this.props.option2}</option>
                <option value={this.props.option3}>{this.props.option3}</option>
                <option value={this.props.option4}>{this.props.option4}</option>
                <option value={this.props.option5}>{this.props.option5}</option>
                <option value={this.props.option6}>{this.props.option6}</option>
            </select>
        );

    }

}
Dropdown.defaultProps={
    default_selected :'blue',
    option1 :'red',
    option2 :'green',
    option3 :'pink',
    option4 :'white',
    option5 :'yellow',
    option6 :'blue'

};

export
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

export
class LedsForm extends React.Component{
  render(){
    var Columns = require('react-columns');
    return(
      <div className="LedsForm" >
        <h2>LED's</h2>
        <div className="LedButtons">
          <Columns columns="6" gap="5px">
            <div class="LED_Button" onClick="" id="red_LED" />
            <div class="LED_Button" onClick="" id="yellow_LED" />
            <div class="LED_Button" onClick="" id="green_LED" />
            <div class="LED_Button" onClick="" id="blue_LED" />
            <div class="LED_Button" onClick="" id="pink_LED" />
            <div class="LED_Button" onClick="" id="white_LED" />
          </Columns>
        </div>
        <Dropdown />
        <LedState />
      </div>
    );
  }
}

export
class PrintForm extends React.Component{  
  render(){
    return(
      <div name="printForm">
      <h2>Print a File</h2>
        <input id="upload" ref="upload" type="file" accept="image/*,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
            onChange={(event)=> { 
                this.readFile(event) 
            }}
          onClick={(event)=> { 
                event.target.value = null
            }}/>
        <button type="submit" value="submit" />
      </div>
    );
  }
}

