import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAN-4oJCVsZJaUzDQAr6WTK6mKavzNkthE",
  authDomain: "rasyaan-297e8.firebaseapp.com",
  projectId: "rasyaan-297e8",
  storageBucket: "rasyaan-297e8.firebasestorage.app",
  messagingSenderId: "373481734176",
  appId: "1:373481734176:web:850fbc9e342206f0dd3c45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};
