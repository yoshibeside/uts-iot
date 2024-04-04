import { initializeApp } from 'firebase/app';
import dotenv from "dotenv";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

class FirebaseAll {

    constructor() {
        if (FirebaseAll._instance) {
            return FirebaseAll._instance;
        }
        dotenv.config();
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            appId: process.env.FIREBASE_APP_ID,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID,
            databaseURL: process.env.FIREBASE_DATABASE_URL
        };
        FirebaseAll._instance = this;
        this.app = initializeApp(firebaseConfig);
    }

    getApp() {
        return this.app;
    }

    getDB() {
        return getDatabase(this.app);
    }

    getFireSt() {
        return getFirestore(this.app);
    }
}

export default new FirebaseAll();