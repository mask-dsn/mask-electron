import firebase from 'firebase';
import ngrok from 'ngrok';

const http_port = process.env.HTTP_PORT || 3001;
const p2p_port = process.env.P2P_PORT || 6001;
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
  let url = await ngrok.connect(p2p_port);
  url = url.replace(/^https?:\/\//, '');
  console.log(`ngrok URL: ${url}`);

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const docRef = db.collection(collectionName).doc(documentName);
  const newPeers = docRef.update({
    url: firebase.firestore.FieldValue.arrayUnion(url)
  });
}

async function disconnect() {
  await ngrok.disconnect(); // stops all
  await ngrok.kill(); // kills ngrok process
}

export { connect, disconnect };
