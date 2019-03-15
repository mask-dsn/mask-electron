import getmac from 'getmac';

export class User {
  constructor(
    userName,
    bio,
    passwordHash,
    userId,
    macAddress,
    avatar,
    timestamp
  ) {
    this.userName = userName;
    this.bio = bio;
    this.passwordHash = passwordHash;

    this.userId = !userId ? this.generateId() : userId;
    this.macAddress = !macAddress ? this.getMacAddress() : macAddress;
    this.avatar = !avatar ? this.generateAvatar() : avatar;
    this.timestamp = !timestamp ? new Date().getTime() : timestamp;
  }

  generateId() {
    return '';
  }

  getMacAddress() {
    getmac.getMac((err, mac) => {
      if (err) throw err;
      console.log(mac);
      this.macAddress = mac;
    });
  }

  generateAvatar() {
    return '';
  }
}
