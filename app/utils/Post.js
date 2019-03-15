/* eslint-disable import/prefer-default-export */

export class Post {
  constructor(userId, message, ipfsPointer, timestamp) {
    this.userId = userId;
    this.message = message;
    this.ipfsPointer = ipfsPointer;
    this.timestamp = timestamp;
  }
}
