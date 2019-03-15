import axios from'axios';

const fs = require('fs');

const savedChainPath = __dirname + '/../.cache';
const cacheFile = "/.blockchain.json";

function saveChain(callback) {
  if (!fs.existsSync(savedChainPath)){
    fs.mkdirSync(savedChainPath);
  }

  axios.get('http://localhost:3001/blocks').then(res => {
      const blockchain = res.data;
      var json = JSON.stringify(blockchain);
      fs.writeFile(savedChainPath + cacheFile, json, 'utf-8', callback);
    });  
};

function getSavedChain() {
  if (!fs.existsSync(savedChainPath)){
    fs.mkdirSync(savedChainPath);
  }

  var fileContents;
  var savedChain;

  try {
    fileContents = fs.readFileSync(savedChainPath+cacheFile, 'utf-8');
    savedChain = JSON.parse(fileContents);
  } catch (err) {
    savedChain = [];
  }

  return savedChain;
};

export {saveChain, getSavedChain};