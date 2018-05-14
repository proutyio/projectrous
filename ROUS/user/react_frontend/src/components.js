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
  ButtonToolbar,
  Modal,
} from "react-bootstrap";


/*#######################################*/
export const NavBarTop = (
  <Navbar className="fixedTop" fixedTop id="NavBarTop">
    <Navbar.Header>
      <Navbar.Brand>
        <div>
          <p style={{float:"left"}}><img src="/static/favicon.ico" weign="30" height="40"/></p>
          <p style={{float:"right"}}><a href="" 
             style={{color:"#FFFFFF",marginLeft:"5px"}}>
             Project ROUS
          </a></p>
        </div>
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

function findColor(x){
  switch(x){
    case 1: return "#D73F09"; break;
    case 2: return "#8A2BE2"; break;
    case 3: return "#FF00FF"; break;
    case 4: return "maroon"; break;
    case 5: return "#2F4F4F"; break;
    case 6: return "#DAA520";break;
    case 7: return "#3CB371"; break;
    case 9: return "#696969";break;
    case 8: return "#191970"; break;
    default: return "black";
  }
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
      row:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //graph block rows, gets size from
      row_A:[],
      row_B:[],
      row_C:[],
      row_D:[],
      track:[],
      time_value:0,
      time_color:"black",
      IP:["192.168.0.101","192.168.0.102","192.168.0.103","192.168.0.106"],  
    };
    
    setInterval(() => {
      this.state.socket.emit("whois");
    },3000);

    this.state.socket.on("discover_nodes", (nodes)=> {
      this.setState({ data: nodes });
      if(this.state.row_A.length===0){
        this.setState({row_A:this.createArr(0,0)});
        this.setState({track:this.trackArr()});
      }
      if(this.state.row_B.length===0)
        this.setState({row_B:this.createArr(1,0)});
      if(this.state.row_C.length===0)
        this.setState({row_C:this.createArr(2,0)});
      if(this.state.row_D.length===0)
        this.setState({row_D:this.createArr(3,1)});
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

    this.state.socket.on("clearall", () =>{
      this.clearAll();
    });

    this.state.socket.on("updatetime", () =>{
      this.state.time_value = (this.state.time_value+1);
    });
  }

  componentWillUnmount() {
    clearInterval();
  }

  removeTrust = (e) => {
    e.preventDefault();
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
        if(i===this.state.row.length-1 && data===1 && check===false){
          graph[i] = <td style={{backgroundColor:color,padding:"32px 14px 0px 14px"}}/>;
          this.state.row_D[x][i] = 
                <td style={{backgroundColor:findColor(this.state.time_value),padding:"6px"}}/>;
          track[i] = 2;
        }
        else if(i===this.state.row.length-1 && data===2 && check===false){
          this.clearGraph(track,x);
          var firstrow = ((i)-this.state.row.length);
          graph[firstrow] = <td style={{backgroundColor:color,padding:"32px 14px 0px 14px"}}/>;
          this.state.row_D[x][firstrow] = 
                <td style={{backgroundColor:findColor(this.state.time_value),padding:"6px"}}/>;
          track[firstrow] = 2;
          check = true;
        }
        else if(data===1 && check===false){
          this.updateGraph(graph,x,track,i,color);     
          check = true;
          track[i] = 2;
        }
     });
    }finally{}
  };

  updateGraph = (data,x,track,i,color) => {
    data[i] = <td style={{backgroundColor:color,padding:"32px 14px 0px 14px"}}/>;
    this.state.row_D[x][i] = 
          <td style={{backgroundColor:findColor(this.state.time_value),padding:"6px"}}/>;
    data.map((r,j) => {
      if(j > i){
        data[j] = <td style={{backgroundColor:"",padding:"32px 14px 0px 14px"}}/>;
        this.state.row_D[x][j] = <td style={{backgroundColor:"",padding:"6px"}}/>;
      }
    });
  };

  // updateRowD = (data,track,i,color) => {
  //   data[i] = <td style={{backgroundColor:color,padding:"6px"}}/>;
  //   data.map((r,j) => {
  //     if(j > i)
  //       data[j] = <td style={{backgroundColor:"",padding:"6px"}}/>;
  //   });
  // };

  // updateTime = (data,x,track,color) => {
  //   var check = false;
  //   track.map((d,i)=>{
  //     if(i===this.state.row.length-1 && d===1 && check===false){
  //       data[i] = <td style={{backgroundColor:color,padding:"6px"}}/>;
  //       check = true;
  //     }
  //     else if(i===this.state.row.length-1 && d===2 && check===false){
  //       var firstrow = ((i+1)-this.state.row.length);
  //       data[firstrow] = <td style={{backgroundColor:color,padding:"6px"}}/>;
  //       check = true;
  //     }
  //     else if(i===0 && d===1 && check===false){
  //       this.updateRowD(data,track,i,color);
  //       check = true;
  //     }
  //     else if(i===this.state.row.length-1 && d===1 && check===false){
  //       this.updateRowD(data,track,i,color);
  //       check = true;
  //     }
  //     else if(d===1 && check===false){
  //       this.updateRowD(data,track,(i-1),color);
  //       check = true;
  //     }
  //   });
  // };

  clearGraph = (track, x) => {
    this.state.track[x].map((t,i)=>{
      this.state.row_A[x][i] = <td style={{backgroundColor:"",padding:"32px 14px 0px 14px"}}/>
      this.state.row_B[x][i] = <td style={{backgroundColor:"",padding:"32px 0px 0px 0px"}}/>
      this.state.row_C[x][i] = <td style={{backgroundColor:"",padding:"32px 0px 0px 0px"}}/>
      this.state.row_D[x][i] = <td style={{backgroundColor:"",padding:"6px"}}/>
      track[i] = 1
    });
    this.setState({time_value:0});
  };

  clearAll = () => {
    this.state.IP.map((d,i)=>{
      this.state.row.map((e,j)=>{
        this.state.row_A[i][j] = <td style={{backgroundColor:"",padding:"32px 14px 0px 14px"}}/>
        this.state.row_B[i][j] = <td style={{backgroundColor:"",padding:"32px 0px 0px 0px"}}/>
        this.state.row_C[i][j] = <td style={{backgroundColor:"",padding:"32px 0px 0px 0px"}}/>
        this.state.row_D[i][j] = <td style={{backgroundColor:"",padding:"6px"}}/>
        this.state.track[i][j] = 1
      });
    });
    this.setState({time_value:0});
  };

  createRows = (x,t) =>{
    var r = []
    switch(x){
      case 0: r[0]=<p style={{border:"none"}}>Win</p>;break;
      case 1: r[0]=<p>Bid</p>;break;
      case 2: r[0]=<p>Wait</p>;break;
      case 3: r[0]=<p>Time</p>;break;
    }
    if(t === 0)
      this.state.row.map((data,i)=>{r[i] = <td style={{padding:"32px 14px 0px 14px"}}></td>});
    else
      this.state.row.map((data,i)=>{r[i] = <td style={{padding:"6px"}}></td>});
    return r;
  };

  createArr = (x,t) => {
    var arr = new Array(100); //bug with getting length so hardcoded for now
    this.state.data.map((data,i)=>{
      arr[i] = this.createRows(x,t);
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

      <Col xs={2} md={2}>
        <ConsoleLog/>
      </Col>

      <Col xs={8} md={8}>
        <Well className="TableMain">
          <Table>
            <thead>
              <tr className="text-center">
                
                <th>Node</th>
                <th>Address</th>
                <th>Graph
                    <Button style={{marginLeft:"5%"}} 
                      onClick={()=>{this.clearAll()}}>
                      Clear Graph
                    </Button>
                </th>
                <th>Services</th>
                
              </tr>
            </thead>
            
            <tbody>
              {this.state.data.map((data,i) =>{
                var parsed_data = JSON.parse(data);                
                return (
                  <tr key={i}>
                    
                    <td style={{verticalAlign:"middle",
                                fontSize:"20px",fontWeight:"bold"}}>{i+1}
                    </td>
                    <td style={{verticalAlign:"middle",
                                marginTop:"0px",
                                color:"#D73F09",
                                fontSize:"24px"}}>{parsed_data['address']}
                    </td>
          
                    <td style={{verticalAlign:"middle",paddingLeft:"2%",paddingRight:"2%"}}>
                      <Table id="GraphTable" striped bordered condensed hover>
                        <thead>
                          {this.state.row.map(()=>{
                            return ( <th style={{borderTop:"1px solid #f5f5f5",
                                  borderLeft:"1px solid #f5f5f5",
                                  borderRight:"1px solid #f5f5f5",
                                  backgroundColor:"#f5f5f5",
                                  paddingTop:"25px"}}></th>);
                            })
                          }
                        </thead>
                        <tbody>
                          <tr id="rowA">{this.state.row_A[i]}</tr>
                          <tr id="rowB">{this.state.row_B[i]}</tr>
                          <tr id="rowC">{this.state.row_C[i]}</tr>
                          <tr style={{padding:"100px"}}>{this.state.row_D[i]}</tr>
                        </tbody>
                      </Table>
                    </td>

                    <td style={{verticalAlign:"middle"}}>   
                      {JSON.parse(parsed_data['services']).map((data,j) => {
                        return (
                          <p id="service" key={j}>
                            {removeAndCapitalize(data['service'])}
                          </p>
                        );
                      })}
                    </td>
                    
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Well>
        </Col>

        <Col xs={2} md={2}>
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
                <Button style={{backgroundColor:"#D73F09",color:"#FFFFFF",
                                padding:"10px 35px 10px 20px",
                                marginLeft:"2%"}} 
                        type="submit"><h4><b>REMOVE</b> Node Trust</h4>
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
      p_on: '{"tag":"service","service":"pink_on"}',
      y_on: '{"tag":"service","service":"yellow_on"}',
      w_on: '{"tag":"service","service":"white_on"}',
      rbg_on: '{"tag":"service","service":"red_blue_green"}',
      wpy_on: '{"tag":"service","service":"white_pink_yellow"}',
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
      <Well className="FormSend" style={{marginTop:"0px",padding:"5px"}}>
        <Form horizontal onSubmit={this.send}>
          <h3 className="text-center" style={{marginTop:"20px"}}>Select Service</h3>
          <ButtonToolbar className="text-center" style={{margin:"15px",marginBottom:"15px"}}>
            <ToggleButtonGroup type="radio" name="options" defaultValue={0} vertical>
              <ToggleButton style={{padding:"30px 50px 30px 50px",fontWeight:"bold",
                                    marginBottom:"3%"}} 
                            onChange={this.handleShow}>
                            Complex Job</ToggleButton>
              </ToggleButtonGroup>
          </ButtonToolbar>

          <ButtonToolbar className="text-center" 
                         style={{margin:"10px",marginBottom:"15px",marginLeft:"2%"}}>
            <ToggleButtonGroup type="radio" name="options" 
                               defaultValue={0}
                               vertical-block>
              <ToggleButton style={{color:""}}
                            className="btn btn-default"
                            id="TabButtons"
                            value={this.state.g_on} onChange={this.messageChange}>
                            <p>Green ON</p>
              </ToggleButton>
              <ToggleButton style={{color:""}}
                            className="btn btn-default"
                            id="TabButtons"
                            value={this.state.r_on} onChange={this.messageChange}>
                            <p>Red ON</p>
              </ToggleButton>
              <ToggleButton style={{color:""}}
                            className="btn btn-default"
                            id="TabButtons"
                            value={this.state.b_on} onChange={this.messageChange}>
                            <p>Blue ON</p>
              </ToggleButton>
              <ToggleButton style={{color:""}}
                            className="btn btn-default"
                            id="TabButtons" 
                            value={this.state.p_on} onChange={this.messageChange}>
                            <p>Pink ON</p>
              </ToggleButton>
              <ToggleButton style={{color:""}}
                            className="btn btn-default"
                            id="TabButtons"
                            value={this.state.y_on} onChange={this.messageChange}>
                            <p>Yellow ON</p>
              </ToggleButton>
              <ToggleButton style={{color:""}}
                            className="btn btn-default"
                            id="TabButtons"
                            value={this.state.w_on} onChange={this.messageChange}>
                            <p>White ON</p>
              </ToggleButton>

              <ToggleButton style={{width:"85%",marginTop:"1%",marginLeft:"0%",
                                    fontSize:"12px"}}
                            onChange={this.messageChange}
                            value={this.state.print_bw}>
                            <p>Print (Black&White)</p>
                            <input type="file" 
                                   style={{marginLeft:"1%"}}
                                   onChange={(e)=>this.handleChange(e.target.files)}/>
                            </ToggleButton>
              <ToggleButton style={{width:"85%", marginLeft:"0%",marginTop:"1px",
                                    fontSize:"12px"}}
                            onChange={this.messageChange}
                            value={this.state.print_color}>
                            <p>Print (Color)</p>
                            <input type="file"
                                   style={{marginLeft:"1%"}} 
                                   onChange={(e)=>this.handleChange(e.target.files)}/>
                            </ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
          
          <FormGroup className="text-center" style={{marginTop:"25px",marginLeft:"0px"}}>
            <Col>
              <Button style={{backgroundColor:"#D73F09",color:"#FFFFFF",
                              padding:"10px 20px 10px 20px",
                              marginRight:"12px"}}
                      className="btn btn-default" 
                      type="submit"><h4><b>SEND</b> to Node Network</h4></Button>
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
                  <h4 style={{marginBottom:"20px"}}>Select Services</h4>
                  <ToggleButtonGroup type="checkbox" 
                                    onChange={this.complexChange}
                                    vertical-block
                                    style={{marginBottom:"15px",marginLeft:"8%"}}>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  value={this.state.g_on}>
                                  <p>Green ON</p>
                    </ToggleButton>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  value={this.state.r_on}>
                                  <p>Red ON</p>
                    </ToggleButton>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  value={this.state.b_on}>
                                  <p>Blue ON</p>
                    </ToggleButton>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  value={this.state.p_on}>
                                  <p>Pink ON</p>
                    </ToggleButton>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  value={this.state.y_on}>
                                  <p>Yellow ON</p>
                    </ToggleButton>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  value={this.state.w_on}>
                                  <p>White ON</p>
                    </ToggleButton>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  // disabled
                                  value={this.state.rbg_on}>
                                  <p>RBG ON</p>
                    </ToggleButton>
                    <ToggleButton style={{color:""}}
                                  className="btn btn-default"
                                  id="TabButtons_c"
                                  value={this.state.wpy_on}>
                                  <p>WPY ON</p>
                    </ToggleButton>
                    <ToggleButton style={{padding:"18px",marginTop:"5%",
                                          marginLeft:"18%"}}
                                  value={this.state.print_bw}>
                                  <p>Print (Black and White)</p>
                                  <input type="file" id="myFile" 
                                    multiple="multiple"
                                    onChange={(e)=>this.handleChange(e.target.files)}
                                    style={{marginLeft:"10%"}} />
                    </ToggleButton>
                    <ToggleButton style={{padding:"18px",marginLeft:"18%"}}
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
                              type="submit"><h4><b>SEND</b> to Node Network</h4>
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
      console_length: 100,
      time_value:0,
    };
        
    this.state.socket.on("update_console", (data)=>  {
      this.setState({ data: this.state.data.concat(data)}); 
    });

    this.state.socket.on("clearall", () =>{
      this.setState({ data:[]});
    });

     this.state.socket.on("updatetime", () =>{
      this.setState({time_value:this.state.time_value+1});
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
    if(JSON.parse(data)['address']==='192.168.0.106')
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
      <Well style={{marginTop:"0px"}}>
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

