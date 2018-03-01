import React, { Component } from 'react';
import axios, { post } from 'axios';
import { columns } from 'react-columns';
import beaver1 from './beaver1.svg';
import './admin_app.css';


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
    default_selected :'red',
    option1 :'red',
    option2 :'green',
    option3 :'pink',
    option4 :'white',
    option5 :'yellow',
    option6 :'blue'

};




export 
class Master_log extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {props}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>
          Master Log:
        </h1>
        <div id="wrap">
          <textarea className="master_log_box" value={this.state.value} onChange={this.handleChange} readOnly="true" />
        </div>
        
      </form>
    );
  }
}


export
class Node extends React.Component {
  get_ip(){
      return "";
  }
  get_status(){

  }
  get_bid(){ 
      return "";
  }
  get_services(){
    return "";
  }
  
  
  render(){
    var Columns = require('react-columns');
    return(
      <Columns columns="3" gap="1px">
        <button id="node_icon"></button>
        
        <div className="node_stats_tags">
          <p>Node: {this.get_ip}</p>
          <p>Bid: {this.get_bid}</p>
          <p>Services:</p>
          <div className="node_services"></div>
        </div>
        <div className="node_stats">
          <p>{this.get_ip}</p>
          <p>{this.get_status}</p>
          <p>{this.get_bid}</p>
          <p>{this.get_services}</p>
          <div className="node_services"></div>
        </div>
      </Columns>

    );
  }
}