import React from "react";
import { render } from "react-dom";
import { Row, Col, Well } from "react-bootstrap";
import './style.css';
import {
  NavBarTop,
  PageTitle,
  TableMain,
} from "./components";


const App = () => (
  <div>
    <Row className="show-grid">
      {NavBarTop}
      <Well id="TopWell"></Well>

      <Col xs={1} md={1}></Col>
      <Col xs={12} md={12}>
        
        <div className="text-center">{PageTitle}</div>
        <TableMain />
      
      </Col>
      <Col xs={1} md={1}></Col>
    </Row>
  </div>

);

render(<App />, document.getElementById("root"));
