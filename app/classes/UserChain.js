/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
import { Block } from './Block';
import { User } from './User';

const CryptoJS = require('crypto-js');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
};

export class UserChain {
  constructor(peers, savedChain, httpPort, p2pPort) {
    this.blockChain =
      savedChain.length === 0 ? [this.getGenesisBlock()] : savedChain;
    this.sockets = [];

    this.initHttpServer(httpPort);
    this.initP2PServer(p2pPort);
    this.connectToPeers(peers);
  }

  getGenesisBlock() {
    return new Block(0, '0', 0, new User('', '', ''));
  }

  initHttpServer(httpPort) {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(this.blockChain)));
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

  initP2PServer(p2pPort) {
    const server = new WebSocket.Server({ port: p2pPort });
    server.on('connection', ws => this.initConnection(ws));
    console.log(`listening websocket p2p port on: ${p2pPort}`);
  }

  initConnection(ws) {
    this.sockets.push(ws);
    this.initMessageHandler(ws);
    this.initErrorHandler(ws);
    this.write(ws, this.queryChainLengthMsg());
  }

  initMessageHandler(ws) {
    ws.on('message', data => {
      const message = JSON.parse(data);
      console.log(`Received message${JSON.stringify(message)}`);
      switch (message.type) {
        case MessageType.QUERY_LATEST:
          this.write(ws, this.responseLatestMsg());
          break;
        case MessageType.QUERY_ALL:
          this.write(ws, this.responseChainMsg());
          break;
        case MessageType.RESPONSE_BLOCKCHAIN:
          this.handleBlockChainResponse(message);
          break;
        default:
          break;
      }
    });
  }

  initErrorHandler(ws) {
    const closeConnection = socket => {
      console.log(`connection failed to peer: ${socket.url}`);
      this.sockets.splice(this.sockets.indexOf(socket), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
  }

  generateNextBlock(data) {
    const previousBlock = this.getLatestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000;
    const nextHash = this.calculateHash(
      nextIndex,
      previousBlock.hash,
      nextTimestamp,
      data
    );
    return new Block(
      nextIndex,
      previousBlock.hash,
      nextTimestamp,
      data,
      nextHash
    );
  }

  calculateHashForBlock(block) {
    return this.calculateHash(
      block.index,
      block.previousHash,
      block.timestamp,
      block.data
    );
  }

  calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
  }

  addBlock(newBlock) {
    if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
      this.blockChain.push(newBlock);
    }
  }

  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index');
      return false;
    }
    if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash');
      return false;
    }
    if (this.calculateHashForBlock(newBlock) !== newBlock.hash) {
      console.log(
        `${typeof newBlock.hash} ${typeof this.calculateHashForBlock(newBlock)}`
      );
      console.log(
        `invalid hash: ${this.calculateHashForBlock(newBlock)} ${newBlock.hash}`
      );
      return false;
    }
    return true;
  }

  connectToPeers(newPeers) {
    newPeers.forEach(peer => {
      const ws = new WebSocket(peer);
      ws.on('open', () => this.initConnection(ws));
      ws.on('error', () => {
        console.log('connection failed');
      });
    });
  }

  handleBlockChainResponse(message) {
    const receivedBlocksJson = JSON.parse(message.data).sort(
      (b1, b2) => b1.index - b2.index
    );
    const receivedBlocks = receivedBlocksJson.map(
      e =>
        new Block(
          e.index,
          e.previousHash,
          e.timestamp,
          !e.data
            ? {}
            : new User(
                e.data.userName,
                e.data.bio,
                e.data.passwordHash,
                e.data.userId,
                e.data.macAddress,
                e.data.avatar
              ),
          e.hash
        )
    );

    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    const latestBlockHeld = this.getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
      console.log(
        `blockchain possibly behind. We got: ${
          latestBlockHeld.index
        } Peer got: ${latestBlockReceived.index}`
      );
      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        console.log('We can append the received block to our chain');
        this.blockChain.push(latestBlockReceived);
        this.broadcast(this.responseLatestMsg());
      } else if (receivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer');
        this.broadcast(this.queryAllMsg());
      } else {
        console.log('Received blockchain is longer than current blockchain');
        this.replaceChain(receivedBlocks);
      }
    } else {
      console.log(
        'received blockchain is not longer than current blockchain. Do nothing'
      );
    }
  }

  replaceChain(newBlocks) {
    if (
      this.isValidChain(newBlocks) &&
      newBlocks.length > this.blockChain.length
    ) {
      console.log(
        'Received blockchain is valid. Replacing current blockchain with received blockchain'
      );
      this.blockChain = newBlocks;
      this.broadcast(this.responseLatestMsg());
    } else {
      console.log('Received blockchain invalid');
    }
  }

  isValidChain(blockchainToValidate) {
    if (
      JSON.stringify(blockchainToValidate[0]) !==
      JSON.stringify(this.getGenesisBlock())
    ) {
      return false;
    }
    const tempBlocks = [blockchainToValidate[0]];
    for (let i = 1; i < blockchainToValidate.length; i++) {
      if (this.isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
        tempBlocks.push(blockchainToValidate[i]);
      } else {
        return false;
      }
    }
    return true;
  }

  getLatestBlock() {
    return this.blockChain[this.blockChain.length - 1];
  }

  queryChainLengthMsg() {
    return { type: MessageType.QUERY_LATEST };
  }

  queryAllMsg() {
    return { type: MessageType.QUERY_ALL };
  }

  responseChainMsg() {
    return {
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: JSON.stringify(this.blockChain)
    };
  }

  responseLatestMsg() {
    return {
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: JSON.stringify([this.getLatestBlock()])
    };
  }

  write(ws, message) {
    ws.send(JSON.stringify(message));
  }

  broadcast(message) {
    this.sockets.forEach(socket => this.write(socket, message));
  }
}
