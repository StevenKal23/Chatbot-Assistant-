import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvH-93ffEpEa8QStkerjfC9GtBwp3BIkc",
  authDomain: "vero-chat-assistant.firebaseapp.com",
  projectId: "vero-chat-assistant",
  storageBucket: "vero-chat-assistant.firebasestorage.app",
  messagingSenderId: "289366733342",
  appId: "1:289366733342:web:f187ecbde10bebf819740f",
  measurementId: "G-NY9K7PNJBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };