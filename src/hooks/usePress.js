import { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { prepareEnglish } from '../i18n/prepareEnglish'

// Kit de prensa: un solo documento, press/current
const pressDoc = () => doc(db, 'press', 'current')

export const EMPTY_PRESS = {
    bioShort: '',
    bioLong: '',
    facts: [],      // [{ label, value }]
    photos: [],     // [{ url, previewUrl, credit }]
    riderUrl: '',
    pressKitUrl: '',
    videoIds: [],
}

export async function updatePress(data) {
    const { data: changes, translated } = await prepareEnglish('press', data, pressDoc())
    await setDoc(pressDoc(), { ...changes, updatedAt: serverTimestamp() }, { merge: true })
    return { translated }
}

// realtime para el admin; lectura única para la página pública
export function usePress({ realtime = true } = {}) {
    const [state, setState] = useState({ press: null, loading: true, error: null })

    useEffect(() => {
        const onData = (snapshot) => setState({
            press: { ...EMPTY_PRESS, ...(snapshot.exists() ? snapshot.data() : {}) },
            loading: false,
            error: null,
        })
        const onError = (error) => {
            console.error('Error fetching press:', error)
            setState({ press: null, loading: false, error: error.message })
        }

        if (realtime) return onSnapshot(pressDoc(), onData, onError)

        let cancelled = false
        getDoc(pressDoc())
            .then(snapshot => { if (!cancelled) onData(snapshot) })
            .catch(error => { if (!cancelled) onError(error) })
        return () => { cancelled = true }
    }, [realtime])

    return state
}

// Agrega ?download a una URL pública de Supabase para que el navegador la descargue en vez de abrirla
export function downloadUrl(url) {
    if (!url || !url.includes('/storage/v1/object/public/')) return url
    return `${url}${url.includes('?') ? '&' : '?'}download`
}
