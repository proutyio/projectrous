import React, { Component } from "react";
import socketIOClient from "socket.io-client";
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
  // ControlLabel,
  PageHeader,
  Radio,
  ListGroup,
  ListGroupItem,
  ToggleButtonGroup,
  ToggleButton,
  ButtonToolbar,
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
// var check = false;
// function graph_func(n = 40) {
//   if(check === false){
//     check = true;
//     return .2;
//   }
//   else {
//     check = false;
//     return .1;
//   }
// }

// class SparkGraph extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { data: [] };
//     setInterval(
//       () =>
//         this.setState({
//           data:this.state.data.concat([graph_func()])
//         }),
//       500
//     );
//   }
//   render() {
//     return (
//       <Col xs="2" md="4">
//       <Sparklines data={this.state.data} limit={25}>
//         <SparklinesLine color="#1c8cdc" />
//         <SparklinesSpots/>
//       </Sparklines>
//       </Col>
//     );
//   }
// };



/*#######################################*/
export class TableMain extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242",{'forceNew': true}),
      data:[],
      graphdata:[],
      graph_rowA:[],
      graph_rowB:[],
      graph_rowC:[],
      track_rowA:[],
      track_rowB:[],
      track_rowC:[],
      trust:'',
      check:false,
      row:[1,1,1,1,1,1,1,1,1],
      style_graph:"#1c8cdc",
      style_wait:{color:"blue"},
      style_bid:{color:"red"},
      style_win:{color:"green"},
      style_blue:{color:"blue", borderStyle:"solid",borderColor:"blue",borderWidth:"4px"},
      style_green:{color:"green", borderStyle:"solid",borderColor:"green",borderWidth:"4px"},
      style_red:{color:"red", borderStyle:"solid",borderColor:"red",borderWidth:"4px"},
      just_blue:"blue",
      just_green:"green",
      just_red:"red",
      a0:<td/>,a1:<td/>,a2:<td/>,a3:<td/>,a4:<td/>,a5:<td/>,a6:<td/>,a7:<td/>,a8:<td/>,a9:<td/>,
      b0:<td/>,b1:<td/>,b2:<td/>,b3:<td/>,b4:<td/>,b5:<td/>,b6:<td/>,b7:<td/>,b8:<td/>,b9:<td/>,
      c0:<td/>,c1:<td/>,c2:<td/>,c3:<td/>,c4:<td/>,c5:<td/>,c6:<td/>,c7:<td/>,c8:<td/>,c9:<td/>,
    };
    // setInterval(
    //   () =>
    //     this.setState({
    //       graphdata:this.state.graphdata.concat([graph_func()])
    // }),500);
  
    setInterval(() => {
      this.state.socket.emit("check_wait")
      this.state.socket.emit("check_bid")
      this.state.socket.emit("check_win")
    },500);
    
    setInterval(() => {
      this.state.socket.emit("whois");
    },3000);

    this.state.socket.on("discover_nodes", (nodes)=> {
      this.setState({ data: nodes });
      
      if(this.state.graph_rowA.length===0){
        this.setState({graph_rowA:this.create_arr()});
        this.setState({track_rowA:this.track_arr()});
      }
      if(this.state.graph_rowB.length===0){
        this.setState({graph_rowB:this.create_arr()});
        this.setState({track_rowB:this.track_arr()});
      }
      if(this.state.graph_rowC.length===0){
        this.setState({graph_rowC:this.create_arr()});
        this.setState({track_rowC:this.track_arr()});
      }
    });
    
    this.state.socket.on("update_service", (color) => {
      this.setState({style:color})
    });
    
    //NOTE: this is verbose logic because I tried to use sprintf type functions
    //  with no success, so I went the hardcoded way. its because of
    //  how setState works
    // var track_rows = [1,1,1,1,1,1,1,1,1];
    this.state.socket.on("check_waiting", (nodes) => {
      if(nodes !== 0){
        var IP = JSON.parse(nodes[0]).toString().split(":")[2].replace(/}|"/g,'');
        if(IP==='192.168.0.100'){
          
          var color = "green";
          var check = false;
          this.state.track_rowA[0].map((data,i)=>{
            if(i===8 && data===2 && check===false){
              console.log(this.state.track_rowA[0])
              this.state.graph_rowA[0][0] = <td style={{backgroundColor:"blue"}}/>
              this.state.track_rowA[0][0] = 2
              
              this.state.track_rowA[0].map((r,j) => {
                if(j !== 0){
                  this.state.graph_rowA[0][j] = <td style={{backgroundColor:""}}/>
                  this.state.track_rowA[0][j] = 1
                }
              });
              check = true;
              console.log(this.state.track_rowA[0])
            }
            else if(data===1 && check===false){
              console.log(this.state.track_rowA[0])
              if(i===0){
                this.updateGraph(this.state.graph_rowA[i],this.state.track_rowA[i],i);
                // this.state.graph_rowA[0][0] = <td style={{backgroundColor:"blue"}}/>
                // this.state.track_rowA[0][0] = 2
              
                // this.state.track_rowA[0].map((r,j) => {
                //   if(j !== 0){
                //     this.state.graph_rowA[0][j] = <td style={{backgroundColor:""}}/>
                //   }
                // });
              }
              else if(i===1){
                this.state.graph_rowA[0][1] = <td style={{backgroundColor:"blue"}}/>
                this.state.track_rowA[0].map((r,j) => {
                  if(j!==0&&j!==1)
                    this.state.graph_rowA[0][j] = <td style={{backgroundColor:""}}/>
                });
              }
              else if(i===2){

                this.state.graph_rowA[0][2] = <td style={{backgroundColor:"blue"}}/>
                this.state.track_rowA[0].map((r,j) => {
                  if(j!==0&&j!==1&&j!==2)
                    this.state.graph_rowA[0][j] = <td style={{backgroundColor:""}}/>
                });
              }
              
              check = true;
              this.state.track_rowA[0][i] = 2;
              console.log(this.state.track_rowA[0])
            }



         }); // this.state.graph_rowA[0][3] = <td style={{backgroundColor:"blue"}}/>
        }
       



        // if(JSON.parse(nodes[0]).toString().split(":")[2].replace(/}|"/g,'')==='192.168.0.101')
        //   this.state.graph_rowB[1][3] = <td style={{backgroundColor:"red"}}/>
        
        console.log(nodes)

        this.setState({style_wait:this.state.style_blue});
        this.setState({style_graph:this.state.just_blue});
        this.setState({style_bid:{color:this.state.just_red}});
        this.setState({style_win:{color:this.state.just_green}});
      }
    });
    
    this.state.socket.on("check_bidding", (nodes) => {
      if(nodes !== []){
        // var color = "red"
        // var check = false;
        // track_rows.map((data,i)=>{  
        //   if(i===8 && data===2 && check===false){
        //     this.setState({b0:<td style={{backgroundColor:color}}></td>});
        //     this.setState({b1:<td style={{backgroundColor:""}}></td>})
        //     this.setState({b2:<td style={{backgroundColor:""}}></td>})
        //     this.setState({b3:<td style={{backgroundColor:""}}></td>})
        //     this.setState({b4:<td style={{backgroundColor:""}}></td>})
        //     this.setState({b5:<td style={{backgroundColor:""}}></td>})
        //     this.setState({b6:<td style={{backgroundColor:""}}></td>})
        //     this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //     this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     check = true;
        //     track_rows = [2,1,1,1,1,1,1,1,1]
        //   }
        //   else if(data===1 && check===false){
        //     if(i===0){
        //       this.setState({b0:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b1:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b2:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b3:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b4:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b5:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b6:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===1){
        //       this.setState({b1:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b2:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b3:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b4:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b5:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b6:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===2){
        //       this.setState({b2:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b3:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b4:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b5:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b6:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===3){
        //       this.setState({b3:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b4:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b5:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b6:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===4){
        //       this.setState({b4:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b5:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b6:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===5){
        //       this.setState({b5:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b6:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===6){
        //       this.setState({b6:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b7:<td style={{backgroundColor:""}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===7){
        //       this.setState({b7:<td style={{backgroundColor:color}}></td>})
        //       this.setState({b8:<td style={{backgroundColor:""}}></td>})
        //     }
        //     else if(i===8){
        //       this.setState({b8:<td style={{backgroundColor:color}}></td>})
        //     }
        //     check = true;
        //     track_rows[i] = 2;
        //   }
        // });
        this.setState({style_wait:{color:this.state.just_blue}});
        this.setState({style_bid:this.state.style_red});
        this.setState({style_graph:this.state.just_red});
        this.setState({style_win:{color:this.state.just_green}});
      }
    });
    
    this.state.socket.on("check_winning", (nodes) => {
      if(nodes !== []){
        
        this.setState({check:false});
        this.setState({style_wait:{color:this.state.just_blue}});
        this.setState({style_bid:{color:this.state.just_red}});
        this.setState({style_win:this.state.style_green});
        this.setState({style_graph:this.state.just_green});
      }
    });
  }

  componentWillUnmount() {
    clearInterval();
  }

  updateGraph = (data,track,x) => {
    data[x] = <td style={{backgroundColor:"blue"}}/>
    track[x] = 2
    data.map((r,j) => {
      if(j > x){
        data[j] = <td style={{backgroundColor:""}}/>
      }
    });

  }
  // parseIP = (nodes) => {
  //   var lst = new Array(nodes.length*2);
  //   console.log(lst.length)
  //   console.log(nodes)
    
  //   nodes.map((n,i)=>{
  //     if(lst.length===0)
  //       lst[i] = JSON.parse(n).toString().split(":")[2].replace(/}|"/g,'');
  //     else{
  //       var ip = JSON.parse(n).toString().split(":")[2].replace(/}|"/g,'');
  //       var check = false;
  //       lst.map((l,j)=>{
  //         if(l === ip)
  //           check = true;
  //           console.log(l)
  //           console.log(ip) 
  //       });
  //       if(check === false)
  //         lst[i] = ip
  //     }

  //     // console.log(n);
  //     // var waitdata = JSON.parse(n);
  //     // waitdata = waitdata.toString().split(":")[2].replace(/}|"/g,'');
  //     // console.log(waitdata);
  //   });
  //   console.log(lst);
  // }

  removeTrust = (e) => {
    e.preventDefault();
    console.log(this.state.trust);
    var t = this.state.trust;
    this.state.socket.emit("trust", t);
  }

  nodeSize = (e) => {
    return this.state.data.length;
  }

  changeTrust = (e) => {
    this.setState({trust: e.currentTarget.value});
  }

  create_arr = (e) => {
    var arr = new Array(this.state.data.length);
    this.state.data.map((data,i)=>{
      arr[i] = [<td/>,<td/>,<td/>,<td/>,<td/>,<td/>,<td/>,<td/>,<td/>];
    });
    return arr;
  }

  track_arr = (e) => {
    var arr = new Array(this.state.data.length);
    this.state.data.map((data,i)=>{
      arr[i] = [1,1,1,1,1,1,1,1,1];
    });
    return arr;
  }

  render() {
    this.state.graphdata
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
                var parsed_data = JSON.parse(data);                
                return (
                  <tr key={i}>
                    <td style={{verticalAlign:"middle",
                                fontSize:"20px",fontWeight:"bold"}}>{i+1}
                    </td>
                    <td style={{verticalAlign:"middle",
                                marginTop:"20px",
                                color:"#D73F09",
                                fontSize:"26px"}}>{parsed_data['address']}
                    </td>
                    
                    <td style={{verticalAlign:"middle"}}>                  
                      {JSON.parse(parsed_data['services']).map((data,j) => {
                        return (
                          <div id="service" key={j}>{data['service']}</div>
                        );
                      })}
                    </td>

                    <td style={{verticalAlign:"middle"}}>
                      <p style={this.state.style_wait}>WAITING</p>
                      <p style={this.state.style_bid}>BIDDING</p>
                      <p style={this.state.style_win}>SERVICE</p>
                    </td>
                   
                    <td style={{verticalAlign:"middle"}}>
                      <Table id="GraphTable" striped bordered condensed hover>
                        
                        <thead>

                          {this.state.row.map(()=>{
                            return ( <th style={{borderTop:"1px solid #f5f5f5",
                                  borderLeft:"1px solid #f5f5f5",
                                  borderRight:"1px solid #f5f5f5",
                                  backgroundColor:"#f5f5f5",
                                  padding:"20px"}}></th>);
                            })
                          }
                        </thead>
                        
                        <tbody>
                          <tr>
                            {this.state.graph_rowA[i]}
                            {/*{this.state.a0}{this.state.a1}{this.state.a2}
                            {this.state.a3}{this.state.a4}{this.state.a5}
                            {this.state.a6}{this.state.a7}{this.state.a8}*/}
                          </tr>
                          <tr>
                            {this.state.graph_rowB[i]}
                            {/*this.state.b0}{this.state.b1}{this.state.b2}
                            {this.state.b3}{this.state.b4}{this.state.b5}
                            {this.state.b6}{this.state.b7}{this.state.b8*/}
                          </tr>
                          <tr>
                            {this.state.c0}{this.state.c1}{this.state.c2}
                            {this.state.c3}{this.state.c4}{this.state.c5}
                            {this.state.c6}{this.state.c7}{this.state.c8}
                          </tr>
                        </tbody>
                      </Table>;
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
            <h3 className="text-center">Manage Trust</h3>
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
                <Col smOffset={4} sm={10}>
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
      g_on:'{"tag":"service","service":"green_on"}',
      g_off: '{"tag":"service","service":"green_off"}',
      r_on: '{"tag":"service","service":"red_on"}',
      r_off: '{"tag":"service","service":"red_off"}',
      b_on: '{"tag":"service","service":"blue_on"}',
      b_off: '{"tag":"service","service":"blue_off"}',
      print: '{"tag":"service","service":"print_file"}',
      // print: '{"tag":"service","service":"print_file","file":"' + this.fileInput + '"}',
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

  // fileInput = (e) => {
  //   var file = document.getElementById('theFile').theFile[0];
  //    if (file) {
  //      var reader = new FileReader();
  //      reader.readAsText(file);
  //      return reader;
  //    }
  // }
  //
  //here is the string sent to the nodes:
  /*
    {"tag":"service","service":"print_file","file":"function (e) {
      var file = document.getElementById('theFile').theFile[0];
      if (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        return reader;
      }
    }"}
  */
  render() {
    return (
      <Well className="FormSend">
        <Form horizontal onSubmit={this.send}>
         {/* <FormGroup controlId="">
            <Col componentClass={ControlLabel} sm={9}>
              <p>Send a message into the node network. {str}</p>
            </Col>
            <Col sm={12}>
              <FormControl type="text" 
                 className="form-control" 
                 value={this.state.message} 
                 onChange={this.messageChange}/>
            </Col>
          </FormGroup>*/}
        <h3 className="text-center">Select Service</h3>
        <ButtonToolbar>
          <ToggleButtonGroup type="radio" name="options" defaultValue={0} vertical block>
            <ToggleButton style={{padding:"15px",color:"green"}}
                          value={this.state.g_on} onChange={this.messageChange}>
                          Green ON</ToggleButton>
            <ToggleButton style={{padding:"15px",color:"green"}}
                          value={this.state.g_off} onChange={this.messageChange}>
                          Green OFF</ToggleButton>
            <ToggleButton style={{padding:"15px",color:"red"}}
                          value={this.state.r_on} onChange={this.messageChange}>
                          Red ON</ToggleButton>
            <ToggleButton style={{padding:"15px",color:"red"}}
                          value={this.state.r_off} onChange={this.messageChange}>
                          Red OFF</ToggleButton>
            <ToggleButton style={{padding:"15px",color:"blue"}}
                          value={this.state.b_on} onChange={this.messageChange}>
                          Blue ON</ToggleButton>
            <ToggleButton style={{padding:"15px",color:"blue"}}
                          value={this.state.b_off} onChange={this.messageChange}>
                          Blue OFF</ToggleButton>
            <ToggleButton style={{padding:"15px"}}
                          value={this.state.print} type="text" onChange={this.messageChange} >
                          Print File {/*<input type="file" id="theFile" name="theFile" />*/}
            </ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
   
         <FormGroup className="text-center" style={{marginTop:"10px"}}>
            <Col>
              <Button style={{backgroundColor:"#D73F09",color:"#FFFFFF"}} 
                      type="submit">send to node network</Button>
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
    },1000);
    
    this.state.socket.on("update_console", (data)=> 
      this.setState({ data: this.state.data.concat(data) }));
  }

  componentWillUnmount() {
    clearInterval();
  }

  filter_address = (data) => {
    if(JSON.parse(data)['address']==='192.168.0.105')
      return ''
    else
      return JSON.parse(data)['address']

  }

  filter_tag = (data) => {
    if(JSON.parse(data)['tag']==="winner")
      return <p style={{color:"green",fontWeight:"bold"}}>WINNER</p> 
    else if(JSON.parse(data)['tag']==="bidding")
      return <p style={{color:"red",fontWeight:"bold"}}>BIDDING</p>
    else if(JSON.parse(data)['tag']==="waiting")
      return <p style={{color:"blue",fontWeight:"bold"}}>WAITING</p>
    else if (JSON.parse(data)['tag']==="timer")
      return ""
    else
      return ""
  }

  render() {
    return (
      <Well>
      <ListGroup >
        <h3 id="Console_h4" className="text-center">
          Console Log
        </h3>
        <div style={{paddingBottom:"100px"}}>
          {this.state.data.map((data,i) =>{
              if(i >=100){
                this.setState({data:[]});
              }
              return (
                <ListGroupItem bsStyle="warning" id="Console_p" className="text-center">
                  <h4 style={{fontWeight:"bold",color:"#D73F09"}}>
                    {this.filter_address(data)}
                  </h4>
                  <div>
                       {this.filter_tag(data)}
                       {JSON.parse(data)['message']?<p>{JSON.parse(data)['message']}</p>:''}
                  </div>
                </ListGroupItem>
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

