export class Block {
  constructor(index, previousHash, timestamp, post, hash) {
    this.index = index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.post = post;
    this.hash = hash.toString();
  }
}
