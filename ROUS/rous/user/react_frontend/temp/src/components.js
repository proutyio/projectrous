import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import fetch from "node-fetch";

import {
  Table,
  Jumbotron,
  Button,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  Well
} from "react-bootstrap";
import { getRequest } from "./functions";

export const TopNavBar = (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#brand">
          <p>Project ROUS</p>
        </a>
      </Navbar.Brand>
    </Navbar.Header>
  </Navbar>
);

export const PageTitle = (
  <Well>
    <h2 style={{ textAlign: "center" }}>Administration Page</h2>
  </Well>
);

export class NodeTable extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th> Username </th>
            <th> IP </th>
            <th> State </th>
          </tr>
        </thead>
        <tbody>         
            <Node />        
            <Node />
        </tbody>
      </Table>
    );
  }
}
export class Node extends React.Component {
  render() {
    return (
          <tr>
            <td>Node 1</td>
            <td>1</td>
            <td>1</td>
          </tr>
    );
  }
}
        
export class DisableNodeTable extends React.Component {
  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th> Node </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Node 1</td>
            <td>
              <Button bsSize="small" bsStyle="danger">
                Disable
              </Button>
            </td>
          </tr>
          <tr>
            <td>Node 2</td>
            <td>
              <Button bsSize="small" bsStyle="danger">
                Disable
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export class Log extends React.Component {
  // async get_info() {
  //   const latest = await fetch("https://localhost:4242/admin/listenerdata");
  //   const line = await latest.json();
  // }
  // componentDidMount() {
  //   this.get_info();
  //   this.timer = setInterval(() => this.get_info(), 5000);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timer);
  // }

  render() {
    return <Jumbotron>placeholder text</Jumbotron>;
  }
}

export class TestGet extends React.Component {
  constructor() {
    super();
    this.state = { Name: "" };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    axios
      .get("http://localhost:4242/listenerdata")
      .then(response => this.setState({ username: response.data }));
  }
  render() {
    return (
      <div className="button__container">
        <button className="button" onClick={this.handleClick}>
          Click Me
        </button>
        <p>{this.state.username}</p>
      </div>
    );
  }
}
