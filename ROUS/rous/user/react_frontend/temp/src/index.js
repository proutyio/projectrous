import React, { Component } from "react";
import ReactDOM from "react-dom";
import { render } from "react-dom";
import axios from 'axios';
import { Table, Row, Col } from "react-bootstrap";

import { NodeTable, PageTitle, TopNavBar, TestGet, Log, DisableNodeTable, AddNode } from "./components";

const App = () => (
  <Table>
    <Row className="show-grid">
      {TopNavBar}
      <Col xs={1} md={2} />

      <Col xs={10} md={8}>
        {PageTitle}
      </Col>
      <Col xs={1} md={2} />
    </Row>
    <Row className="main-content">
      <Col xs={1} md={2} />
        <Col xs={5} md={8}>
          <Log />
          <TestGet />
          <DisableNodeTable />
        </Col>
        <Col xs={5} md={8}>
        <NodeTable />
        <AddNode />
        
        </Col>
      <Col xs={1} md={2} />
    </Row>
  </Table>
);

render(<App />, document.getElementById("root"));
