import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const db = getFirestore();
const showsCollection = collection(db, "shows");

// Escuchar cambios en la colección "shows"
onSnapshot(showsCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (["added", "modified", "removed"].includes(change.type)) {
            fetch("/.netlify/functions/rebuild", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ showId: change.doc.id }),
            });
        }
    });
});
