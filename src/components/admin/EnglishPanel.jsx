import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { sourceTexts, translationStatus } from '../../i18n/content'
import { useToast } from './useFeedback'
import { Button, Tag, inputClass } from './ui'

const FIELD_LABELS = {
    title: 'Título',
    description: 'Descripción',
    content: 'Texto',
    bioShort: 'Bio corta',
    bioLong: 'Bio completa',
}

// "ctas[0].label" -> "Botón 1"; "facts[1].value" -> "Dato 2 (valor)"
function fieldLabel(key) {
    const match = key.match(/^(\w+)\[(\d+)\]\.(\w+)$/)
    if (!match) return FIELD_LABELS[key] || key
    const [, list, index, sub] = match
    const n = Number(index) + 1
    if (list === 'ctas') return `Botón ${n}`
    if (list === 'facts') return `Dato ${n} (${sub === 'label' ? 'nombre' : 'valor'})`
    return key
}

const STATUS = {
    current: { text: 'Inglés al día', tone: 'default' },
    stale: { text: 'Inglés desactualizado', tone: 'muted' },
    missing: { text: 'Sin inglés', tone: 'muted' },
}

// Etiqueta para las listas del admin: aparece solo si falta traducir
export function EnglishTag({ collection, item }) {
    const status = translationStatus(collection, item)
    if (status === 'current' || status === 'empty') return null
    return <Tag tone="muted">{STATUS[status].text}</Tag>
}

// Traducción al inglés de un documento ya guardado: se puede revisar, corregir a mano o volver a traducir.
// Montarlo con key={item.enHash} para que se reinicie cuando cambia la traducción.
export function EnglishPanel({ collection, item, path }) {
    const toast = useToast()
    const [drafts, setDrafts] = useState(item?.en || {})
    const [busy, setBusy] = useState(false)
    const status = translationStatus(collection, item)
    if (!item || status === 'empty') return null

    const texts = sourceTexts(collection, item)
    const changed = Object.keys(texts).some(key => (drafts[key] || '') !== (item.en?.[key] || ''))
    const ref = doc(db, ...path)

    const saveCorrection = async () => {
        setBusy(true)
        try {
            // La huella no cambia: la corrección vale mientras no se edite el español
            await updateDoc(ref, { en: { ...item.en, ...drafts } })
            toast.success('Corrección guardada')
        } catch (error) {
            toast.error(`No se pudo guardar: ${error.message}`)
        } finally {
            setBusy(false)
        }
    }

    const retranslate = async () => {
        setBusy(true)
        try {
            const { translateDoc } = await import('../../i18n/translateContent')
            const result = await translateDoc(collection, item)
            await updateDoc(ref, result)
            setDrafts(result.en)
            toast.success('Traducido al inglés')
        } catch (error) {
            toast.error(`No se pudo traducir: ${error.message}`)
        } finally {
            setBusy(false)
        }
    }

    return (
        <details className="border border-white/10 rounded p-3 group" open={status !== 'current'}>
            <summary className="cursor-pointer text-sm font-semibold flex items-center gap-2 select-none">
                Inglés
                <Tag tone={STATUS[status].tone}>{STATUS[status].text}</Tag>
            </summary>
            <div className="mt-3 space-y-4">
                {status === 'current' ? (
                    <p className="text-xs text-gray-500">
                        Traducción automática del texto guardado. Si alguna frase quedó rara, corregila acá.
                        Si después cambiás el texto en español, se vuelve a traducir sola al guardar.
                    </p>
                ) : (
                    <p className="text-xs text-gray-400">
                        {status === 'stale'
                            ? 'El texto en español cambió desde la última traducción. Mientras tanto la web en inglés muestra el español.'
                            : 'Todavía no está traducido. Mientras tanto la web en inglés muestra el español.'}
                    </p>
                )}

                {status === 'current' && Object.entries(texts).map(([key, spanish]) => (
                    <label key={key} className="block">
                        <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">{fieldLabel(key)}</span>
                        <span className="block text-xs text-gray-500 mb-1.5 line-clamp-2">{spanish}</span>
                        <textarea
                            value={drafts[key] || ''}
                            onChange={(e) => setDrafts(prev => ({ ...prev, [key]: e.target.value }))}
                            rows={spanish.length > 120 ? 4 : 1}
                            lang="en"
                            className={inputClass}
                        />
                    </label>
                ))}

                <div className="flex flex-wrap gap-2">
                    {status === 'current' && (
                        <Button variant="secondary" onClick={saveCorrection} disabled={busy || !changed}>
                            Guardar corrección
                        </Button>
                    )}
                    <Button variant="secondary" onClick={retranslate} disabled={busy}>
                        {busy ? 'Traduciendo...' : status === 'current' ? 'Volver a traducir' : 'Traducir ahora'}
                    </Button>
                </div>
            </div>
        </details>
    )
}
