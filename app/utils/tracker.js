const ngrok = require('ngrok');

const http_port = process.env.HTTP_PORT || 3001;
const p2p_port = process.env.P2P_PORT || 6001;

async function connect() {
  const url = await ngrok.connect(http_port);
  console.log(url);
}

async function disconnect() {
  await ngrok.disconnect(); // stops all
  await ngrok.kill(); // kills ngrok process
}

export { connect, disconnect };
