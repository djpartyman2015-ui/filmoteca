import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const p1 = "AIzaSyAiF3Per";
const p2 = "N626i8hH42Rfwa";
const p3 = "qvzMqjySfxlY";

const firebaseConfig = {
  apiKey: p1+p2+p3,
  authDomain: "filmoteca-10976.firebaseapp.com",
  projectId: "filmoteca-10976",
  storageBucket: "filmoteca-10976.firebasestorage.app",
  messagingSenderId: "381307318555",
  appId: "1:381307318555:web:b579cb97a0f496ecae63be"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);