import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBtrASZESSFRVIQTJ9yQL2kCgYGFQX5pXY",
    authDomain: "sequence-5766a.firebaseapp.com",
    databaseURL: "https://sequence-5766a-default-rtdb.firebaseio.com",
    projectId: "sequence-5766a",
    storageBucket: "sequence-5766a.firebasestorage.app",
    messagingSenderId: "149423138338",
    appId: "1:149423138338:web:670818b1570b8ac72f8c7b",
    measurementId: "G-T7SMQSC28C"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);