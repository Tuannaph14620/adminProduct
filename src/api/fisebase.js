
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyA6DaQuw7UqKhu4blJleSERx6_SzikgFIo",
    authDomain: "upload-image-d5f7e.firebaseapp.com",
    projectId: "upload-image-d5f7e",
    storageBucket: "upload-image-d5f7e.appspot.com",
    messagingSenderId: "715780175096",
    appId: "1:715780175096:web:9d6d05c984cf0cc48a370d",
    measurementId: "G-94LEY8DV59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
