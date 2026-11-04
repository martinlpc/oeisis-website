import { useEffect, useState } from 'react'

const LINKS = [
    { href: '/#upcoming-shows', label: 'Shows' },
    { href: '/#noticias', label: 'Noticias' },
    { href: '/#videos', label: 'Videos' },
    { href: '/#fotos', label: 'Fotos' },
    { href: '/#contacto', label: 'Contacto' },
]

// nextShow: el próximo show; si tiene link de entradas, aparece el botón "Entradas"
export function Navbar({ nextShow }) {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (!open) return
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const solid = scrolled || open
    const ticketLink = nextShow?.ticketLink

    const ticketsButton = ticketLink && (
        <a
            href={ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-double-border text-white text-sm font-semibold px-4 py-2"
        >
            {nextShow.freeEntry ? 'Reservar' : 'Entradas'}
        </a>
    )

    return (
        <header
            className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solid ? 'bg-[#141414]/95 backdrop-blur border-b border-white/10' : 'bg-transparent'}`}
        >
            <nav className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between" aria-label="Principal">
                <a href="/#top" className="block w-16 h-8" aria-label="Oeisis, ir al inicio" onClick={() => setOpen(false)}>
                    <svg className="w-full h-full" viewBox="0 30 100 50" aria-hidden="true">
                        <image width="100" height="100" href="/logo.svg" />
                    </svg>
                </a>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-6 text-sm uppercase tracking-widest">
                        {LINKS.map(link => (
                            <li key={link.href}>
                                <a href={link.href} className="text-gray-300 hover:text-white transition">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {ticketsButton}
                </div>

                {/* Mobile */}
                <div className="flex md:hidden items-center gap-3">
                    {ticketsButton}
                    <button
                        type="button"
                        onClick={() => setOpen(o => !o)}
                        className="p-2 text-white"
                        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            {open
                                ? <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                                : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
                        </svg>
                    </button>
                </div>
            </nav>

            {open && (
                <ul id="mobile-menu" className="md:hidden border-t border-white/10 px-4 py-2">
                    {LINKS.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="block py-3 text-lg uppercase tracking-widest text-gray-200 hover:text-white"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </header>
    )
}
