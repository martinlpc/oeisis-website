import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage'
import { extractStorageRefs, findOrphans } from '../../utils/storageRefs'
import { useToast, useConfirm } from './useFeedback'
import { Button } from './ui'

const BUCKETS = ['images', 'videos', 'audio']
const COLLECTIONS = ['photos', 'news', 'featured', 'shows', 'videos']

const formatSize = (bytes) => bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`

const totalSize = (files) => files.reduce((sum, f) => sum + f.size, 0)

export function StorageCleanup() {
    const { listAll, removeMany } = useSupabaseStorage()
    const [status, setStatus] = useState('idle') // idle | scanning | ready | deleting
    const [result, setResult] = useState(null)
    const toast = useToast()
    const confirm = useConfirm()

    const scan = async () => {
        setStatus('scanning')
        setResult(null)

        try {
            // Todas las referencias a Supabase que hay en Firestore
            const refs = new Set()
            for (const name of COLLECTIONS) {
                const snapshot = await getDocs(collection(db, name))
                snapshot.forEach(doc => extractStorageRefs(doc.data(), refs))
            }

            // Todos los archivos de los buckets
            const files = []
            const skipped = []
            for (const bucket of BUCKETS) {
                try {
                    files.push(...await listAll(bucket))
                } catch (error) {
                    skipped.push(`${bucket} (${error.message})`)
                }
            }

            setResult({ ...findOrphans(files, refs), total: files.length, skipped })
            setStatus('ready')
        } catch (error) {
            toast.error(`No se pudo revisar el almacenamiento: ${error.message}`)
            setStatus('idle')
        }
    }

    const deleteOrphans = async () => {
        const { orphans } = result
        const ok = await confirm({
            title: `Borrar ${orphans.length} archivos`,
            message: `Se liberan ${formatSize(totalSize(orphans))} en Supabase. No se puede deshacer.`,
            confirmLabel: 'Borrar archivos',
        })
        if (!ok) return

        setStatus('deleting')
        try {
            let deleted = 0
            for (const bucket of BUCKETS) {
                const paths = orphans.filter(f => f.bucket === bucket).map(f => f.path)
                if (paths.length) deleted += await removeMany(bucket, paths)
            }
            if (deleted === orphans.length) toast.success(`Se borraron ${deleted} archivos`)
            else toast.warning(`Se borraron ${deleted} de ${orphans.length} archivos. Revisá las policies de Supabase.`)
            setResult(null)
        } catch (error) {
            toast.error(`No se pudieron borrar los archivos: ${error.message}`)
        } finally {
            setStatus('idle')
        }
    }

    return (
        <div className="space-y-4">
            <p className="text-gray-400 text-sm">
                Busca archivos en Supabase que ningún contenido usa (fotos, noticias, destacado).
                Los subidos en las últimas 24 horas no se tocan.
            </p>

            <Button onClick={scan} disabled={status === 'scanning' || status === 'deleting'}>
                {status === 'scanning' ? 'Buscando...' : 'Buscar archivos sin uso'}
            </Button>

            {result && (
                <div className="space-y-4">
                    <p>
                        {result.total} archivos en total. {result.orphans.length} sin uso
                        ({formatSize(totalSize(result.orphans))}).
                        {result.recent.length > 0 && ` ${result.recent.length} sin uso pero recientes, se conservan.`}
                    </p>

                    {result.skipped.length > 0 && (
                        <p className="text-sm text-gray-400">No se pudieron leer: {result.skipped.join(', ')}</p>
                    )}

                    {result.orphans.length > 0 && (
                        <>
                            <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
                                {result.orphans.map(file => (
                                    <li key={`${file.bucket}/${file.path}`} className="border border-white/10 rounded overflow-hidden text-xs">
                                        {file.bucket === 'images' ? (
                                            <img src={file.url} alt="" loading="lazy" className="w-full h-24 object-cover" />
                                        ) : (
                                            <div className="w-full h-24 flex items-center justify-center text-gray-500 bg-white/5">{file.bucket}</div>
                                        )}
                                        <p className="p-2 truncate" title={file.path}>{file.path}</p>
                                        <p className="px-2 pb-2 text-gray-400">{formatSize(file.size)}</p>
                                    </li>
                                ))}
                            </ul>

                            <Button variant="danger" onClick={deleteOrphans} disabled={status === 'deleting'}>
                                {status === 'deleting' ? 'Borrando...' : `Borrar ${result.orphans.length} archivos`}
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
