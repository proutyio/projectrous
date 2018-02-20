import React, { Component } from 'react';
import beaver1 from './beaver1.svg';
import './App.css';
export
class Button extends React.Component {
    render() {
      
      return (
       <button text="Turn on LED's"/>
       
      );
    }
  }

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
            // <select value='1'>
            //     <option value='1'>1</option>
            //     <option value='2'>2</option>
            //     <option value='3'>3</option>
            //     <option value='4'>4</option>
            //     <option value='5'>5</option>
            //     <option value='6'>6</option>
            // </select>
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