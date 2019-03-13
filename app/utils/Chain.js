import { Block } from './Block';

const CryptoJS = require('crypto-js');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

export class Chain {
  constructor() {
    this.blockchain = [getGenesisBlock()];
    this.sockets = [];
  }

  getGenesisBlock() {
    return new Block(
      0,
      '0',
      1465154705,
      'my genesis block!!',
      '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7'
    );
  }

  initHttpServer() {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
    app.post('/mineBlock', (req, res) => {
      const newBlock = generateNextBlock(req.body.data);
      addBlock(newBlock);
      broadcast(responseLatestMsg());
      console.log(`block added: ${JSON.stringify(newBlock)}`);
      res.send();
    });
    app.get('/peers', (req, res) => {
      res.send(
        sockets.map(s => `${s._socket.remoteAddress}:${s._socket.remotePort}`)
      );
    });
    app.post('/addPeer', (req, res) => {
      connectToPeers([req.body.peer]);
      res.send();
    });
    app.listen(http_port, () =>
      console.log(`Listening http on port: ${http_port}`)
    );
  }

  initP2PServer() {
    const server = new WebSocket.Server({ port: p2p_port });
    server.on('connection', ws => initConnection(ws));
    console.log(`listening websocket p2p port on: ${p2p_port}`);
  }

  initConnection(ws) {
    sockets.push(ws.url);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
  }

  initMessageHandler(ws) {
    ws.on('message', data => {
      const message = JSON.parse(data);
      console.log(`Received message${JSON.stringify(message)}`);
      switch (message.type) {
        case MessageType.QUERY_LATEST:
          write(ws, responseLatestMsg());
          break;
        case MessageType.QUERY_ALL:
          write(ws, responseChainMsg());
          break;
        case MessageType.RESPONSE_BLOCKCHAIN:
          handleBlockchainResponse(message);
          break;
      }
    });
  }

  initErrorHandler(ws) {
    const closeConnection = ws => {
      console.log(`connection failed to peer: ${ws.url}`);
      sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
  }

  generateNextBlock(blockData) {
    const previousBlock = getLatestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000;
    const nextHash = calculateHash(
      nextIndex,
      previousBlock.hash,
      nextTimestamp,
      blockData
    );
    return new Block(
      nextIndex,
      previousBlock.hash,
      nextTimestamp,
      blockData,
      nextHash
    );
  }

  calculateHashForBlock(block) {
    return calculateHash(
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
    if (isValidNewBlock(newBlock, getLatestBlock())) {
      blockchain.push(newBlock);
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
    if (calculateHashForBlock(newBlock) !== newBlock.hash) {
      console.log(
        `${typeof newBlock.hash} ${typeof calculateHashForBlock(newBlock)}`
      );
      console.log(
        `invalid hash: ${calculateHashForBlock(newBlock)} ${newBlock.hash}`
      );
      return false;
    }
    return true;
  }

  connectToPeers(newPeers) {
    newPeers.forEach(peer => {
      const ws = new WebSocket(peer);
      ws.on('open', () => initConnection(ws));
      ws.on('error', () => {
        console.log('connection failed');
      });
    });
  }

  handleBlockchainResponse(message) {
    const receivedBlocks = JSON.parse(message.data).sort(
      (b1, b2) => b1.index - b2.index
    );
    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    const latestBlockHeld = getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
      console.log(
        `blockchain possibly behind. We got: ${
          latestBlockHeld.index
        } Peer got: ${latestBlockReceived.index}`
      );
      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        console.log('We can append the received block to our chain');
        blockchain.push(latestBlockReceived);
        broadcast(responseLatestMsg());
      } else if (receivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer');
        broadcast(queryAllMsg());
      } else {
        console.log('Received blockchain is longer than current blockchain');
        replaceChain(receivedBlocks);
      }
    } else {
      console.log(
        'received blockchain is not longer than current blockchain. Do nothing'
      );
    }
  }

  replaceChain(newBlocks) {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
      console.log(
        'Received blockchain is valid. Replacing current blockchain with received blockchain'
      );
      blockchain = newBlocks;
      broadcast(responseLatestMsg());
    } else {
      console.log('Received blockchain invalid');
    }
  }

  isValidChain(blockchainToValidate) {
    if (
      JSON.stringify(blockchainToValidate[0]) !==
      JSON.stringify(getGenesisBlock())
    ) {
      return false;
    }
    const tempBlocks = [blockchainToValidate[0]];
    for (let i = 1; i < blockchainToValidate.length; i++) {
      if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
        tempBlocks.push(blockchainToValidate[i]);
      } else {
        return false;
      }
    }
    return true;
  }

  getLatestBlock() {
    return blockchain[blockchain.length - 1];
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
      data: JSON.stringify(blockchain)
    };
  }

  responseLatestMsg() {
    return {
      type: MessageType.RESPONSE_BLOCKCHAIN,
      data: JSON.stringify([getLatestBlock()])
    };
  }

  postNewBlock(blockData) {
    const newBlock = generateNextBlock(blockData);
    addBlock(newBlock);
    console.log(sockets);
    broadcast(responseLatestMsg());
    console.log(`block added: ${JSON.stringify(newBlock)}`);
  }

  write(ws, message) {
    ws.send(JSON.stringify(message));
  }

  broadcast(message) {
    sockets.forEach(socket => write(socket, message));
  }
}
