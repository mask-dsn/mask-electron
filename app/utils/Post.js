const CryptoJS = require('crypto-js');

export class Post {
  constructor(userId, message, ipfsPointer, timestamp) {
    this.userId = userId;
    this.message = message;
    this.ipfsPointer = ipfsPointer;
    this.timestamp = timestamp;
  }

  static getUserId() {
    const id = CryptoJS.randomBytes(20).toString('hex');
    console.log(`read userId = ${id}`);
    return id;
  }
}
