// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO9o3Z-oPe_7hWl7b9Qyc-8IXvi24TTzE",
  authDomain: "spendcheck-7569d.firebaseapp.com",
  projectId: "spendcheck-7569d",
  storageBucket: "spendcheck-7569d.firebasestorage.app",
  messagingSenderId: "1057889244751",
  appId: "1:1057889244751:web:e170a29aec4f821fdf7c3a",
};

// Initialize Firebase
// Prevent re-initializing in Expo Fast Refresh
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

//  Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
