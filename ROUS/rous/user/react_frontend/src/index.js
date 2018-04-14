import React from "react";
import { render } from "react-dom";
import { Row, Col, Well } from "react-bootstrap";
import './style.css';
import {
  NavBarTop,
  PageTitle,
  TableMain,
  ConsoleLog,
} from "./components";


const App = () => (
  <div>
    <Row className="show-grid">
      {NavBarTop}
      <Well id="TopWell"></Well>

      <Col xs={1} md={1}/>
      <Col xs={10} md={10}>
        
        <div className="text-center">{PageTitle}</div>
        <TableMain />
      
      </Col>
      <Col xs={1} md={1}/>
    </Row>



    <Row className="show-grid">
      <Col xs={3} md={3}/>
      <Col xs={6} md={6}>

        <ConsoleLog/>
        
      </Col>
      <Col xs={3} md={3}/>
    </Row>
  </div>

);

render(<App />, document.getElementById("root"));
