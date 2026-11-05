// Suscripciones en tiempo real con el SDK completo (solo admin; se carga con import())
import { collection, query, orderBy, limit, doc, onSnapshot } from 'firebase/firestore'
import { db } from './db'
import { buildQuery } from './reads'

export function subscribeQuery(spec, onNext, onError) {
    return onSnapshot(buildQuery({ collection, query, orderBy, limit }, db, spec), onNext, onError)
}

export function subscribeDoc(path, onNext, onError) {
    return onSnapshot(doc(db, ...path), onNext, onError)
}
