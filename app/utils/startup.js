import { Chain } from './Chain';
import { connect } from './tracker';

async function startUp() {
  const peers = await connect();
  const chain = new Chain(peers);
  return chain;
}

export { startUp };
