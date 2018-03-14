import React, { Component } from "react";
import 'whatwg-fetch';
import socketIOClient from "socket.io-client";
import './style.css';
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import {
  Table,
  Well,
  Button,
  Nav,
  Navbar,
  NavItem,
  NavDropdown,
  Form,
  FormGroup,
  FormControl,
  Col,
  ControlLabel,
  Checkbox,
  DropdownButton,
  MenuItem,
  ButtonToolbar,
  ListGroup,
  ListGroupItem,
  PageHeader,
  Row
} from "react-bootstrap";


export const NavBarTop = (
  <Navbar className="fixedTop" fixedTop id="NavBarTop">
    <Navbar.Header>
      <Navbar.Brand>
        <a href="" style={{color:"#FFFFFF"}}>Project ROUS</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
    </Nav>
  </Navbar>
);




export const PageTitle = (
  <PageHeader id="PageTitle">
    Administration: <small>Nodes and Configuration</small>
  </PageHeader>
);




function graph_func(n = 30) {
    return Math.floor(Math.random()*200);
}

class SparkGraph extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    setInterval(
      () =>
        this.setState({
          data:this.state.data.concat([graph_func()])
        }),
      500
    );
  }
  render() {
    return (
      <Sparklines data={this.state.data} limit={25}>
        <SparklinesLine color="#1c8cdc" />
        <SparklinesSpots />
      </Sparklines>
    );
  }
};





export class TableMain extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242",{'forceNew': true}),
      data:[],
      style:{color:"black"},
      styleA:{color:"black", borderStyle:"solid", 
              borderColor:"blue",borderWidth:"2px"},
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.state.socket.emit("whois");
    },1000);
    this.state.socket.on("discover_nodes", (nodes)=> this.setState({ data: nodes }));
    this.state.socket.on("update_service", (color) => this.setState({style:color}));

  }

  componentWillUnmount() {
    clearInterval();
  }

  send = () => {
    this.state.socket.emit('whois');
  };

  render() {
    return (
      <Well className="TableMain">
        <Table>
          <thead>
            <tr className="text-center">
              <th>Node</th>
              <th>Address</th>
              <th>Services</th>
              <th>Current Step</th>
              <th>Graph</th>
            </tr>
          </thead>
          <tbody>

          {this.state.data.map((data,i) =>{
            var d = JSON.parse(data);
            return (
              <tr key={i}>
                <td style={{verticalAlign:"middle",
                            fontSize:"20px",fontWeight:"bold"}}>{i+1}</td>
                <td style={{verticalAlign:"middle",
                            marginTop:"20px",
                            color:"#D73F09",
                            fontSize:"26px"}}>{d['address']}</td>
                <td style={{verticalAlign:"middle"}}>                  
               

                  {JSON.parse(d['services']).map((data,i) => {
                    return (
                      <div id="service" key={i}>{data['service']}</div>
                    );
                  })}
                
                </td>
                <td style={{verticalAlign:"middle"}}>
                  <p style={this.state.styleA}>WAITING</p>
                  <p style={this.state.style}>CHECKING</p>
                  <p style={this.state.style}>BIDDING</p>
                  <p style={this.state.style}>SERVICE</p>
                </td>
                <td style={{verticalAlign:"middle"}}><SparkGraph/></td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </Well>
    );
  }
}




export class FormSend extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242"),
      message: '',
    };
  }

  componentDidMount() {}

  send = (e) => {
    e.preventDefault()
    this.state.socket.emit('send',this.state.message); 
  };

  messageChange = (e) => {
    this.setState({message: e.target.value});
  };

  render() {
    var str = '{"tag":"","service":""}';
    return (
      <Well className="FormSend">
        <Form horizontal onSubmit={this.send}>
          <FormGroup controlId="">
            <Col componentClass={ControlLabel} sm={9}>
              <p>Send a message into the node network. {str}</p>
            </Col>
            <Col sm={12}>
              <FormControl type="text" 
                 className="form-control" 
                 value={this.state.message} 
                 onChange={this.messageChange}/>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={5} sm={10}>
              <Button style={{backgroundColor:"#D73F09",color:"#FFFFFF"}} 
                      type="submit">submit</Button>
            </Col>
          </FormGroup>
        </Form> 
      </Well>
    );
  }
}








// export class BasicSocketIO extends Component {
//   constructor() {
//     super();
//     this.state = { 
//       socket:socketIOClient("http://127.0.0.1:4242"),
//     };
//   }

//   send = () => {
//     this.state.socket.emit('test'); // change 'red' to this.state.color
//   };

//   render() {
//     this.state.socket.on("hello", function() {
//       console.log("hello");
//     });

//     return (
//       <div style={{ textAlign: "center" }}>
//         <button onClick={() => this.send()}>Test</button>
//       </div>
//     );
//   }
// }


// export class DisplayData extends Component {
//   constructor() {
//     super();
//     this.state = { 
//       socket:socketIOClient("http://127.0.0.1:4242"),
//       data:[],
//     };
//   }

//   componentDidMount() {
//     setInterval(() => this.state.socket.emit("whois"), 5000);
//   }
//   componentWillUnmount() {
//     clearInterval();
//   }

//   send = () => {
//     this.state.socket.emit('whois'); // change 'red' to this.state.color
//   };

//   render() {
//       this.state.socket.on("discover_nodes", function(nodes) {
//         this.setState({ data: nodes })
//      }.bind(this));

//      return (
//         <div>
//           {this.state.data.map(function(data,i){
//             var d = JSON.parse(data)
//             return (
//               <h2 key={i}>
//                 {d['tag']} {d['address']}
//               </h2>
//             );
//           })}
//         </div>
//      );
//    }
// }

