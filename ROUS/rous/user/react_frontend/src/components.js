import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import SocketIOFileClient from 'socket.io-file-client';
import './style.css';
// import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import {
  Table,
  Well,
  Button,
  Nav,
  Navbar,
  Form,
  FormGroup,
  // FormControl,
  Col,
  // Row,
  // ControlLabel,
  PageHeader,
  Radio,
  ListGroup,
  ListGroupItem,
  ToggleButtonGroup,
  ToggleButton,
  ButtonToolbar,
  Modal,
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
function removeAndCapitalize(str){
  str = str.charAt(0).toUpperCase()+str.slice(1);
  str = str.replace('_',' ');
  return str.replace(/\w\S*/g, (t)=>{
    return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();
  });
}

/*#######################################*/
export class TableMain extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242",{'forceNew': true}),
      data:[],
      trust:'',
      untrusted:[],
      check:false,
      row:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //graph block rows, gets size from
      row_A:[],
      row_B:[],
      row_C:[],
      track:[],
      IP:["192.168.0.101","192.168.0.103"],  
    };
    
    setInterval(() => {
      this.state.socket.emit("whois");
    },3000);

    this.state.socket.on("discover_nodes", (nodes)=> {
      this.setState({ data: nodes });
      if(this.state.row_A.length===0){
        this.setState({row_A:this.createArr()});
        this.setState({track:this.trackArr()});
      }
      if(this.state.row_B.length===0)
        this.setState({row_B:this.createArr()});
      if(this.state.row_C.length===0)
        this.setState({row_C:this.createArr()});
    });

    this.state.socket.on("update_console", (data) => {
      data.map((d,i)=>{
        var m = JSON.parse(d);
        if(m["tag"] == "winner")
          this.state.IP.map((ip,i)=>{
            if(m["address"] == ip)
              this.graphLogic(this.state.row_A[i],i,this.state.track[i],"green")
          })
        if(m["tag"] == "bidding")
          this.state.IP.map((ip,i)=>{
            if(m["address"] == ip)
              this.graphLogic(this.state.row_B[i],i,this.state.track[i],"red")
          })
        if(m["tag"] == "waiting")
          this.state.IP.map((ip,i)=>{
            if(m["address"] == ip)
              this.graphLogic(this.state.row_C[i],i,this.state.track[i],"blue")
          })
      });
    });
  }

  componentWillUnmount() {
    clearInterval();
  }

  removeTrust = (e) => {
    e.preventDefault();
    // console.log(this.state.trust);

    if(this.state.trust !== '0'){
      this.setState({untrusted: this.state.untrusted.concat(this.state.trust)});
      this.state.untrusted.map((data,i)=>{
        this.state.socket.emit("trust",data);
      });
    }
    else{
      var t = this.state.trust
      this.state.socket.emit("trust",t);
      this.setState({untrusted:[]});
    }
  };

  nodeSize = (e) => {
    return this.state.data.length;
  };

  changeTrust = (e) => {
    this.setState({trust: e.currentTarget.value});
  };
  
   //I need to explain all the graph logic below. I will forget, little complicated
  graphLogic = (graph,x,track,color) => {
    try{
      var check = false;
      track.map((data,i)=>{
        if(i===this.state.row.length-1 && data===2 && check===false){
          graph[i] = <td style={{backgroundColor:color}}/>
          this.clearGraph(track,x)
          check = true;
        }
        else if(data===1 && check===false){
          this.updateGraph(graph,track,i,color);     
          check = true;
          track[i] = 2;
        }
     });
    }finally{}
  };

  updateGraph = (data,track,i,color) => {
    data[i] = <td style={{backgroundColor:color}}/>;
    track[i] = 2;
    console.log(track);
    data.map((r,j) => {
      if(j > i)
        data[j] = <td style={{backgroundColor:""}}/>
    });
  };

  clearGraph = (track, x) => {
    this.state.track[x].map((t,i)=>{
      this.state.row_A[x][i] = <td style={{backgroundColor:""}}/>
      this.state.row_B[x][i] = <td style={{backgroundColor:""}}/>
      this.state.row_C[x][i] = <td style={{backgroundColor:""}}/>
      track[i] = 1
    });
  };

  clearAll = () => {
    this.state.IP.map((d,i)=>{
      this.state.row.map((e,j)=>{
        this.state.row_A[i][j] = <td style={{backgroundColor:""}}/>
        this.state.row_B[i][j] = <td style={{backgroundColor:""}}/>
        this.state.row_C[i][j] = <td style={{backgroundColor:""}}/>
        this.state.track[i][j] = 1
      });
    });
  };

  updateGraph = (data,track,i,color) => {
    data[i] = <td style={{backgroundColor:color}}/>;
    track[i] = 2;
    console.log(track);
    data.map((r,j) => {
      if(j > i)
        data[j] = <td style={{backgroundColor:""}}/>
    });
  };

  createRows = (e) =>{
    var r = []
    this.state.row.map((data,i)=>{r[i] = <td/>});
    return r;
  };

  createArr = (e) => {
    var arr = new Array(100); //bug with getting length so hardcoded for now
    this.state.data.map((data,i)=>{
      arr[i] = this.createRows();
    });
    return arr;
  };

  createTrack = (e) => {
    var t = []
    this.state.row.map((data,i)=>{t[i] = 1});
    return t;
  };

  trackArr = (e) => {
    var arr = new Array(100);
    this.state.data.map((data,i)=>{
      arr[i] = this.createTrack();
    });
    return arr;
  };

  render() {
    return (
      <div>

      <Col xs={3} md={2}>
        <ConsoleLog/>
      </Col>

      <Col xs={7} md={7}>
        <Well className="TableMain">
          <Table>
            <thead>
              <tr className="text-center">
                <th/>
                <th>Node</th>
                <th>Address</th>
                <th>Graph
                    <Button style={{marginLeft:"5%"}} 
                      onClick={()=>{this.clearAll()}}>
                      Clear Graph
                    </Button>
                </th>
                <th>Services</th>
                <th/>
              </tr>
            </thead>
            
            <tbody>
              {this.state.data.map((data,i) =>{
                var parsed_data = JSON.parse(data);                
                return (
                  <tr key={i}>
                    <td/>
                    <td style={{verticalAlign:"middle",
                                fontSize:"20px",fontWeight:"bold"}}>{i+1}
                    </td>
                    <td style={{verticalAlign:"middle",
                                marginTop:"0px",
                                color:"#D73F09",
                                fontSize:"26px"}}>{parsed_data['address']}
                    </td>
                    
                    <td style={{verticalAlign:"middle",paddingLeft:"2%",paddingRight:"2%"}}>
                      <Table id="GraphTable" striped bordered condensed hover>
                        <thead>
                          {this.state.row.map(()=>{
                            return ( <th style={{borderTop:"1px solid #f5f5f5",
                                  borderLeft:"1px solid #f5f5f5",
                                  borderRight:"1px solid #f5f5f5",
                                  backgroundColor:"#f5f5f5",
                                  paddingTop:"30px"}}></th>);
                            })
                          }
                        </thead>
                        <tbody>
                          <tr>{this.state.row_A[i]}</tr>
                          <tr>{this.state.row_B[i]}</tr>
                          <tr>{this.state.row_C[i]}</tr>
                        </tbody>
                      </Table>
                    </td>

                    <td style={{verticalAlign:"middle"}}>   
                      {JSON.parse(parsed_data['services']).map((data,j) => {
                        return (
                          <h4 id="service" key={j}>
                            {removeAndCapitalize(data['service'])}
                          </h4>
                        );
                      })}
                    </td>
                    <td/>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Well>
        </Col>

        <Col xs={3} md={3}>
          <div style={{}}>
            <FormSend/>
          </div>

          <Well className="FormTrust">
            <h3 className="text-center">
              Manage Trust
            </h3>
            <Form horizontal onSubmit={this.removeTrust}>
              <FormGroup style={{marginLeft:"20%"}}>
                <div> 
                    <Radio name="radioGroup"
                           value="0"
                           onChange={this.changeTrust}>
                      <p>Reset</p>
                    </Radio>{' '}
                </div>
                {this.state.data.map((data,i) =>{
                  var d = JSON.parse(data);
                  return (
                    <div>     
                      <Radio name="radioGroup" 
                             inline 
                             value={d['address']}
                             onChange={this.changeTrust}>
                        <p>{d['address']}</p>
                      </Radio>{' '}
                    </div>
                  );
                })}
              </FormGroup>
              <FormGroup className="text-center" style={{marginTop:"0px"}}>
                <Button style={{backgroundColor:"#D73F09",color:"#FFFFFF"}} 
                        type="submit">remove trust
                </Button>
              </FormGroup>
              <FormGroup className="text-center">
                <h5>Untrusted Nodes:</h5>
                {this.state.untrusted.map((data,i)=>{
                  return <h4 style={{color:"red"}}>{data}</h4>
                })}
              </FormGroup>
            
            </Form> 

          </Well>
        </Col>

      </div>
    );
  }
}

// var fileSocket = socketIOClient('http://127.0.0.1:4242');
// var uploader = new SocketIOFileClient(fileSocket);

// uploader.on('ready', function() {
// 	console.log('SocketIOFile ready to go!');
// });
// uploader.on('loadstart', function() {
// 	console.log('Loading file to browser before sending...');
// });
// uploader.on('progress', function(progress) {
// 	console.log('Loaded ' + progress.loaded + ' / ' + progress.total);
// });
// uploader.on('start', (fileInfo) => {
// 	console.log('Start uploading', fileInfo);
// });
// uploader.on('stream', (fileInfo) => {
// 	console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
// });
// uploader.on('complete', (fileInfo) => {
// 	console.log('Upload Complete', fileInfo);
// });
// uploader.on('error', (err) => {
// 	console.log('Error!', err);
// });
// uploader.on('abort', (fileInfo) => {
// 	console.log('Aborted: ', fileInfo);
// });


/*#######################################*/
class FormSend extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242"),
      message: '',
      complex_msg: '',
      show: false,
      complex_values: [],
      bw_files: [],
      color_files:[],
      g_on:'{"tag":"service","service":"green_on"}',
      g_off: '{"tag":"service","service":"green_off"}',
      r_on: '{"tag":"service","service":"red_on"}',
      r_off: '{"tag":"service","service":"red_off"}',
      b_on: '{"tag":"service","service":"blue_on"}',
      b_off: '{"tag":"service","service":"blue_off"}',
      print_bw: '{"tag":"service","service":"print_bw"}',
      print_color: '{"tag":"service","service":"print_color"}',
    };
  }

  componentDidMount() {}

  send = (e) => {
    e.preventDefault()
    this.state.socket.emit('send',this.state.message); 
  };

  complexSend = (e) => {
    e.preventDefault();
    // console.log(this.state.bw_files);
    var tmp = [];
    if(this.state.bw_files.length !== 0){
      console.log("in");
      for(var x=0;x<this.state.bw_files[0].length;x++){
        console.log(x);
        tmp[x] = (this.state.print_bw);
      }
    }
    this.state.complex_values.map((data,i)=>{
      console.log(tmp);
      console.log(data);
      tmp.concat(data);
    });
    // tmp += this.state.complex_values
    console.log(tmp);
    // this.state.complex_values = tmp;
    console.log(this.state.complex_values);
    this.state.socket.emit('complex_send',this.state.complex_values); 
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
  };

  handleShow = (e) => {
    this.setState({show:true});
  };

  // fileInput = (e) => {
  //   if (document.getElementById("myFile").value) {
  //     var file = document.getElementById("myFile").value;
  //     console.log(file);
  //     var reader = new FileReader();
  //     reader.readAsText(file);
  //      return reader;
  //   }
  //   else{
  //      return e;
  //   }
  // }
 
  render() {
    return (
      <Well className="FormSend" style={{marginTop:"20px",padding:"5px"}}>
        <Form horizontal onSubmit={this.send}>
          <h3 className="text-center" style={{marginTop:"20px"}}>Select Service</h3>
          <ButtonToolbar className="text-center" style={{margin:"10px",marginBottom:"15px"}}>
            <ToggleButtonGroup type="radio" name="options" defaultValue={0} vertical>
              <ToggleButton style={{padding:"13px",fontWeight:"bold",marginBottom:"5%"}} 
                            onChange={this.handleShow}>
                            Complex Job</ToggleButton>
              <ToggleButton style={{padding:"10px",color:"green"}}
                            value={this.state.g_on} onChange={this.messageChange}>
                            Green ON</ToggleButton>
              {/*<ToggleButton style={{padding:"10px",color:"green"}}
                            value={this.state.g_off} onChange={this.messageChange}>
                            Green OFF</ToggleButton>*/}
              <ToggleButton style={{padding:"10px",color:"red"}}
                            value={this.state.r_on} onChange={this.messageChange}>
                            Red ON</ToggleButton>
              {/*<ToggleButton style={{padding:"10px",color:"red"}}
                            value={this.state.r_off} onChange={this.messageChange}>
                            Red OFF</ToggleButton>*/}
              <ToggleButton style={{padding:"10px",color:"blue"}}
                            value={this.state.b_on} onChange={this.messageChange}>
                            Blue ON</ToggleButton>
              {/*<ToggleButton style={{padding:"10px",color:"blue"}}
                            value={this.state.b_off} onChange={this.messageChange}>
                            Blue OFF</ToggleButton>*/}
              <ToggleButton style={{padding:"18px",marginTop:"5%"}}
                            onChange={this.messageChange}
                            value={this.state.print_bw}>
                            <p>Print (Black and White)</p>
                            <input type="file" 
                                   style={{marginLeft:"15%"}}
                                   onChange={(e)=>this.handleChange(e.target.files)}/>
                            </ToggleButton>
              <ToggleButton style={{padding:"18px"}}
                            onChange={this.messageChange}
                            value={this.state.print_color}>
                            <p>Print (Color)</p>
                            <input type="file"
                                   style={{marginLeft:"15%"}} 
                                   onChange={(e)=>this.handleChange(e.target.files)}/>
                            </ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
          
          <FormGroup className="text-center" style={{marginTop:"20px"}}>
            <Col>
              <Button style={{backgroundColor:"#D73F09",color:"#FFFFFF"}} 
                      type="submit">send to node network</Button>
            </Col>
          </FormGroup>
        </Form> 

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
              <Modal.Title>Complex Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="text-center">
                <Form horizontal onSubmit={this.complexSend}>
                  <h4>Select Services</h4>
                  <ToggleButtonGroup type="checkbox" 
                                    onChange={this.complexChange}
                                    vertical
                                    style={{marginBottom:"15px"}}>
                    <ToggleButton style={{padding:"12px 100px 15px 100px",color:"green"}}
                                  value={this.state.g_on}>
                                  Green ON</ToggleButton>
                    {/*<ToggleButton style={{padding:"10px",color:"green"}}
                                  value={this.state.g_off}>
                                  Green OFF</ToggleButton>*/}
                    <ToggleButton style={{padding:"12px",color:"red"}}
                                  value={this.state.r_on}>
                                  Red ON</ToggleButton>
                    {/*<ToggleButton style={{padding:"10px",color:"red"}}
                                  value={this.state.r_off}>
                                  Red OFF</ToggleButton>*/}
                    <ToggleButton style={{padding:"12px",color:"blue"}}
                                  value={this.state.b_on}>
                                  Blue ON</ToggleButton>
                    {/*<ToggleButton style={{padding:"10px",color:"blue"}}
                                  value={this.state.b_off}>
                                  Blue OFF</ToggleButton>*/}
                    <ToggleButton style={{padding:"18px",marginTop:"5%"}}
                                  value={this.state.print_bw}>
                                  <p>Print (Black and White)</p>
                                  <input type="file" id="myFile" 
                                    multiple="multiple"
                                    onChange={(e)=>this.handleChange(e.target.files)}
                                    style={{marginLeft:"10%"}} />
                                  </ToggleButton>
                    <ToggleButton style={{padding:"18px"}}
                                  value={this.state.print_color}>
                                  <p>Print (Color)</p>
                                  <input type="file" id="myFile"
                                    multiple="multiple"
                                    onChange={(e)=>this.handleChange(e.target.files)} 
                                    style={{marginLeft:"10%"}} />
                                  </ToggleButton>
                  </ToggleButtonGroup>
                  {this.state.complex_values.map((data,i)=>{
                      return <p style={{textAlign:"left",marginLeft:"43%"}}>
                                {i+1}: {removeAndCapitalize(JSON.parse(data)['service'])}
                              </p>  
                  })}
                  <FormGroup className="text-center" style={{marginTop:"20px"}}>
                    <Col>
                      <Button style={{backgroundColor:"#D73F09",
                                      color:"#FFFFFF",
                                      padding:"10px 120px 10px 120px"
                                    }} 
                              onClick={this.handleClose}
                              type="submit">submit complex job
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
          </Modal.Body>
          <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>

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
      check:[],
      console_length: 200,
    };
        
    this.state.socket.on("update_console", (data)=>  {
      this.setState({ data: this.state.data.concat(data)}); 
    });
  }

  componentWillUnmount() {
    clearInterval();
  }

  checkExist = (tag, data) => {
    var check = false;
    this.state.check.map((d,i)=>{
      var m = JSON.parse(d);
      if(m['tag'] === tag){
        if(m['address'] === JSON.parse(data['address'])){
          check = true;
        }
      }
    });
    if(check===false)
      this.setState({check:this.state.check.concat(data)})
  };

  filterAddress = (data) => {
    if(JSON.parse(data)['address']==='192.168.0.105')
      return ''
    else
      return JSON.parse(data)['address']
  };

  filterTag = (data) => {
    if(JSON.parse(data)['tag']==="winner")
      return  <p style={{color:"green",fontWeight:"bold"}}>
                WINNER
                <p style={{fontWeight:"bold",color:"black"}}>
                  <div className="text-center" style={{marginLeft:"8%"}}>
                    {JSON.parse(data)['service']}</div>
                </p>
              </p>
    else if(JSON.parse(data)['tag']==="bidding")
      return <p style={{color:"red",fontWeight:"bold"}}>BIDDING</p>
    else if(JSON.parse(data)['tag']==="waiting")
      return <p style={{color:"blue",fontWeight:"bold"}}>WAITING</p>
    else
      return ""
  };

  consoleOutput = (data) => {
    if ((this.filterTag(data)) === ""){
      return
    }
    else {
      return ([
        <h4 style={{fontWeight:"bold",color:"#D73F09"}}>
          {this.filterAddress(data)}
        </h4>,
          this.filterTag(data),
      ])   
    }
  }

  render() {
    return (
      <Well style={{marginTop:"20px"}}>
        <ListGroup>
            <h3 id="Console_h4" className="text-center">
              Console Log
              <Button style={{marginLeft:"5%"}} 
                      onClick={()=>{this.setState({data:[]});}}>
                      Clear
              </Button>
            </h3>
          <div style={{paddingBottom:"10px",paddingTop:"5px"}}>
            {this.state.data.map((data,i) =>{
                if(i >= this.state.console_length){this.setState({data:[]});}
                return (
                  <div className="text-center">
                    <div id="Console_p" style={{textAlign:'left',marginLeft:"12%"}}>
                      <div id="Console_div">
                        {this.consoleOutput(data)}
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
        </ListGroup>
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

