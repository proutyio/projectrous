import React, { Component } from 'react';
import beaver1 from './beaver1.svg';
import './App.css';
export
class Button extends React.Component {
    render() {
      
      return (
       <button text="Turn on LED's"/>
       
      );
    }
  }

class print{


}
export
class Dropdown extends React.Component{
    render(){
        return(
            
            <select>
                <option value={this.props.option1}>{this.props.option1}</option>
                <option value={this.props.option2}>{this.props.option2}</option>
                <option value={this.props.option3}>{this.props.option3}</option>
                <option value={this.props.option4}>{this.props.option4}</option>
                <option value={this.props.option5}>{this.props.option5}</option>
                <option value={this.props.option6}>{this.props.option6}</option>
            </select>
        );

    }

}
Dropdown.defaultProps={
    default_selected :'blue',
    option1 :'red',
    option2 :'green',
    option3 :'pink',
    option4 :'white',
    option5 :'yellow',
    option6 :'blue'

};

export
class LedState extends React.Component {
  
    // Using a class based component here because we're accessing DOM refs
   
    handle_led(e) {
      e.preventDefault()
      let led = this.refs.led_on.value
     
      this.props.onSignIn(led)
    }
    
    render() {
      return (
        <form onClick={this.handle_led.bind(this)}>
          <button type="button" ref="led_on" name="led_on">Turn LED ON</button>
          <button type="button" ref="led_off" name="led_off">Turn LED OFF</button>
        </form>
      )
    } 
  }

export
class LedsForm extends React.Component{
    render(){
        return(
            <div className="LedsForm" >
                <Dropdown />
                <LedState />
            </div>
        );
    }
}

export
class printForm extends React.Component{
    handle_print(e){
        e.preventDefault()
    }
    render(){
        return(
            <div className="printForm">
                <form action="/action_page.php">
                    Select a file: <input type="file" name="img" />
                    <input type="submit" />
                </form>
            </div>
        );
    }
}

/* ServerUpload.jsx */
import React, { PureComponent } from 'react';
import {
  Button,
  CardActions,
  FileUpload,
  LinearProgress,
  Snackbar,
  TextField,
} from 'react-md';

import { API_ENDPOINT, FAKE_UPLOAD_ENDPOINT } from 'constants/application';

import './_styles.scss';

export default class ServerUpload extends PureComponent {
  state = {
    sending: false,
    toasts: [],
    fileName: '',
    progress: null,
    uploadProgress: undefined,
    fileSize: 0,
  };

  componentWillUnmount() {
    if (this.progressTimeout) {
      clearTimeout(this.progressTimeout);
    }

    if (this.uploadProgressTimeout) {
      clearTimeout(this.uploadProgressTimeout);
    }
  }

  progressTimeout = null;
  uploadProgressTimeout = null;

  handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const file = data.get('file');
    if (!file || !file.name) {
      this.addToast('A file is required.');
      return;
    }

    fetch(`${API_ENDPOINT}${FAKE_UPLOAD_ENDPOINT}`, {
      method: 'POST',
      body: data,
    }).then((response) => {
      this.setState({ sending: false, uploadProgress: 0 });
      if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }

      return this.handleServerProgress(response.body.getReader());
    }).catch((error) => {
      if (__DEV__) {
        throw error;
      }

      this.addToast(error.message);
    });

    this.setState({ sending: true });
  };

  /**
   * There is no native support for watching progress with fetch, so you can do it by getting the
   * reader from the response and looping over the results.
   */
  handleServerProgress = async (reader) => {
    const result = await reader.read();
    const chunk = result.value;

    if (result.done) {
      this.addToast(`"${this.state.fileName}" successfully uploaded!`);
      this.setState({ uploadProgress: 100 });
      this.uploadProgressTimeout = setTimeout(() => {
        this.uploadProgressTimeout = null;
        this.setState({ uploadProgress: undefined });
      }, 500);
      return null;
    }

    const bytes = chunk.byteLength;
    this.setState(({ uploadProgress, fileSize }) => ({
      uploadProgress: uploadProgress + ((bytes / fileSize) * bytes),
    }));

    return this.handleServerProgress(reader);
  };


  handleProgress = (file, progress) => {
    this.setState({ progress });
  };

  handleLoad = ({ name, size }) => {
    this.progressTimeout = setTimeout(() => {
      this.progressTimeout = null;
      this.setState({ progress: null });
    }, 500);
    this.setState({ fileName: name, fileSize: size });
  };

  handleLoadStart = () => {
    this.setState({ progress: 0 });
  };

  addToast = (text) => {
    const toasts = [{ text, action: 'Ok' }];
    this.setState({ toasts });
  };

  dismiss = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };

  handleReset = () => {
    this.setState({ fileName: '' });
  };

  render() {
    const {
      toasts,
      fileName,
      progress,
      sending,
      uploadProgress,
    } = this.state;

    let progressBar;
    if (typeof progress === 'number') {
      progressBar = (
        <span className="file-inputs__upload-form__progress">
          <LinearProgress id="file-upload-status" value={progress} />
        </span>
      );
    } else if (sending || typeof uploadProgress === 'number') {
      progressBar = (
        <span className="file-inputs__upload-form__progress">
          <LinearProgress id="file-upload-server-status" query value={uploadProgress} />
        </span>
      );
    }

    return (
      <form
        id="server-upload-form"
        ref={this.setForm}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
        name="server-upload-form"
        className="file-inputs__upload-form"
      >
        {progressBar}
        <FileUpload
          id="server-upload-file"
          label="Choose file"
          required
          accept="image/*,video/*"
          onLoad={this.handleLoad}
          onLoadStart={this.handleLoadStart}
          onProgress={this.handleProgress}
          name="file"
          className="file-inputs__upload-form__file-upload"
          primary
          iconBefore
        />
        <TextField
          id="server-upload-file-field"
          placeholder="No file chosen"
          value={fileName}
          className="file-inputs__upload-form__file-field"
          readOnly
          fullWidth={false}
        />
        <CardActions className="md-full-width">
          <Button type="reset" flat className="md-cell--right">Reset</Button>
          <Button type="submit" flat primary disabled={!fileName || sending}>Submit</Button>
        </CardActions>
        <Snackbar id="file-upload-errors" toasts={toasts} onDismiss={this.dismiss} />
      </form>
    );
  }
}