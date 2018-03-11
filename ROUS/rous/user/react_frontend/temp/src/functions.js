import axios from "axios";

export function getRequest() {
  axios
    .get("http://localhost:4242/listenerdata")
    .then(response => this.setstate({ username: response.data }));
}

export function getNodeAmount() {
  fetch("http://localhost:4242/whois");
}
export function loadNodeData() {
  function nodeInfo(json) {
    return json.map(function(data) {
      return new nodeData(data.ip, data.status, data.services);
    });
  }
  fetch("http://localhost:4242/listenerdata")
    .then(response => response.json())
    .then(json => {
      console.log(json);
      this.setState({
        data: json
      });
    })
    .catch(function (err) {
      console.log('Fetch Error :(', err);
    });
}
