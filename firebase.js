import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

console.log("[INFO] Firebase app count : ", firebase.apps?.length);

if (!firebase.apps?.length && firebaseConfig.appId) {
  console.log("[INFO] Initializing firebase app...");
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
