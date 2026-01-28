/**
 * Firebase Configuration
 *
 * Firebase 프로젝트 설정 후 아래 config 값을 실제 값으로 교체하세요.
 * Firebase Console → 프로젝트 설정 → 일반 → 웹 앱에서 확인할 수 있습니다.
 */
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
