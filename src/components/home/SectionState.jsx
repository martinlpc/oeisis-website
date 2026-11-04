// Estados de carga y error con la misma forma que la sección real:
// mantienen el id (para los links del menú) y el alto, así la página no salta.

const TITLE_CLASS = 'text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center'

function SkeletonBlocks({ variant, count }) {
    if (variant === 'grid') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }, (_, i) => (
                    <div key={i} className="aspect-video rounded-lg bg-white/5 motion-safe:animate-pulse" />
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="h-48 rounded-lg bg-white/5 motion-safe:animate-pulse" />
            ))}
        </div>
    )
}

export function SectionSkeleton({ id, title, className = '', variant = 'list', count = 2 }) {
    return (
        <section id={id} aria-busy="true" className={`min-h-screen text-white py-20 px-4 ${className}`}>
            <div className={`${variant === 'grid' ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}>
                {title && <h2 className={TITLE_CLASS}>{title}</h2>}
                <SkeletonBlocks variant={variant} count={count} />
                <span className="sr-only">Cargando…</span>
            </div>
        </section>
    )
}

export function SectionError({ id, title, className = '', what }) {
    return (
        <section id={id} className={`text-white py-20 px-4 text-center ${className}`}>
            {title && <h2 className={TITLE_CLASS}>{title}</h2>}
            <p className="text-gray-400 text-lg">No pudimos cargar {what}. Probá recargar la página.</p>
        </section>
    )
}
