import { Field, Checkbox, FilePicker, ImageThumbs, inputClass } from './ui'
import { YouTubeField } from './YouTubeField'

// Campos de la noticia, compartidos por crear y editar.
// Las imágenes se manejan afuera (subida y borrado) y llegan por props.
export function NewsFields({ idPrefix, data, onChange, images, uploading, onImageFiles, onRemoveImage }) {
    return (
        <div className="space-y-4">
            <Field label="Tipo">
                <select name="type" value={data.type} onChange={onChange} className={inputClass}>
                    <option value="news">Noticia (con imágenes)</option>
                    <option value="interview">Entrevista (con video)</option>
                </select>
            </Field>

            <Field label="Título">
                <input name="title" value={data.title} onChange={onChange} required className={inputClass} />
            </Field>

            <Field label="Texto" hint="Dejá una línea en blanco entre párrafos. Los links se convierten solos.">
                <textarea name="content" value={data.content} onChange={onChange} required rows={7} className={inputClass} />
            </Field>

            {data.type === 'interview' ? (
                <YouTubeField label="Video de la entrevista" name="externalLink" value={data.externalLink} onChange={onChange} />
            ) : (
                <div>
                    <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">Imágenes</span>
                    <FilePicker id={`${idPrefix}-images`} label="Agregar imágenes" multiple uploading={uploading} onFiles={onImageFiles} />
                    <ImageThumbs urls={images} onRemove={onRemoveImage} />
                </div>
            )}

            <Checkbox name="featured" checked={data.featured} onChange={onChange} label="Destacada (aparece primero)" />
        </div>
    )
}
