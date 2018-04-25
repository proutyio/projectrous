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
  Row,
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
      track_row:[],
      track_rowB:[],
      track_rowC:[],
      style_A:[],
      trust:'',
      check:false,
      row:[1,1,1,1,1,1,1,1,1],
      // style_graph:"#1c8cdc",
      style_wait:{color:"blue"},
      style_bid:{color:"red"},
      style_win:{color:"#ff1493"},
      style_blue:{color:"blue", borderStyle:"solid",borderColor:"blue",borderWidth:"4px"},
      style_green:{color:"#ff1493", borderStyle:"solid",borderColor:"#ff1493",borderWidth:"4px"},
      style_red:{color:"red", borderStyle:"solid",borderColor:"red",borderWidth:"4px"},
      just_blue:"blue",
      just_green:"#ff1493",
      just_red:"red",
      IP:['192.168.0.101','192.168.0.102'],
    };

    setInterval(() => {
      this.state.socket.emit("check_wait")
      this.state.socket.emit("check_bid")
      this.state.socket.emit("check_win")
    },5);
    
    setInterval(() => {
      this.state.socket.emit("whois");
    },3000);

    this.state.socket.on("discover_nodes", (nodes)=> {
      this.setState({ data: nodes });
      
      if(this.state.graph_rowA.length===0){
        this.setState({graph_rowA:this.createArr()});
        this.setState({track_row:this.trackArr()});
      }
      if(this.state.graph_rowB.length===0){
        this.setState({graph_rowB:this.createArr()});
        // this.setState({track_rowB:this.trackArr()});
      }
      if(this.state.graph_rowC.length===0){
        this.setState({graph_rowC:this.createArr()});
        // this.setState({track_rowC:this.trackArr()});
      }
      if(this.state.style_A.length===0){
        this.setState({style_A:this.styleArr("#ff1493")});
      }
    });
    
    this.state.socket.on("update_service", (color) => {
      this.setState({style:color})
    });
    
    this.state.socket.on("check_waiting", (nodes) => {
      if(nodes !== 0){
        var color = "blue"
        var IP = JSON.parse(nodes[0]).toString().split(":")[2].replace(/}|"/g,'');
        
        if(IP===this.state.IP[0]){
          this.graphLogic(this.state.graph_rowA[0],0,this.state.track_row[0],color)
        }
        
        if(IP===this.state.IP[1]){
          this.graphLogic(this.state.graph_rowA[1],1,this.state.track_row[1],color)
        }

        // this.setState({style_wait:this.state.style_blue});
        // this.setState({style_bid:{color:this.state.just_red}});
        // this.setState({style_win:{color:this.state.just_green}});
      }
    });
    
    this.state.socket.on("check_bidding", (nodes) => {
      if(nodes !== []){
        var color = "red"
        var IP = JSON.parse(nodes[0]).toString().split(":")[2].replace(/}|"/g,'');

        if(IP===this.state.IP[0]){
          this.graphLogic(this.state.graph_rowB[0],0,this.state.track_row[0],color)
        }
        
        if(IP===this.state.IP[1]){
          this.graphLogic(this.state.graph_rowB[1],1,this.state.track_row[1],color)
        }

        // this.setState({style_wait:{color:this.state.just_blue}});
        // this.setState({style_bid:this.state.style_red});
        // this.setState({style_win:{color:this.state.just_green}});
      }
    });
    
    this.state.socket.on("check_winning", (nodes) => {
      if(nodes !== []){
        var color = "#ff1493"
        var IP = JSON.parse(nodes[0]).toString().split(":")[2].replace(/}|"/g,'');
        
        if(IP===this.state.IP[0]){
          this.graphLogic(this.state.graph_rowC[0],0,this.state.track_row[0],color)
        }
        
        if(IP===this.state.IP[1]){
          this.graphLogic(this.state.graph_rowC[1],1,this.state.track_row[1],color)
        }

        // this.setState({check:false});
        // this.setState({style_wait:{color:this.state.just_blue}});
        // this.setState({style_bid:{color:this.state.just_red}});
        // this.setState({style_win:this.state.style_green});
      }
    });
  }

  componentWillUnmount() {
    clearInterval();
  }

  //I need to explain this logic. I will forget, its complicated
  updateGraph = (data,track,i,color) => {
    data[i] = <td style={{backgroundColor:color}}/>
    track[i] = 2
    console.log(track);
    data.map((r,j) => {
      if(j > i){
        data[j] = <td style={{backgroundColor:""}}/>
      }
    });
  }

  graphLogic = (graph,x,track,color) => {
    try{
      var check = false;
      track.map((data,i)=>{
        if(i===8 && data===2 && check===false){
          graph[i] = <td style={{backgroundColor:color}}/>
          track.map((r,j) => {
            if(j !== 0){
              graph[j] = <td style={{backgroundColor:""}}/>
              track[j] = 1
            }
          });
          check = true;
        }
        else if(data===1 && check===false){
          this.updateGraph(graph,track,i,color);     
          check = true;
          track[i] = 2;
        }
     });
    }finally{}
  }

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

  createArr = (e) => {
    // var arr = new Array(this.state.data.length);
    var arr = new Array(100); //bug with getting length so hardcoded for now
    this.state.data.map((data,i)=>{
      arr[i] = [<td/>,<td/>,<td/>,<td/>,<td/>,<td/>,<td/>,<td/>,<td/>];
    });
    return arr;
  }

  trackArr = (e) => {
    // var arr = new Array(this.state.data.length);
    var arr = new Array(100);
    this.state.data.map((data,i)=>{
      arr[i] = [1,1,1,1,1,1,1,1,1];
    });
    return arr;
  }

  styleArr = (color) => {
    // var arr = new Array(this.state.data.length);
    var arr = new Array(100);
    this.state.data.map((data,i)=>{
      arr[i] = {color:color};
    });
    return arr;
  }

  render() {
    return (
      <div>

      <Col xs={2} md={2}>
        <ConsoleLog/>
      </Col>

      <Col xs={7} md={7}>
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
                      <p style={this.state.style_A[i]}>SERVICE</p>
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
                          <tr>{this.state.graph_rowA[i]}</tr>
                          <tr>{this.state.graph_rowB[i]}</tr>
                          <tr>{this.state.graph_rowC[i]}</tr>
                        </tbody>
                      </Table>
                    </td>
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
            <h4 className="text-center">
              Manage Trust
            </h4>
            <Form horizontal onSubmit={this.removeTrust}>
              <FormGroup style={{marginLeft:"20%"}}>
                <div> 
                    <Radio name="radioGroup"
                           value="0"
                           onChange={this.changeTrust}>
                      Reset
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
                        {d['address']}
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
            </Form> 
          </Well>
        </Col>

      </div>
    );
  }
}

