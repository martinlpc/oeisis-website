import { Button } from './ui'

// Fila de las listas del admin. thumbnail y tags son opcionales.
export function ListItem({ title, meta, text, thumbnail, tags, onEdit, onDelete }) {
    return (
        <div className="flex gap-4 items-start">
            {thumbnail && (
                <img src={thumbnail} alt="" loading="lazy" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                {tags && <div className="flex flex-wrap gap-1.5 mb-1.5">{tags}</div>}
                <h3 className="font-bold truncate">{title}</h3>
                {meta && <p className="text-sm text-gray-400 truncate">{meta}</p>}
                {text && <p className="text-sm text-gray-400 line-clamp-2 mt-1">{text}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button variant="secondary" onClick={onEdit}>Editar</Button>
                <Button variant="danger" onClick={onDelete}>Eliminar</Button>
            </div>
        </div>
    )
}

// Contenedor de cada ítem: resalta el que se está editando
export function ListRow({ editing, dimmed, children }) {
    return (
        <li className={`border rounded-lg p-4 ${editing ? 'border-white/40 bg-white/[0.03]' : 'border-white/10'} ${dimmed && !editing ? 'opacity-60' : ''}`}>
            {children}
        </li>
    )
}

// Botones Guardar / Cancelar de los formularios de edición
export function EditActions({ saving, onCancel }) {
    return (
        <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
            <Button variant="secondary" onClick={onCancel} className="flex-1">Cancelar</Button>
        </div>
    )
}
