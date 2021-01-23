import React from 'react';
import api from '../../utils/api';

class CryptoRates extends React.Component {
  ws = new WebSocket('ws://localhost:8080/');
  symbols = [];

  componentDidMount() {
    this.loadCryptos();
  }

  loadCryptos() {
    //TODO: get resources from API
    fetch(`${api.resources.cryptos}/prices`)
      .then((res) => res.text())
      .then((res) => (this.symbols = JSON.parse(res)));

    // this.socketHandler();
  }

  socketHandler() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };

    this.ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      this.setState({ dataFromServer: message });
      console.log(message);
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  }

  render() {
    return (
      <div>
        <p>TODO: For each resources Card with: </p>
        <ul>
          <li>Name</li>
          <li>Symbol</li>
          <li>Current rate</li>
          <li>Graph of evolution</li>
          <li>Opportunity indicator</li>
        </ul>
      </div>
    );
  }
}

export default CryptoRates;
