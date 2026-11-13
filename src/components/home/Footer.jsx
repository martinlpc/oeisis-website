import { useLang } from '../../i18n/lang'
import { CONTACT_EMAIL } from '../../config/contact'

const DEV_EMAIL = 'mlpachecodev@gmail.com'

const SITE_LINKS = [
    { href: '/#upcoming-shows', label: 'nav.shows' },
    { href: '/#noticias', label: 'nav.news' },
    { href: '/#videos', label: 'nav.videos' },
    { href: '/#fotos', label: 'nav.photos' },
    { href: '/prensa', label: 'footer.press' },
]

const SOCIAL = [
    {
        name: 'YouTube',
        handle: '@oeisis',
        href: 'https://www.youtube.com/@oeisis',
        icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
    },
    {
        name: 'Instagram',
        handle: '@oeisisok',
        href: 'https://instagram.com/oeisisok',
        icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881',
    },
    {
        name: 'TikTok',
        handle: '@oeisisok',
        href: 'https://tiktok.com/@oeisisok',
        icon: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 3 3 0 0 1 .88.13V9.4a7 7 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a5 5 0 0 1-1-.1z',
    },
]

const label = 'text-xs uppercase tracking-[0.3em] text-gray-500 mb-5'
const link = 'text-gray-300 hover:text-white transition'

export function Footer() {
    const currentYear = new Date().getFullYear()
    const { lang, t, path } = useLang()
    const BOOKING_EMAIL = CONTACT_EMAIL[lang]

    return (
        <footer className="bg-[#141414] text-gray-300 border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                {/* Marca y contrataciones */}
                <div className="py-14 md:py-20 grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 md:items-end border-b border-white/10">
                    <div>
                        <a href={path('/#top')} className="block w-36 md:w-44 mb-6" aria-label={t('nav.home')}>
                            <svg className="w-full" viewBox="0 30 100 50" aria-hidden="true"><image width="100" height="100" href="/logo.svg" /></svg>
                        </a>
                        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-md">{t('footer.tagline')}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
                        <a
                            href={`mailto:${BOOKING_EMAIL}`}
                            data-umami-event="contratar"
                            data-umami-event-origen="footer"
                            className="btn-double-border text-white text-center font-bold py-3 px-8 whitespace-nowrap"
                        >
                            {t('footer.book')}
                        </a>
                        <a
                            href={path('/prensa')}
                            className="border border-white/25 hover:bg-white/10 text-white text-center font-semibold py-3 px-8 whitespace-nowrap transition"
                        >
                            {t('footer.pressKit')}
                        </a>
                    </div>
                </div>

                {/* Columnas */}
                <div className="py-12 grid grid-cols-2 md:grid-cols-[1fr_1fr_1.4fr] gap-x-6 gap-y-10">
                    <nav aria-label={t('footer.site')}>
                        <h2 className={label}>{t('footer.site')}</h2>
                        <ul className="space-y-3">
                            {SITE_LINKS.map(item => (
                                <li key={item.href}><a href={path(item.href)} className={link}>{t(item.label)}</a></li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className={label}>{t('footer.follow')}</h2>
                        <ul className="space-y-3">
                            {SOCIAL.map(item => (
                                <li key={item.name}>
                                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-3 ${link}`}>
                                        <svg className="w-5 h-5 shrink-0 text-gray-500 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d={item.icon} />
                                        </svg>
                                        <span>{item.name}</span>
                                        <span className="hidden sm:inline text-gray-500 text-sm">{item.handle}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <h2 className={label}>{t('footer.contact')}</h2>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm text-gray-500 mb-0.5">{t('footer.bookingLabel')}</dt>
                                <dd><a href={`mailto:${BOOKING_EMAIL}`} className={`${link} break-all`}>{BOOKING_EMAIL}</a></dd>
                            </div>
                            <div>
                                <dt className="text-sm text-gray-500 mb-0.5">{t('contact.production')}</dt>
                                <dd><a href="https://instagram.com/ourmusicproductions" target="_blank" rel="noopener noreferrer" className={link}>OurMusic Productions</a></dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Aviso legal y créditos */}
                <div className="py-8 border-t border-white/10 text-xs text-gray-500 leading-relaxed">
                    <p className="max-w-4xl">{t('footer.disclaimer')}</p>
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-2">
                        <p>&copy; {currentYear} Oeisis. {t('footer.rights')}</p>
                        <p>
                            Design &amp; development by{' '}
                            <a href="https://martin-pacheco.vercel.app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                                {'< MP />'}
                            </a>
                            <span aria-hidden="true"> · </span>
                            <a href={`mailto:${DEV_EMAIL}`} className="text-gray-400 hover:text-white transition">
                                {DEV_EMAIL}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
