import { Field, Checkbox, inputClass } from './ui'
import { YouTubeField } from './YouTubeField'

// Campos del video, compartidos por crear y editar.
// embedUrl guarda el link tal como se pegó; el sitio lo convierte al reproducir.
export function VideoFields({ data, onChange }) {
    return (
        <div className="space-y-4">
            <Field label="Título">
                <input name="title" value={data.title} onChange={onChange} required className={inputClass} />
            </Field>
            <YouTubeField name="embedUrl" value={data.embedUrl} onChange={onChange} required />
            <Field label="Descripción" hint="Opcional">
                <textarea name="description" value={data.description} onChange={onChange} rows={3} className={inputClass} />
            </Field>
            <Field label="Año" hint="Se usa para ordenar: los más nuevos van primero.">
                <input name="date" value={data.date} onChange={onChange} className={inputClass} placeholder={String(new Date().getFullYear())} inputMode="numeric" />
            </Field>
            <Checkbox name="featured" checked={data.featured} onChange={onChange} label="Destacado" />
        </div>
    )
}
