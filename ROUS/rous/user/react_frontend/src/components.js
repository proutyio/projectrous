import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './style.css';
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import {
  Table,
  Well,
  Button,
  Nav,
  Navbar,
  Form,
  FormGroup,
  FormControl,
  Col,
  ControlLabel,
  PageHeader,
  Radio
} from "react-bootstrap";



/*#######################################*/
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



/*#######################################*/
export const PageTitle = (
  <PageHeader id="PageTitle">
    Administration: <small>Nodes and Configuration</small>
  </PageHeader>
);



/*#######################################*/
var check = false;
function graph_func(n = 40) {
  if(check === false){
    check = true;
    return .2;
  }
  else {
    check = false;
    return .1;
  }
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
      <Col xs="2" md="4">
      <Sparklines data={this.state.data} limit={25}>
        <SparklinesLine color="#1c8cdc" />
        <SparklinesSpots />
      </Sparklines>
      </Col>
    );
  }
};




/*#######################################*/
export class TableMain extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242",{'forceNew': true}),
      data:[],
      graphdata: [],
      trust:'',
      style_graph:"#1c8cdc",
      style_basic:{color:"black"},
      style_wait:{color:"black"},
      style_bid:{color:"black"},
      style_win:{color:"black"},
      style_blue:{color:"black", borderStyle:"solid",borderColor:"blue",borderWidth:"4px"},
      style_green:{color:"black", borderStyle:"solid",borderColor:"green",borderWidth:"4px"},
      style_red:{color:"black", borderStyle:"solid",borderColor:"red",borderWidth:"4px"},
      just_blue:"#1c8cdc",
      just_green:"green",
      just_red:"red",
    };
    setInterval(
      () =>
        this.setState({
          graphdata:this.state.graphdata.concat([graph_func()])
    }),500);
  
    setInterval(() => {
      this.state.socket.emit("check_wait")
      this.state.socket.emit("check_bid")
      this.state.socket.emit("check_win")
    },15);
    setInterval(() => {
      this.state.socket.emit("whois");
    },3000);
    this.state.socket.on("discover_nodes", (nodes)=> this.setState({ data: nodes }));
    this.state.socket.on("update_service", (color) => this.setState({style:color}));
    this.state.socket.on("check_waiting", (nodes) => {
      if(nodes !== []){
        this.setState({style_wait:this.state.style_blue});
        this.setState({style_graph:this.state.just_blue});
        this.setState({style_bid:this.state.style_basic});
        this.setState({style_win:this.state.style_basic});
      }
    });
    this.state.socket.on("check_bidding", (nodes) => {
      if(nodes !== []){
        this.setState({style_wait:this.state.style_basic});
        this.setState({style_bid:this.state.style_red});
        this.setState({style_graph:this.state.just_red});
        this.setState({style_win:this.state.style_basic});
      }
    });
    this.state.socket.on("check_winning", (nodes) => {
      if(nodes !== []){
        this.setState({style_wait:this.state.style_basic});
        this.setState({style_bid:this.state.style_basic});
        this.setState({style_win:this.state.style_green});
        this.setState({style_graph:this.state.just_green});
      }
    });
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
                var d = JSON.parse(data);
                if (lst.length > 0){
                  for(i=0;i<lst.length;i++){
                    if( (lst[i]['address']).toString() === (d['address']).toString() ){}
                    else lst.push(d);/*this is dumb logic, I need to fix*/ 
                  }
                }else{
                  lst.push(d);
                }
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
                      <p style={this.state.style_wait}>WAITING</p>
                      <p style={this.state.style_bid}>BIDDING</p>
                      <p style={this.state.style_win}>SERVICE</p>
                    </td>
                    <td style={{verticalAlign:"middle"}}>
                        <Col xs="2" md="4">
                          <Sparklines data={this.state.graphdata} limit={25}>
                            <SparklinesLine color={this.state.style_graph} />
                            <SparklinesSpots />
                          </Sparklines>
                        </Col>
                    </td>
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



/*#######################################*/
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





/*#######################################*/
export class ConsoleLog extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242"),
      data: [],
    };
    
    setInterval(() => {
      this.state.socket.emit("console");
    },2000);
    
    this.state.socket.on("update_console", (data)=> 
      this.setState({ data: this.state.data.concat(data) }));
  }

  componentWillUnmount() {
    clearInterval();
  }

  render() {
    return (
      <Well id="ConsoleLog">
        <h4 id="Console_h4">Console Log</h4>
        <div style={{paddingBottom:"100px"}}>
        {this.state.data.map((data,i) =>{
            if(i === 20){
              this.setState.data = []
            }
            // {console.log(this.state.data)}
            return (
              <p id="Console_p" className="text-center">
              {JSON.parse(data)['address']+" "+
               JSON.parse(data)['tag']+" "+
               JSON.parse(data)['message']}</p>
            );
        })}
        </div>
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


// export class BasicDynamicData extends Component {
//   constructor() {
//     super();
//     this.state = { 
//       socket:socketIOClient("http://127.0.0.1:4242"),
//       data:[],
//     };
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

