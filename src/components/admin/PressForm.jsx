import { useEffect, useRef, useState } from 'react'
import { usePress, updatePress, EMPTY_PRESS } from '../../hooks/usePress'
import { useVideos } from '../../hooks/useVideos'
import { useSupabaseStorage } from '../../hooks/useSupabaseStorage'
import { compressImage } from '../../utils/compressImage'
import { getThumbnailUrl } from '../../utils/youtube'
import { useToast } from './useFeedback'
import { warnIfNotTranslated } from './englishFeedback'
import { EnglishPanel } from './EnglishPanel'
import { Button, Checkbox, Field, FilePicker, inputClass } from './ui'

const MAX_VIDEOS = 3

function SectionTitle({ children, hint }) {
    return (
        <div className="border-t border-white/10 pt-6">
            <h3 className="font-bold">{children}</h3>
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
    )
}

// Un PDF: link al actual, reemplazar o quitar
function PdfField({ id, label, url, uploading, onFiles, onRemove }) {
    return (
        <div>
            <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">{label}</span>
            {url ? (
                <div className="flex flex-wrap items-center gap-3 border border-white/10 rounded px-3 py-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 truncate text-sm underline underline-offset-4">
                        {decodeURIComponent(url.split('/').pop())}
                    </a>
                    <label className={`text-sm font-semibold border border-white/20 rounded px-3 py-1.5 ${uploading ? 'opacity-50' : 'cursor-pointer hover:bg-white/10'}`}>
                        {uploading ? 'Subiendo...' : 'Reemplazar'}
                        <input type="file" accept="application/pdf" className="sr-only" disabled={uploading}
                            onChange={(e) => { const f = Array.from(e.target.files || []); e.target.value = ''; if (f.length) onFiles(f) }} />
                    </label>
                    <Button variant="danger" onClick={onRemove}>Quitar</Button>
                </div>
            ) : (
                <FilePicker id={id} label="Subir PDF" accept="application/pdf" uploading={uploading} onFiles={onFiles} />
            )}
        </div>
    )
}

