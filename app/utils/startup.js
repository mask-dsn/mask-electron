import { Chain } from './Chain';
import { connect } from './tracker';
import { getSavedChain } from './persistBlockchain';

async function startUp() {
  const peers = await connect();
  const savedChain = getSavedChain();
  const chain = new Chain(peers, savedChain);
  return chain;
}

export { startUp };
