import React, { Component } from "react";
import ReactDOM from 'react-dom'
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
  Row,
  Radio
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




function graph_func(n = 40) {
    return Math.floor(Math.random()*1);
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
      trust:'',
      style:{color:"black"},
      styleA:{color:"black", borderStyle:"solid", 
              borderColor:"blue",borderWidth:"2px"},
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.state.socket.emit("whois");
    },3000);
    this.state.socket.on("discover_nodes", (nodes)=> this.setState({ data: nodes }));
    this.state.socket.on("update_service", (color) => this.setState({style:color}));

  }

  componentWillUnmount() {
    clearInterval();
  }

  removeTrust = (e) => {
    e.preventDefault();
    console.log(this.state.trust);
    var t = this.state.trust;
    this.state.socket.emit("trust", t);
  }

  changeTrust = (e) => {
    this.setState({trust: e.currentTarget.value});
  }

  render() {
    var lst = [];
    return (
      <div>
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
                // var lst = [];
                var d = JSON.parse(data);
                if (lst.length > 0){
                  for(i=0;i<lst.length;i++){
                    // console.log(lst[i]['address']);
                    // console.log(d['address']);
                    if( (lst[i]['address']).toString() === (d['address']).toString() ){
                      // lst.push(d);
                    } 
                    else
                      lst.push(d);
                  }
                }else{
                  lst.push(d);
                }
                // console.log(lst[0]);
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

        
        <Col xs={4} md={6}>
          <FormSend/>
        </Col>
        

        <Col xs={4} md={6}>
          <Well className="FormTrust">
            <h3 className="text-center">Manage Node Trust</h3>
            <Form horizontal onSubmit={this.removeTrust}>
              <FormGroup>
              <div style={{textAlign:"center"}}> 
                  <Radio name="radioGroup"
                         value="0"
                         onChange={this.changeTrust}>
                    Reset
                  </Radio>{' '}
              </div>
              {this.state.data.map((data,i) =>{
                var d = JSON.parse(data);
                var lst = [];
                var x = 0;
                return (
                  <div style={{textAlign:"center"}}>     
                    <Radio name="radioGroup" 
                           inline 
                           value={d['address']}
                           onChange={this.changeTrust}>
                      {d['address']}
                    </Radio>{' '}
                  </div>
                );
              })}
              </FormGroup>
              
              <FormGroup>
                <Col smOffset={5} sm={9}>
                  <div style={{textAlign:"left", margin:"0 auto"}}> 
                    <Button style={{backgroundColor:"#D73F09",color:"#FFFFFF"}} 
                            type="submit">remove trust</Button>
                  </div>
                </Col>
              </FormGroup>
            </Form> 
          </Well>
        </Col>
      </div>

    );
  }
}




class FormSend extends Component {
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
    var str = '{"tag":"service","service":"green_on"}';
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





// // Need to rethink, works, but behavior is not good
// export class ConsoleLog extends Component {
//   constructor() {
//     super();
//     this.state = { 
//       socket:socketIOClient("http://127.0.0.1:4242"),
//       data: [],
//     };
//   }

//   componentDidMount() {
//     setInterval(() => {
//       this.state.socket.emit("console");
//     },2000);
//     this.state.socket.on("update_console", (data)=> 
//this.setState({ data: this.state.data.concat(data) }));
//   }

//   componentWillUnmount() {
//     clearInterval();
//   }

//   render() {
//     return (
//       <Well id="ConsoleLog">
//         <h4 style={{color:"white"}}>Console Log</h4>
//         {this.state.data.map((data,i) =>{
//             //var d = JSON.parse(data);
//             {console.log(this.state.data)}
//             return (
//               <p>{data}</p>
//             );
//         })}
        
//       </Well>
//     );
//   }
// }








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


// export class BasicDynamicData extends Component {
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

