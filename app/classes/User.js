export class User {
  constructor(userName, bio, passwordHash, userId, macAddress, avatar) {
    this.userName = userName;
    this.bio = bio;
    this.passwordHash = passwordHash;

    this.userId = !userId ? this.generateId() : userId;
    this.macAddress = !macAddress ? this.getMacAddress() : macAddress;
    this.avatar = !avatar ? this.generateAvatar() : avatar;
  }

  generateId() {
    return '';
  }

  getMacAddress() {
    return '';
  }

  generateAvatar() {
    return '';
  }
}
