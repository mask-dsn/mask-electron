/* eslint-disable import/prefer-default-export */
const CryptoJS = require('crypto-js');

export class Post {
  constructor(user, message, timestamp) {
    this.user = user;
    this.message = message;
    this.timestamp = timestamp;
  }

  static getUsrId() {
    const id = CryptoJS.randomBytes(20).toString('hex');
    console.log(`read usrId = ${id}`);
    return id;
  }
}
