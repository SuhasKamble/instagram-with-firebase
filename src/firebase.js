import firebase from 'firebase'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJ5zj1ofWBkQnrdKW6GgJnuDaHRlrvM-E",
    authDomain: "instagram-clone-d83a5.firebaseapp.com",
    databaseURL: "https://instagram-clone-d83a5.firebaseio.com",
    projectId: "instagram-clone-d83a5",
    storageBucket: "instagram-clone-d83a5.appspot.com",
    messagingSenderId: "995947145690",
    appId: "1:995947145690:web:b7be3baf235fa80414b8e3",
    measurementId: "G-GMJK5XVHH0"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db  = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
export {auth,storage}
export default db;