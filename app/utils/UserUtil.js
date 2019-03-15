/* eslint-disable prettier/prettier */
/* eslint-disable one-var */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
const CryptoJS = require('crypto-js');
var fs = require('fs');

class User {
  constructor(usrId, avatar, bio) {
    this.usrId = usrId;
    this.avatar = avatar;
    this.bio = bio;
  }
}

function getUsrId() {
  return fs.readFile('MaskUsrId.txt', (err, data) => {
    if (err) {
      const id = CryptoJS.randomBytes(20).toString('hex');
      console.log(`read usrId = ${id}`);
      fs.writeFile('MaskUsrId.txt', id, err2 => {
        if (err2) {
          console.log(err);
        }
      });
      return id;
    }
    return data;
  });

  function generateAvatar() {
    const id = getUsrId();
    const firsrChar = id[0];
    var canvas = document.getElementById('user-icon');
    var context = canvas.getContext('2d');

    var canvasWidth = canvas.attr('width'),
      canvasHeight = canvas.attr('height'),
      canvasCssWidth = canvasWidth,
      canvasCssHeight = canvasHeight;

    if (window.devicePixelRatio) {
      canvas.attr('width', canvasWidth * window.devicePixelRatio);
      canvas.attr('height', canvasHeight * window.devicePixelRatio);
      canvas.css('width', canvasCssWidth);
      canvas.css('height', canvasCssHeight);
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '128px Arial';
    context.textAlign = 'center';
    context.fillStyle = '#FFF';
    context.fillText(firsrChar, canvasCssWidth / 2, canvasCssHeight / 1.5);
  }
}
