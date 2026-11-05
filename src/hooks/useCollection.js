import { useEffect, useState } from 'react'
import { watchQuery } from '../firebase/reads'

// spec describe la consulta (ver firebase/reads.js) y tiene que ser estable (constante del módulo)
export function useCollection(spec, { realtime = true, transform, label } = {}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        return watchQuery(
            spec,
            { realtime },
            (docs) => {
                setData(transform ? transform(docs) : docs)
                setLoading(false)
            },
            (err) => {
                console.error(`Error fetching ${label}:`, err)
                setError(err.message)
                setLoading(false)
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spec, realtime])

    return { data, loading, error }
}
