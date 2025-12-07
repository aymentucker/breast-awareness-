import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyADsgOFmzAREsg9CVqXX8vc_SqEDhPyx-0",
  authDomain: "azhar-breast-awareness.firebaseapp.com",
  projectId: "azhar-breast-awareness",
  storageBucket: "azhar-breast-awareness.firebasestorage.app",
  messagingSenderId: "283458946810",
  appId: "1:283458946810:web:460c263936f572dc77eb43",
  measurementId: "G-KHH87QJYH8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
