// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getUpcomingShows() {
    try {
        const showsCollection = collection(db, 'shows')
        const showsSnapshot = await getDocs(showsCollection)

        const shows = showsSnapshot.docs
            .map(doc => ({
                id: doc.id,
                venue: doc.data().venue || '', // Asegúrate de que estos campos existan
                location: doc.data().location || '',
                date: doc.data().date || '',
                displayDate: doc.data().displayDate || '',
                ticketLink: doc.data().ticketLink || '',
                time: doc.data().time || '',
                info: doc.data().info || '',
                imageUrl: doc.data().imageUrl || ''
            }))
            .filter(show => {
                // Filter out past shows
                const showDate = new Date(show.date)
                const today = new Date()
                return showDate >= today
            })
            .sort((a, b) => {
                // Order shows by date
                return new Date(a.date) - new Date(b.date)
            })

        return shows
    } catch (error) {
        console.error("Error obteniendo shows:", error)
        return []
    }
}

export async function getPastShows() {
    try {
        const showsCollection = collection(db, 'shows')
        const showsSnapshot = await getDocs(showsCollection)

        const shows = showsSnapshot.docs
            .map(doc => ({
                id: doc.id,
                venue: doc.data().venue || '', // Asegúrate de que estos campos existan
                location: doc.data().location || '',
                date: doc.data().date || '',
                displayDate: doc.data().displayDate || '',
                ticketLink: doc.data().ticketLink || '',
                time: doc.data().time || '',
                info: doc.data().info || '',
                imageUrl: doc.data().imageUrl || ''
            }))
            .filter(show => {
                const showDate = new Date(show.date)
                const today = new Date()
                return showDate < today
            })
            .sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })

        return shows
    } catch (error) {
        console.error("Error obteniendo shows pasados:", error)
        return []
    }
}