import React, { Component } from "react";
import ReactDOM from "react-dom";
import { render } from "react-dom";
import axios from "axios";
import { Table, Row, Col } from "react-bootstrap";

import {
  NodeTable,
  PageTitle,
  TopNavBar,
  TestGet,
  Log,
  DisableNodeTable,
  AddNode,
  Board
} from "./components";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {

    return (
      <Table>
        <Row className="show-grid">
          {TopNavBar}
          <Col xs={1} md={1} />

          <Col xs={10} md={10}>
            {PageTitle}
          </Col>
          <Col xs={1} md={1} />
        </Row>
        <Row className="main-content">
          <Col xs={1} md={1} />
          <Col xs={5} md={5}>
            <Log />
            <TestGet />
            <DisableNodeTable />
          </Col>
          <Col xs={5} md={5}>
            <NodeTable />
          </Col>
          <Col xs={1} md={1} />
        </Row>
      </Table>
    );
  }
}

render(<App />, document.getElementById("root"));
