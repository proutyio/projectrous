import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import SocketIOFileClient from 'socket.io-file-client';
import './style.css';
import {
  Table,
  Well,
  Button,
  Nav,
  Navbar,
  Form,
  FormGroup,
  Col,
  PageHeader,
  Radio,
  ListGroup,
  ListGroupItem,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  ButtonToolbar,
  Modal,
} from "react-bootstrap";


/*#######################################*/
export const NavBarTop = (
  <Navbar className="fixedTop" fixedTop id="NavBarTop">
    <Navbar.Header>
      <Navbar.Brand>
        <div>
          <p style={{float:"left",marginTop:"18%"}}>
            <img src="/static/favicon.ico" weign="30" height="40"/></p>
          <p style={{float:"right",marginTop:"7%"}}><a href="" 
             style={{color:"#FFFFFF",marginLeft:"5px"}}>
             Project ROUS
          </a></p>
        </div>
      </Navbar.Brand>
      
    </Navbar.Header>
    <div style={{height:""}}>
    <Button style={{float:"right",width:"20%",height:"30px",
                    marginTop:"10px",marginBottom:"0px",
                    backgroundColor:"#D73F09",color:"white"}}
            bsSize="small" 
            className="btn btn-default"
            onClick={()=>
              {var s = socketIOClient("http://127.0.0.1:4242",{'forceNew': true}); 
               s.emit("clearall");
              }}><p style={{marginTop:"2px"}}><b>CLEAR</b> Block Graph</p>
  </Button>
  </div>
  </Navbar>
);

/*#######################################*/
export const PageTitle = (
  <PageHeader id="PageTitle">
    User: <small>Select Services</small>
  </PageHeader>
);

/*#######################################*/
function removeAndCapitalize(str){
  str = str.charAt(0).toUpperCase()+str.slice(1);
  str = str.replace('_',' ');
  return str.replace(/\w\S*/g, (t)=>{
    return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();
  });
}

