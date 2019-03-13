const CryptoJS = require('crypto-js');

class Post {
  constructor(usrId, message, timestamp) {
    this.usrId = usrId;
    this.message = message;
    this.timestamp = timestamp;
  }

  static getUsrId() {
    const id = CryptoJS.randomBytes(20).toString('hex');
    console.log(`read usrId = ${id}`);
    return id;
  }
}

export { Post as default };
