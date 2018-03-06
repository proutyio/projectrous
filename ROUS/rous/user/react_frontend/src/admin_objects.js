import React, { Component } from 'react';
import axios, { post } from 'axios';
import { columns } from 'react-columns';
import beaver1 from './beaver1.svg';
import './admin_app.css';






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
      <div className="master_log_container">
        <h1>
          Master Log:
        </h1>
        <div id="wrap">
          <textarea className="master_log_box" value={this.state.value} onChange={this.handleChange} readOnly="true" />
        </div>
        
      </div>
    );
  }
}


export
class Node extends React.Component {
  async loadNodeData(){
    const res = await fetch("/listenerData")
    const {ip} = await res.json()
    this.setState({ip})  


    // const json = await res.json()
    // this.setState({ip: 'I lied'})  
  }

  componentDidMount() {
    this.loadNodeData()
    this.timer = setInterval(() => this.loadNodeData(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  
  render(){
    var Columns = require('react-columns');
    return(
      <div className="node_container">
        <div className="node_icon">
          <img src={ beaver1 } className="node_icon_img"></img>
        </div>
        <div className="node_stats_tags">
          <p>Node: {this.state.ip}</p>
          <p>Status: {this.get_status}</p>
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
      </div>

    );
  }
}