export function PressForm() {
    const { press, loading, error } = usePress()
    const { videos } = useVideos()
    const { upload, removeByUrl } = useSupabaseStorage()
    const toast = useToast()

    const [form, setForm] = useState(EMPTY_PRESS)
    const [uploading, setUploading] = useState(null) // 'photos' | 'riderUrl' | 'pressKitUrl'
    const [saving, setSaving] = useState(false)

    // Archivos subidos en esta sesión y todavía no guardados (se borran si se abandona)
    const pendingRef = useRef([])
    // Archivos guardados que se quitaron o reemplazaron (se borran al guardar)
    const removedRef = useRef([])

    useEffect(() => {
        if (press) setForm(press)
    }, [press])

    useEffect(() => {
        return () => {
            pendingRef.current.forEach(url => removeByUrl(url).catch(() => {}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    // Quita un archivo: si se subió en esta sesión se borra ya; si estaba guardado, al guardar
    const dropFile = (url) => {
        if (!url) return
        if (pendingRef.current.includes(url)) {
            pendingRef.current = pendingRef.current.filter(u => u !== url)
            removeByUrl(url).catch(() => {})
        } else {
            removedRef.current.push(url)
        }
    }

    const uploadTracked = async (file, options) => {
        const { url } = await upload(file, options)
        pendingRef.current.push(url)
        return url
    }

    // Fotos: el original sin comprimir para descargar y una versión liviana para mostrar
    const handlePhotoFiles = async (files) => {
        setUploading('photos')
        try {
            for (const file of files) {
                const url = await uploadTracked(file, { compress: false })
                const preview = await compressImage(file, { maxSize: 1200 })
                const previewUrl = preview === file ? url : await uploadTracked(preview, { compress: false })
                setForm(prev => ({ ...prev, photos: [...prev.photos, { url, previewUrl, credit: '' }] }))
            }
        } catch (err) {
            toast.error(`No se pudo subir una foto: ${err.message}`)
        } finally {
            setUploading(null)
        }
    }

    const removePhoto = (index) => {
        const photo = form.photos[index]
        dropFile(photo.url)
        if (photo.previewUrl !== photo.url) dropFile(photo.previewUrl)
        set('photos', form.photos.filter((_, i) => i !== index))
    }

    const setPhotoCredit = (index, credit) => {
        set('photos', form.photos.map((p, i) => i === index ? { ...p, credit } : p))
    }

    const handlePdf = (field) => async ([file]) => {
        setUploading(field)
        try {
            const url = await uploadTracked(file, { compress: false })
            dropFile(form[field])
            set(field, url)
        } catch (err) {
            toast.error(`No se pudo subir el PDF: ${err.message}`)
        } finally {
            setUploading(null)
        }
    }

    const removePdf = (field) => {
        dropFile(form[field])
        set(field, '')
    }

    const setFact = (index, key, value) => {
        set('facts', form.facts.map((f, i) => i === index ? { ...f, [key]: value } : f))
    }

    const toggleVideo = (id) => {
        const selected = form.videoIds.includes(id)
        if (!selected && form.videoIds.length >= MAX_VIDEOS) {
            toast.warning(`Elegí hasta ${MAX_VIDEOS} videos`)
            return
        }
        set('videoIds', selected ? form.videoIds.filter(v => v !== id) : [...form.videoIds, id])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const { bioShort, bioLong, photos, riderUrl, pressKitUrl, videoIds } = form
            const facts = form.facts.filter(f => f.label.trim() && f.value.trim())
            const result = await updatePress({ bioShort, bioLong, facts, photos, riderUrl, pressKitUrl, videoIds })
            removedRef.current.forEach(url => removeByUrl(url).catch(() => {}))
            removedRef.current = []
            pendingRef.current = []
            toast.success('Kit de prensa actualizado')
            warnIfNotTranslated(toast, result)
        } catch (err) {
            toast.error(`No se pudo guardar: ${err.message}`)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="text-gray-400">Cargando...</p>
    if (error) return <p className="text-red-400">Error: {error}</p>

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-400">
                Se publica en <a href="/prensa" target="_blank" rel="noopener noreferrer" className="underline">/prensa</a>.
                Las secciones vacías no se muestran.
            </p>

            <SectionTitle>Bio</SectionTitle>
            <Field label="Bio corta" hint="2 o 3 líneas para flyers y difusión. En la página tiene un botón para copiarla.">
                <textarea value={form.bioShort} onChange={(e) => set('bioShort', e.target.value)} rows={3} className={inputClass} />
            </Field>
            <Field label="Bio larga" hint="Historia de la banda. Dejá una línea en blanco entre párrafos.">
                <textarea value={form.bioLong} onChange={(e) => set('bioLong', e.target.value)} rows={8} className={inputClass} />
            </Field>

            <SectionTitle hint="Ej: Desde · 2015 / Formación · 5 músicos / Duración del show · 2 horas">Datos rápidos</SectionTitle>
            {form.facts.map((fact, index) => (
                <div key={index} className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
                    <input value={fact.label} onChange={(e) => setFact(index, 'label', e.target.value)} className={inputClass} placeholder="Dato" aria-label={`Dato ${index + 1}`} />
                    <input value={fact.value} onChange={(e) => setFact(index, 'value', e.target.value)} className={inputClass} placeholder="Valor" aria-label={`Valor ${index + 1}`} />
                    <Button variant="danger" onClick={() => set('facts', form.facts.filter((_, i) => i !== index))} aria-label={`Quitar dato ${index + 1}`}>✕</Button>
                </div>
            ))}
            <Button variant="secondary" onClick={() => set('facts', [...form.facts, { label: '', value: '' }])}>+ Agregar dato</Button>

            <SectionTitle hint="Se suben sin comprimir para que medios y productores las descarguen en alta. En la página se muestra una versión liviana.">
                Fotos de prensa
            </SectionTitle>
            {form.photos.length > 0 && (
                <ul className="grid sm:grid-cols-2 gap-3">
                    {form.photos.map((photo, index) => (
                        <li key={photo.url} className="border border-white/10 rounded p-2 space-y-2">
                            <img src={photo.previewUrl || photo.url} alt="" className="w-full aspect-[4/3] object-cover rounded" />
                            <div className="flex gap-2">
                                <input value={photo.credit} onChange={(e) => setPhotoCredit(index, e.target.value)} className={inputClass} placeholder="Crédito (ej: Foto: Juan Pérez)" aria-label={`Crédito de la foto ${index + 1}`} />
                                <Button variant="danger" onClick={() => removePhoto(index)} aria-label={`Quitar foto ${index + 1}`}>✕</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <FilePicker id="press-photos" label="Agregar fotos" multiple uploading={uploading === 'photos'} onFiles={handlePhotoFiles} />

            <SectionTitle>Archivos</SectionTitle>
            <PdfField id="press-rider" label="Rider técnico y plano de escenario" url={form.riderUrl}
                uploading={uploading === 'riderUrl'} onFiles={handlePdf('riderUrl')} onRemove={() => removePdf('riderUrl')} />
            <PdfField id="press-kit" label="Gacetilla" url={form.pressKitUrl}
                uploading={uploading === 'pressKitUrl'} onFiles={handlePdf('pressKitUrl')} onRemove={() => removePdf('pressKitUrl')} />
            {!form.pressKitUrl && <p className="text-xs text-gray-500">Mientras no subas una, se usa la gacetilla que ya está en el sitio.</p>}

            <SectionTitle hint={`Hasta ${MAX_VIDEOS}, de los cargados en la tab Videos. Elegí los que mejor muestran el show en vivo.`}>Videos</SectionTitle>
            {videos.length === 0 ? (
                <p className="text-sm text-gray-500">Todavía no hay videos cargados.</p>
            ) : (
                <ul className="space-y-2">
                    {videos.map(video => (
                        <li key={video.id} className="flex items-center gap-3">
                            <img src={getThumbnailUrl(video.embedUrl, 'mqdefault')} alt="" className="w-20 aspect-video object-cover rounded" />
                            <Checkbox checked={form.videoIds.includes(video.id)} onChange={() => toggleVideo(video.id)} label={video.title} />
                        </li>
                    ))}
                </ul>
            )}

            <Button type="submit" disabled={saving || Boolean(uploading)} className="w-full py-3">
                {saving ? 'Guardando...' : 'Guardar kit de prensa'}
            </Button>

            {press && <EnglishPanel key={press.enHash} collection="press" item={press} path={['press', 'current']} />}
        </form>
    )
}
