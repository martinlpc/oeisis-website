// Escrituras con el SDK completo. Los hooks lo cargan con import() al guardar,
// así el sitio público (que nunca escribe) no lo descarga.
import { collection, doc, addDoc, updateDoc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './db'

export { serverTimestamp }

export const addTo = (path, data) => addDoc(collection(db, path), data)
export const update = (path, data) => updateDoc(doc(db, ...path), data)
export const set = (path, data, options) => setDoc(doc(db, ...path), data, options)
export const remove = (path) => deleteDoc(doc(db, ...path))

export async function read(path) {
    const snapshot = await getDoc(doc(db, ...path))
    return snapshot.exists() ? snapshot.data() : null
}
