import { useEffect, useState } from 'react'
import { watchDoc } from '../firebase/reads'
import { prepareEnglish } from '../i18n/prepareEnglish'

// Kit de prensa: un solo documento, press/current
const PRESS = ['press', 'current']

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
    const { data: changes, translated } = await prepareEnglish('press', data, PRESS)
    const fs = await import('../firebase/writes')
    await fs.set(PRESS, { ...changes, updatedAt: fs.serverTimestamp() }, { merge: true })
    return { translated }
}

// realtime para el admin; lectura única para la página pública
export function usePress({ realtime = true } = {}) {
    const [state, setState] = useState({ press: null, loading: true, error: null })

    useEffect(() => watchDoc(
        PRESS,
        { realtime },
        data => setState({ press: { ...EMPTY_PRESS, ...(data || {}) }, loading: false, error: null }),
        error => {
            console.error('Error fetching press:', error)
            setState({ press: null, loading: false, error: error.message })
        },
    ), [realtime])

    return state
}

// Agrega ?download a una URL pública de Supabase para que el navegador la descargue en vez de abrirla
export function downloadUrl(url) {
    if (!url || !url.includes('/storage/v1/object/public/')) return url
    return `${url}${url.includes('?') ? '&' : '?'}download`
}
