/* eslint-disable import/prefer-default-export */
const CryptoJS = require('crypto-js');

export class Post {
  constructor(userId, message, timestamp) {
    this.userId = userId;
    this.message = message;
    this.timestamp = timestamp;
  }

  static getUserId() {
    const id = CryptoJS.randomBytes(20).toString('hex');
    console.log(`read userId = ${id}`);
    return id;
  }
}
