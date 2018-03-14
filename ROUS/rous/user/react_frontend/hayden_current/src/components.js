import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import fetch from "node-fetch";

import {
  Table,
  Row,
  Col,
  Jumbotron,
  Button,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  Well
} from "react-bootstrap";
import { getRequest, loadNodeData } from "./functions";

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
    <h2 style={{ textAlign: "center" }}>Admin Page</h2>
  </Well>
);

export class NodeTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          ip: "192.168.1.2",
          name: "node " + 1,
          state: "printing",
          services: "printing, complex jobs, yellow_led"
        },
        {
          ip: "192.168.1.3",
          name: "node " + 2,
          state: "waiting",
          services: "printing, blue_led"
        },
        {
          ip: "192.168.1.4",
          name: "node " + 3,
          state: "waiting",
          services: "complex jobs, red_led"
        }
      ]
    };
  }
  componentDidMount() {
    loadNodeData();
    this.timer = setInterval(() => loadNodeData(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    let rows = this.state.data.map(node => {
      return <Nodes key={node.ip} data={node} />;
    });

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th> Name </th>
            <th> IP </th>
            <th> State </th>
            <th> Services </th>
          </tr>
        </thead>
        <tbody> {rows} </tbody>{" "}
      </Table>
    );
  }
}

const Nodes = props => {
  return (
    <tr>
      <td>{props.data.name}</td>
      <td>{props.data.ip}</td>
      <td>{props.data.state}</td>
      <td>{props.data.services}</td>
    </tr>
  );
};

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
              <Button bsSize="small" bsStyle="danger" >
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
    return <Jumbotron><ul>
    <li>placeholder text</li>
    </ul></Jumbotron>;
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
