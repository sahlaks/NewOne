import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnD9eUg6Zjtu_ew2i9SOKAORT1Msx0qG0",
  authDomain: "second-project-3eae8.firebaseapp.com",
  projectId: "second-project-3eae8",
  storageBucket: "second-project-3eae8.appspot.com",
  messagingSenderId: "43719609300",
  appId: "1:43719609300:web:5bc95c8a2e7fea83dea441"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app