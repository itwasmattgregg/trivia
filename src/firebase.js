import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB3jKBb_vOh1ovCh-PgC-zgf9JhJ2SM-Ws",
  authDomain: "nerdy-balderdash.firebaseapp.com",
  databaseURL: "https://nerdy-balderdash.firebaseio.com",
  projectId: "nerdy-balderdash",
  storageBucket: "nerdy-balderdash.appspot.com",
  messagingSenderId: "517571102162",
  appId: "1:517571102162:web:8698d938bc8881627ab40b",
  measurementId: "G-31GCDSYCF9"
});

export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
