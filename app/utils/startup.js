import { Chain } from './Chain';
import { UserChain } from '../classes/UserChain';
import { connect } from './tracker';
import { getSavedChain } from './persistBlockchain';

async function startUp() {
  const peers = await connect();
  const savedChain = getSavedChain();
  new Chain(peers, savedChain);
  new UserChain(peers, [], 3002, 6002);
}

export { startUp };
