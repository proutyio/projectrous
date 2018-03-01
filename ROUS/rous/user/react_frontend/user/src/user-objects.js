import React, { Component } from 'react';
import axios, { post } from 'axios';
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
    var columns = require('react-columns');
    return(
      <form className="LedsForm" >
        <h2>LED's</h2>
        <div>Color  Delay Default 0 </div> 
        
          <div className="LedButtons">
            <div className="Led_row">
              <button class="LED_Button" /*onClick=""*/ id="red_LED" />
              <input type="text" />
              <label className="time_amount">Seconds</label>
            </div>
            <div className="Led_row">
              <button class="LED_Button" /*onClick=""*/ id="yellow_LED" />
              <input type="text" />
              <label className="time_amount">Seconds</label>
            </div>
            <div className="Led_row"> 
              <button class="LED_Button" /*onClick=""*/ id="green_LED" />
              <input type="text" />
              <label className="time_amount">Seconds</label>
            </div>
            <div className="Led_row">  
              <button class="LED_Button" /*onClick=""*/ id="blue_LED" />
              <input type="text" />
              <label className="time_amount">Seconds</label>
            </div>
            <div className="Led_row">  
             <button class="LED_Button" /*onClick=""*/ id="pink_LED" />
              <input type="text" />
              <label className="time_amount">Seconds</label>
            </div>
            <div className="Led_row">
              <button class="LED_Button" /*onClick=""*/ id="white_LED" />
              <input type="text" />
              <label className="time_amount">Seconds</label>
            </div>
          </div>
          <button type="submit">Submit</button>
        
      </form>
    );
  }
}

export
class PrintForm extends React.Component{  
  constructor(props) {
    super(props);
    this.state ={
      file:null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }
  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then((response)=>{
      console.log(response.data);
    })
  }
  onChange(e) {
    this.setState({file:e.target.files[0]})
  }
  fileUpload(file){
    const url = 'localhost:8002';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  post(url, formData,config)
  }
  
  render(){
    return(
      <form className="printForm" onSubmit={this.onFormSubmit}>
      <h2>Print a File</h2>
        <input id="upload" ref="upload" type="file" accept="image/*,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
            onChange={(event)=> { 
                this.readFile(event) 
            }}
          onClick={(event)=> { 
                event.target.value = null
            }}/><br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

