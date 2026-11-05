import { getFirestore } from 'firebase/firestore'
import app from './config'

// Firestore completo: lecturas en tiempo real y escrituras. Solo lo usa el admin;
// el sitio público lee con firestore/lite (ver reads.js), que pesa bastante menos.
export const db = getFirestore(app)
