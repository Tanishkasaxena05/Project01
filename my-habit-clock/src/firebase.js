import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtQIGImahm2ZhbV-6c5kkjqI3CGbR14IU",
  authDomain: "habit-clock-b7df1.firebaseapp.com",
  projectId: "habit-clock-b7df1",
  storageBucket: "habit-clock-b7df1.firebasestorage.app",
  messagingSenderId: "193818934306",
  appId: "1:193818934306:web:71392b0727f1799a51de7b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);