// Piezas de UI compartidas por todo el panel de administración

export const inputClass =
    'w-full bg-[#141414] border border-white/15 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none disabled:opacity-50 [color-scheme:dark]'

export function Field({ label, hint, error, children, className = '' }) {
    return (
        <label className={`block ${className}`}>
            <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">{label}</span>
            {children}
            {error
                ? <span className="block text-sm text-red-400 mt-1">{error}</span>
                : hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
        </label>
    )
}

export function Checkbox({ label, ...props }) {
    return (
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 accent-white" {...props} />
            {label}
        </label>
    )
}

const VARIANTS = {
    primary: 'bg-white text-black hover:bg-gray-200',
    secondary: 'border border-white/20 text-white hover:bg-white/10',
    danger: 'border border-red-500/40 text-red-300 hover:bg-red-500/10',
}

export function Button({ variant = 'primary', className = '', ...props }) {
    return (
        <button
            type="button"
            className={`px-4 py-2 rounded font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
            {...props}
        />
    )
}

export function Panel({ title, children, className = '' }) {
    return (
        <section className={`min-w-0 border border-white/10 rounded-lg p-4 md:p-6 bg-white/[0.02] ${className}`}>
            {title && <h2 className="text-lg font-bold mb-5">{title}</h2>}
            {children}
        </section>
    )
}

// Botón que abre el selector de archivos
export function FilePicker({ id, label, multiple = false, uploading = false, onFiles }) {
    return (
        <>
            <input
                id={id}
                type="file"
                accept="image/*"
                multiple={multiple}
                disabled={uploading}
                className="sr-only"
                onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    e.target.value = '' // permite volver a elegir el mismo archivo
                    if (files.length) onFiles(files)
                }}
            />
            <label
                htmlFor={id}
                className={`block text-center border border-dashed border-white/25 rounded px-4 py-3 text-sm ${uploading ? 'opacity-50' : 'cursor-pointer hover:bg-white/5'}`}
            >
                {uploading ? 'Subiendo...' : label}
            </label>
        </>
    )
}

// Miniaturas con botón para quitar
export function ImageThumbs({ urls, onRemove }) {
    if (!urls.length) return null
    return (
        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {urls.map((url, index) => (
                <li key={url} className="relative">
                    <img src={url} alt="" className="w-full aspect-square object-cover rounded" />
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                        aria-label={`Quitar imagen ${index + 1}`}
                    >
                        ✕
                    </button>
                </li>
            ))}
        </ul>
    )
}

export function Tag({ children, tone = 'default' }) {
    const tones = {
        default: 'border-white/30 text-gray-200',
        muted: 'border-white/15 text-gray-400',
    }
    return <span className={`inline-block border text-[11px] uppercase tracking-widest px-1.5 py-0.5 rounded ${tones[tone]}`}>{children}</span>
}

export function StatusText({ children, error = false }) {
    return <p className={error ? 'text-red-400' : 'text-gray-400'}>{children}</p>
}
