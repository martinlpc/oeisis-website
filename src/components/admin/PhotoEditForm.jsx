import { Field, inputClass } from './ui'

// Campos de texto de la foto (la imagen se maneja aparte)
export function PhotoFields({ data, onChange }) {
    return (
        <div className="space-y-4">
            <Field label="Título" hint="Se muestra al pasar el mouse y en el visor.">
                <input name="title" value={data.title} onChange={onChange} required className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Año" hint="Ordena la galería">
                    <input name="date" value={data.date} onChange={onChange} className={inputClass} placeholder={String(new Date().getFullYear())} inputMode="numeric" />
                </Field>
                <Field label="Álbum" hint="Opcional">
                    <input name="album" value={data.album} onChange={onChange} className={inputClass} />
                </Field>
            </div>
        </div>
    )
}
