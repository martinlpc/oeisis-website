import { initializeApp } from 'firebase/app';

// Reemplazá estos valores con los de tu proyecto Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Solo la app. Firestore se inicializa aparte:
// - firebase/reads.js: versión liviana (firestore/lite) para leer en el sitio público
// - firebase/db.js: versión completa (tiempo real y escrituras), solo la carga el admin
const app = initializeApp(firebaseConfig);

export default app;
