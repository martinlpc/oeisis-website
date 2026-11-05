// Lecturas de Firestore para los hooks.
// - Una sola vez (sitio público): firestore/lite, mucho más liviano que el SDK completo.
// - En tiempo real (admin): el SDK completo, que se carga recién cuando hace falta.
//
// Las consultas se describen con un objeto, para poder armarlas con cualquiera de los dos SDK:
//   { path: 'news', orderBy: [['featured', 'desc'], ['createdAt', 'desc']], limit: 1 }
import { getFirestore, collection, query, orderBy, limit, doc, getDocs, getDoc } from 'firebase/firestore/lite'
import app from './config'

const liteDb = getFirestore(app)

export function buildQuery(sdk, db, spec) {
    const constraints = [
        ...(spec.orderBy || []).map(([field, direction]) => sdk.orderBy(field, direction)),
        ...(spec.limit ? [sdk.limit(spec.limit)] : []),
    ]
    return sdk.query(sdk.collection(db, spec.path), ...constraints)
}

const toDocs = (snapshot) => snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
const toDoc = (snapshot) => (snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null)

// Ejecuta fn y devuelve una función para cancelar (como onSnapshot)
function once(promise, onData, onError) {
    let cancelled = false
    promise
        .then(result => { if (!cancelled) onData(result) })
        .catch(error => { if (!cancelled) onError(error) })
    return () => { cancelled = true }
}

function realtime(subscribe, onError) {
    let unsubscribe = null
    let cancelled = false
    import('./realtime')
        .then(module => { if (!cancelled) unsubscribe = subscribe(module) })
        .catch(error => { if (!cancelled) onError(error) })
    return () => {
        cancelled = true
        unsubscribe?.()
    }
}

// Colección: onData recibe [{ id, ...datos }]
export function watchQuery(spec, { realtime: live }, onData, onError) {
    if (live) return realtime(module => module.subscribeQuery(spec, snapshot => onData(toDocs(snapshot)), onError), onError)
    return once(getDocs(buildQuery({ collection, query, orderBy, limit }, liteDb, spec)).then(toDocs), onData, onError)
}

// Documento: onData recibe { id, ...datos } o null si no existe
export function watchDoc(path, { realtime: live }, onData, onError) {
    if (live) return realtime(module => module.subscribeDoc(path, snapshot => onData(toDoc(snapshot)), onError), onError)
    return once(getDoc(doc(liteDb, ...path)).then(toDoc), onData, onError)
}
