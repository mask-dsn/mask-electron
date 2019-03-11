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

async function connect() {
  let url = await ngrok.connect(p2pPort);
  url = url.replace(/^https?:\/\//, '');
  console.log(`ngrok URL: ${url}`);

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const firestore = firebase.firestore();
  const docRef = firestore.collection(collectionName).doc(documentName);

  // write my ngrok url to tracker
  docRef.update({
    url: firebase.firestore.FieldValue.arrayUnion(url)
  });

  // read peers from tracker
  return docRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        const peers = doc.data().url.map(peer => `ws://${peer}`);
        return peers;
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
}

async function disconnect() {
  await ngrok.disconnect(); // stops all
  await ngrok.kill(); // kills ngrok process
}

export { connect, disconnect };
