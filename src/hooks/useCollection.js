import { useEffect, useState } from 'react'
import { watchQuery } from '../firebase/watchQuery'

// buildQuery tiene que ser estable (definido fuera del componente o memoizado)
export function useCollection(buildQuery, { realtime = true, transform, label } = {}) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        return watchQuery(
            buildQuery(),
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
    }, [buildQuery, realtime])

    return { data, loading, error }
}
