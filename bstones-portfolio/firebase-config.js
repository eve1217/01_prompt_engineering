/**
 * Firebase Configuration
 * BSTONES Portfolio Admin
 */
const firebaseConfig = {
    apiKey: "AIzaSyBkVa_YAihYV6tgKwf_nGxnGG2vCPsz5Tg",
    authDomain: "bstones-portfolio-febaf.firebaseapp.com",
    projectId: "bstones-portfolio-febaf",
    storageBucket: "bstones-portfolio-febaf.firebasestorage.app",
    messagingSenderId: "732525849289",
    appId: "1:732525849289:web:3a0f7bf6893838977ebb18"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
