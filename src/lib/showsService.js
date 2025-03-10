import { ref, get, set, push, remove, query, orderByChild } from 'firebase/database'
import { database } from './firebase.js'

export const showsService = {
    getFutureShows: async () => {
        try {
            const showsRef = ref(database, 'shows')
            const showsQuery = query(showsRef, orderByChild('fecha'))
            const snapshot = await get(showsQuery)

            if (snapshot.exists()) {
                const showsData = []
                snapshot.forEach((childSnapshot) => {
                    showsData.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    })
                })

                return showsData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            }
            return []
        } catch (error) {
            console.error("Error al obtener shows:", error)
            throw error
        }
    },

    addShow: async (show) => {
        try {
            const showsRef = ref(database, 'shows');
            const newShowRef = push(showsRef);
            await set(newShowRef, show);
            return { id: newShowRef.key, ...show };
        } catch (error) {
            console.error("Error al añadir show:", error);
            throw error;
        }
    },

    updateShow: async (id, updatedShow) => {
        try {
            const showRef = ref(database, `shows/${id}`);
            await set(showRef, updatedShow);
            return { id, ...updatedShow };
        } catch (error) {
            console.error("Error al actualizar show:", error);
            throw error;
        }
    },

    deleteShow: async (id) => {
        try {
            const showRef = ref(database, `shows/${id}`);
            await remove(showRef);
            return id;
        } catch (error) {
            console.error("Error al eliminar show:", error);
            throw error;
        }
    }
}