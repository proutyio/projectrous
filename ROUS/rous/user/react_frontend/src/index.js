import React from "react";
import { render } from "react-dom";
import { Row, Col, Well } from "react-bootstrap";
import './style.css';
import {
  NavBarTop,
  PageTitle,
  TableMain,
  FormSend
} from "./components";


const App = () => (
  <Row className="show-grid">
    {NavBarTop}
    <Well id="TopWell"></Well>


    <Col xs={1} md={2}>
    </Col>
    <Col xs={10} md={8}>
      <div className="text-center">{PageTitle}</div>
      
      
      <TableMain />

      <Col xs={4} md={6}>
        <FormSend/>
      </Col>
      <Col xs={4} md={6}>
        <FormSend/>
      </Col>


    </Col>
    <Col xs={1} md={2}/>
  </Row>
);

render(<App />, document.getElementById("root"));
