import axios from "axios";

export function getRequest() {
  axios
    .get("http://localhost:4242/listenerdata")
    .then(response => this.setstate({ username: response.data }));
}

export function getNodeAmount() {
  fetch( "http://localhost:4242/listenerdata" )
  
}