var fileSocket = socketIOClient('http://127.0.0.1:4242');
var uploader = new SocketIOFileClient(fileSocket);

uploader.on('ready', function() {
	console.log('SocketIOFile ready to go!');
});
uploader.on('loadstart', function() {
	console.log('Loading file to browser before sending...');
});
uploader.on('progress', function(progress) {
	console.log('Loaded ' + progress.loaded + ' / ' + progress.total);
});
uploader.on('start', (fileInfo) => {
	console.log('Start uploading', fileInfo);
});
uploader.on('stream', (fileInfo) => {
	console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});
uploader.on('complete', (fileInfo) => {
	console.log('Upload Complete', fileInfo);
});
uploader.on('error', (err) => {
	console.log('Error!', err);
});
uploader.on('abort', (fileInfo) => {
	console.log('Aborted: ', fileInfo);
});


/*#######################################*/
class FormSend extends Component {
  constructor() {
    super();
    this.state = { 
      socket:socketIOClient("http://127.0.0.1:4242"),
      message: '',
      file_contents: "no content",
      g_on:'{"tag":"service","service":"green_on"}',
      g_off: '{"tag":"service","service":"green_off"}',
      r_on: '{"tag":"service","service":"red_on"}',
      r_off: '{"tag":"service","service":"red_off"}',
      b_on: '{"tag":"service","service":"blue_on"}',
      b_off: '{"tag":"service","service":"blue_off"}',
      //print: '{"tag":"service","service":"print_file"}',
      print: '{"tag":"service","service":"print_file","file":"' + this.file_contents + '"}',
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


  
  handleChange = (e) => {
    
    var contents = document.getElementById("myFile").value;
    this.setState({file_contents: contents})
    
    this.setState({message: e.target.value});
  };
    
  // handleFileUpload({ file }) {
  //   const file = files[0];
  //   this.props.actions.uploadRequest({
  //      file,
  //      name: 'Awesome Cat Pic'
  //   })
  // }
  fileInput = (e) => {

    
    if (document.getElementById("myFile").value) {
      var file = document.getElementById("myFile").value;
      var reader = new FileReader();
      reader.readAsText(file);
       return reader;
    }
    else{
       return e;
    }
  }
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
      <Well className="FormSend" style={{marginTop:"20px",padding:"5px"}}>
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
        <h4 className="text-center" style={{marginTop:"20px"}}>Select Service</h4>
        <ButtonToolbar className="text-center">
          <ToggleButtonGroup type="radio" name="options" defaultValue={0} vertical>
            <ToggleButton style={{padding:"5px 100px 5px 100px",color:"green"}}
                          value={this.state.g_on} onChange={this.messageChange}>
                          Green ON</ToggleButton>
            <ToggleButton style={{padding:"5px",color:"green"}}
                          value={this.state.g_off} onChange={this.messageChange}>
                          Green OFF</ToggleButton>
            <ToggleButton style={{padding:"5px",color:"red"}}
                          value={this.state.r_on} onChange={this.messageChange}>
                          Red ON</ToggleButton>
            <ToggleButton style={{padding:"5px",color:"red"}}
                          value={this.state.r_off} onChange={this.messageChange}>
                          Red OFF</ToggleButton>
            <ToggleButton style={{padding:"5px",color:"blue"}}
                          value={this.state.b_on} onChange={this.messageChange}>
                          Blue ON</ToggleButton>
            <ToggleButton style={{padding:"5px",color:"blue"}}
                          value={this.state.b_off} onChange={this.messageChange}>
                          Blue OFF</ToggleButton>
            <ToggleButton style={{padding:"5px"}}
                          value={this.state.print} onChange={this.handleChange} >
                          <div> Print File
                            <input type="file" id="myFile" />
                          </div>
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
      <Well style={{marginTop:"20px"}}>
      <ListGroup>
        <h4 id="Console_h4" className="text-center">
          Console Log
        </h4>
        <div style={{paddingBottom:"100px"}}>
          {this.state.data.map((data,i) =>{
              if(i >=200){
                this.setState({data:[]});
              }
              return (
                <div className="text-center">
                  <div id="Console_p" style={{textAlign:'left',marginLeft:"12%"}}>
                    <div id="Console_div">
                    <h4 style={{fontWeight:"bold",color:"#D73F09"}}>
                      {this.filter_address(data)}
                    </h4>
                    {this.filter_tag(data)}
                    {JSON.parse(data)['message']?<p>{JSON.parse(data)['message']}</p>:''}
                    
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

