import { onSnapshot, getDocs } from 'firebase/firestore'

const toDocs = (snapshot) => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

// realtime: true  -> onSnapshot (admin: ve los cambios al instante)
// realtime: false -> getDocs una sola vez (sitio público: sin conexión abierta)
// Devuelve una función para cancelar, igual que onSnapshot.
export function watchQuery(q, { realtime }, onData, onError) {
    if (realtime) {
        return onSnapshot(q, snapshot => onData(toDocs(snapshot)), onError)
    }

    let cancelled = false
    getDocs(q)
        .then(snapshot => { if (!cancelled) onData(toDocs(snapshot)) })
        .catch(error => { if (!cancelled) onError(error) })

    return () => { cancelled = true }
}
