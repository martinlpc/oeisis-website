import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/db'
import { CONTENT_FIELDS, translationStatus } from '../../i18n/content'
import { useToast } from './useFeedback'
import { Button, StatusText } from './ui'

const NAMES = { shows: 'shows', news: 'noticias', featured: 'destacado', videos: 'videos', press: 'prensa' }

// Documentos con textos sin traducir o con una traducción vieja
async function findPending() {
    const pending = []
    for (const name of Object.keys(CONTENT_FIELDS)) {
        const snapshot = await getDocs(collection(db, name))
        snapshot.forEach(d => {
            const data = { id: d.id, ...d.data() }
            const status = translationStatus(name, data)
            if (status === 'missing' || status === 'stale') pending.push({ collection: name, data })
        })
    }
    return pending
}

// Traduce de una vez todo lo pendiente: sirve para el contenido cargado antes de la versión en inglés
// y para reintentar lo que falló al guardar
export function EnglishMaintenance() {
    const toast = useToast()
    const [pending, setPending] = useState(null)
    const [error, setError] = useState(null)
    const [progress, setProgress] = useState(null)

    useEffect(() => {
        let cancelled = false
        findPending()
            .then(list => { if (!cancelled) setPending(list) })
            .catch(err => { if (!cancelled) setError(err.message) })
        return () => { cancelled = true }
    }, [])

    const translateAll = async () => {
        const { translateDoc } = await import('../../i18n/translateContent')
        let done = 0
        const failed = []
        setProgress(0)
        for (const item of pending) {
            try {
                await updateDoc(doc(db, item.collection, item.data.id), await translateDoc(item.collection, item.data))
                done++
            } catch (err) {
                console.error('No se pudo traducir', item.collection, item.data.id, err)
                failed.push(item)
            }
            setProgress(done + failed.length)
        }
        setPending(failed)
        setProgress(null)
        if (failed.length === 0) toast.success(`Se tradujeron ${done} elementos`)
        else toast.warning(`Se tradujeron ${done}. Fallaron ${failed.length}: revisá la consola del navegador.`)
    }

    if (error) return <StatusText error>Error: {error}</StatusText>
    if (!pending) return <StatusText>Buscando contenido sin traducir...</StatusText>
    if (pending.length === 0) return <StatusText>Todo el contenido está traducido al inglés.</StatusText>

    const counts = pending.reduce((acc, item) => ({ ...acc, [item.collection]: (acc[item.collection] || 0) + 1 }), {})

    return (
        <div className="space-y-4">
            <p className="text-gray-300">
                Hay {pending.length} {pending.length === 1 ? 'elemento' : 'elementos'} sin traducir o con el español cambiado:{' '}
                {Object.entries(counts).map(([name, n]) => `${NAMES[name]} (${n})`).join(', ')}.
                Mientras tanto, la web en inglés los muestra en español.
            </p>
            <Button onClick={translateAll} disabled={progress !== null}>
                {progress !== null ? `Traduciendo ${progress} de ${pending.length}...` : 'Traducir todo al inglés'}
            </Button>
        </div>
    )
}