/*#######################################*/
export class FormSend extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242"),
      message: '',
      complex_msg: '',
      show: false,
      complex_values: [],
      display_values:[],
      bw_files: [],
      color_files:[],
      g_on:'{"tag":"service","service":"green_on","uid":""}',
      g_off: '{"tag":"service","service":"green_off","uid":""}',
      r_on: '{"tag":"service","service":"red_on","uid":""}',
      r_off: '{"tag":"service","service":"red_off","uid":""}',
      b_on: '{"tag":"service","service":"blue_on","uid":""}',
      b_off: '{"tag":"service","service":"blue_off","uid":""}',
      p_on: '{"tag":"service","service":"pink_on","uid":""}',
      y_on: '{"tag":"service","service":"yellow_on","uid":""}',
      w_on: '{"tag":"service","service":"white_on","uid":""}',
      rbg_on: '{"tag":"service","service":"redbluegreen","uid":""}',
      wpy_on: '{"tag":"service","service":"whitepinkyellow","uid":""}',
      print_bw: '{"tag":"service","service":"print_bw","uid":""}',
      print_color: '{"tag":"service","service":"print_color","uid":""}',
    };
  }

  componentDidMount() {}

  send = (e) => {
    e.preventDefault()
    this.state.socket.emit('send',this.state.message); 
  };

  complexSend = (e) => {
    e.preventDefault();
    this.state.socket.emit("clearall");
    this.state.socket.emit('complex_send',this.state.complex_values);
    this.state.display_values = this.state.complex_values; 
    this.setState({complex_values:[]});
  };

  messageChange = (e) => {
    this.setState({message: e.target.value});
  };

  complexChange = (e) => {
    this.setState({complex_values:e});
  };

  handleChange = (file) => {   
    console.log(file);
    this.setState({bw_files:this.state.bw_files.concat(file)});
  };

  handleClose = (e) => {
    this.setState({show:false});
    window.location.reload(); //quick refresh to clear buttons, happens so fast its not seen
  };

  handleShow = (e) => {
    this.setState({show:true});
  };

  render() {
    return (
      <Well className="FormSend" style={{marginTop:"20px",padding:"5px"}}>
          <ButtonToolbar className="text-center" justifed
                         style={{margin:"10px",marginBottom:"100px",marginLeft:"14%"}}>
          <div className="btn-group">
            <Form horizontal onSubmit={this.complexSend}>

              <ToggleButtonGroup type="checkbox" 
                                onChange={this.complexChange}
                                justifed
                                style={{marginBottom:"15px"}}
                                bsSize="large">
                    <ToggleButton style={{backgroundColor:""}}
                                  id="TabButtons"
                                  className="btn btn-default"
                                  value={this.state.g_on}>
                                  <p>Green ON</p>
                    </ToggleButton>

                    <ToggleButton style={{backgroundColor:""}}
                                  id="TabButtons"
                                  
                                  className="btn btn-default"
                                  value={this.state.b_on}>
                                  <p>Blue ON</p>
                    </ToggleButton>

                    <ToggleButton style={{backgroundColor:""}}
                                  id="TabButtons"
                                  
                                  className="btn btn-default"
                                  value={this.state.r_on}>
                                  <p>Red ON</p>
                    </ToggleButton>
                    
                  
                    <ToggleButton style={{backgroundColor:"k"}}
                                  id="TabButtons"
                                  className="btn btn-default"
                                  value={this.state.p_on}>
                                  <p>Pink ON</p>
                    </ToggleButton>
                    <ToggleButton style={{backgroundColor:""}}
                                  id="TabButtons"
                                  className="btn btn-default"
                                  value={this.state.y_on}>
                                  <p>Yellow ON</p>
                    </ToggleButton>
                    <ToggleButton style={{backgroundColor:""}}
                                  id="TabButtons"
                                  className="btn btn-default"
                                  value={this.state.w_on}>
                                  <p>White ON</p>
                    </ToggleButton>
                    <ToggleButton style={{backgroundColor:""}}
                                  id="TabButtons"
                                  className="btn btn-default"
                                  value={this.state.rbg_on}>
                                  <p>RBG ON</p>
                    </ToggleButton>
                    <ToggleButton style={{backgroundColor:""}}
                                  id="TabButtons"
                                  className="btn btn-default"
                                  value={this.state.wpy_on}>
                                  <p>WPY ON</p>
                    </ToggleButton>
              </ToggleButtonGroup>
              {this.state.complex_values.map((data,i)=>{
                  return <p style={{textAlign:"left",marginLeft:"35%"}}>
                            {i+1}: {removeAndCapitalize(JSON.parse(data)['service'])}
                          </p>  
              })}
              
            </Form>
          </div>
        </ButtonToolbar>

         <Navbar className="fixedBottom" fixedBottom id="NavBarBottom">
          <Form horizontal onSubmit={this.complexSend}>
            <FormGroup className="text-center" style={{marginTop:"2%"}}>
              <Button style={{backgroundColor:"#FFFFFF",
                              color:"#D73F09",
                              padding:"10px 200px 10px 200px"
                            }} 
                      onClick={this.handleShow}
                      type="submit"><h4><b>SEND</b> to Node Network</h4>
              </Button>
            </FormGroup>
          </Form>           
          <Nav>
          </Nav>
        </Navbar>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <h3 className="text-center" style={{color:"#D73F09",marginBottom:"15px"}}>
              <b>Sent!</b></h3>
              {this.state.display_values.map((data,i)=>{
                  return <p style={{textAlign:"left",marginLeft:"43%"}}>
                            {i+1}: {removeAndCapitalize(JSON.parse(data)['service'])}
                          </p>  
              })}
          </Modal.Header>
          
          <Modal.Footer>
            <div className="text-center">
              <Button bsSize="large" block 
                      onClick={this.handleClose}>
                      <h4><b>{"<< "}</b>BACK</h4>
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </Well>
     
    );
  }
}



