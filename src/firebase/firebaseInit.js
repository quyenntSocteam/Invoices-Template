import firebase from 'firebase/app'
import "firebase/firestore"

var firebaseConfig = {
    apiKey: "AIzaSyB_yY4jUZCNkXTAOi9F9LW6xMiRo1xNDgU",
    authDomain: "invoice-vue-24f00.firebaseapp.com",
    projectId: "invoice-vue-24f00",
    storageBucket: "invoice-vue-24f00.appspot.com",
    messagingSenderId: "589353394602",
    appId: "1:589353394602:web:b00521d540a8d5cd15cbd3",
    measurementId: "G-YFP2WV4G2R"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp.firestore()