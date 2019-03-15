import firebase from 'firebase';
import ngrok from 'ngrok';

// const httpPort = process.env.HTTP_PORT || 3001;
const p2pPort = process.env.P2P_PORT || 6001;
const firebaseConfig = {
  apiKey: 'AIzaSyAY5bhwqUUDd0bybwqGDeb0LPZTRSdC3kY',
  authDomain: 'dsn-tracker.firebaseapp.com',
  databaseURL: 'https://dsn-tracker.firebaseio.com',
  projectId: 'dsn-tracker',
  storageBucket: 'dsn-tracker.appspot.com',
  messagingSenderId: '1043546948603'
};
const collectionName = 'tracker';
const documentName = 'peer';

let myUrl;
let docRef;

function appendWs(peer) {
  return `ws://${peer}`;
}

async function connect() {
  const url = await ngrok.connect(p2pPort);
  myUrl = url.replace(/^https?:\/\//, '');
  console.log(`my ngrok URL: ${url}`);

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const firestore = firebase.firestore();
  docRef = firestore.collection(collectionName).doc(documentName);

  // write my ngrok url to tracker
  docRef.update({
    url: firebase.firestore.FieldValue.arrayUnion(myUrl)
  });

  // read peers from tracker
  return docRef
    .get()
    .then(doc => {
      let peers = [];
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        peers = doc.data().url.map(appendWs);
      }
      return peers;
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
}

async function disconnect() {
  await ngrok.disconnect(); // stops all
  await ngrok.kill(); // kills ngrok process
  await docRef.update({
    url: firebase.firestore.FieldValue.arrayRemove(myUrl)
  });
}

async function updatePeer(updater) {
  docRef.onSnapshot(
    async docSnapshot => {
      const peers = docSnapshot.data().url.map(appendWs);
      console.log(`Received peers: ${peers}`);
      updater(peers);
    },
    err => {
      console.log(`Encountered error: ${err}`);
    }
  );
}

export { connect, disconnect, updatePeer };
