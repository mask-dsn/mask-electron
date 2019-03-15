import { UserChain } from './UserChain';
import { postChain, PostChain } from './PostChain';

const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
};
const httpPort = process.env.HTTP_PORT || 3001;
const p2pPort = process.env.P2P_PORT || 6001;

export class ChainServer {
  constructor() {
    this.postChain = new PostChain();
    this.userChain = new UserChain();
    this.sockets = [];
  }

  initHttpServer() {
    const app = express();
    app.use(bodyParser.json());

    // post chain
    // TODO: append /post to all endpoints
    app.get('/blocks', (req, res) =>
      res.send(JSON.stringify(this.postChain.blockchain))
    );
    app.post('/mineBlock', (req, res) => {
      const newBlock = this.postChain.generateNextBlock(req.body);
      this.postChain.addBlock(newBlock);
      this.broadcast(this.postChain.responseLatestMsg());
      console.log(`block added: ${JSON.stringify(newBlock)}`);
      res.send();
    });
    app.get('/peers', (req, res) => {
      res.send(
        this.sockets.map(
          s => `${s._socket.remoteAddress}:${s._socket.remotePort}`
        )
      );
    });
    app.post('/addPeer', (req, res) => {
      this.connectToPeers([req.body.peer]);
      res.send();
    });

    // user chain
    app.get('/blocks', (req, res) => res.send(JSON.stringify(this.blockchain)));
    app.post('/mineBlock', (req, res) => {
      const newBlock = this.generateNextBlock(req.body);
      this.addBlock(newBlock);
      this.broadcast(this.responseLatestMsg());
      console.log(`block added: ${JSON.stringify(newBlock)}`);
      res.send();
    });
    app.get('/peers', (req, res) => {
      res.send(
        this.sockets.map(
          s => `${s._socket.remoteAddress}:${s._socket.remotePort}`
        )
      );
    });
    app.post('/addPeer', (req, res) => {
      this.connectToPeers([req.body.peer]);
      res.send();
    });

    app.listen(httpPort, () =>
      console.log(`Listening http on port: ${httpPort}`)
    );
  }

  broadcast(message) {
    this.sockets.forEach(socket => this.write(socket, message));
  }
}
