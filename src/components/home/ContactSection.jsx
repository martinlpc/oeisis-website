import { useState } from 'react'
import { track } from '../../utils/analytics'
import { useLang } from '../../i18n/lang'
import { CONTACT_EMAIL } from '../../config/contact'


const INITIAL = { nombre: '', email: '', motivo: 'Contratación', fecha: '', ciudad: '', mensaje: '' }
// Los valores del motivo quedan en español: así llegan a Netlify, se traduce solo lo que se ve
const REASONS = ['Contratación', 'Prensa', 'Otro']

// Netlify Forms: Netlify detecta el formulario "contacto" en index.html al hacer deploy
// y recibe los envíos en "/". Los mails de aviso se configuran en el panel de Netlify.
const encode = (data) => new URLSearchParams(data).toString()

const inputClass = 'w-full bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-gray-500 focus:border-white focus:outline-none'
const labelClass = 'block text-xs uppercase tracking-widest text-gray-400 mb-2'

export function ContactSection() {
    const [form, setForm] = useState(INITIAL)
    const [status, setStatus] = useState('idle') // idle | sending | sent | error
    const { lang, t } = useLang()
    const BOOKING_EMAIL = CONTACT_EMAIL[lang]

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                // idioma: para saber en qué idioma responder
                body: encode({ 'form-name': 'contacto', 'bot-field': '', ...form, idioma: lang === 'en' ? 'Inglés' : 'Español' }),
            })
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            setStatus('sent')
            track('contacto-enviado', { motivo: form.motivo })
            setForm(INITIAL)
        } catch (error) {
            console.error('Error enviando el formulario:', error)
            setStatus('error')
        }
    }

    return (
        <section id="contacto" className="bg-[#1f1f1f] text-white py-20 md:py-28 px-4 md:px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-16">
                <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{t('contact.title')}</h2>
                    <p className="text-gray-300 leading-relaxed mb-8">
                        {t('contact.intro')}
                    </p>
                    <p className={labelClass}>{t('contact.mail')}</p>
                    <a href={`mailto:${BOOKING_EMAIL}`} className="text-lg break-all underline underline-offset-4 hover:text-gray-300">
                        {BOOKING_EMAIL}
                    </a>
                    <p className={`${labelClass} mt-6`}>{t('contact.production')}</p>
                    <a
                        href="https://instagram.com/ourmusicproductions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg underline underline-offset-4 hover:text-gray-300"
                    >
                        OurMusic Productions
                    </a>
                </div>

                {status === 'sent' ? (
                    <div className="border border-white/15 p-8 self-start" role="status">
                        <p className="text-2xl font-bold mb-3">{t('contact.sentTitle')}</p>
                        <p className="text-gray-300 mb-6">{t('contact.sentBody')}</p>
                        <button
                            type="button"
                            onClick={() => setStatus('idle')}
                            className="text-sm font-semibold underline underline-offset-4 hover:text-gray-300"
                        >
                            {t('contact.sendAnother')}
                        </button>
                    </div>
                ) : (
                    <form name="contacto" onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
                        {/* Trampa para bots: los humanos no la ven */}
                        <p className="hidden">
                            <label>{t('contact.honeypot')} <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
                        </p>

                        <div>
                            <label htmlFor="c-nombre" className={labelClass}>{t('contact.name')}</label>
                            <input id="c-nombre" name="nombre" required value={form.nombre} onChange={handleChange} className={inputClass} autoComplete="name" />
                        </div>
                        <div>
                            <label htmlFor="c-email" className={labelClass}>{t('contact.email')}</label>
                            <input id="c-email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} autoComplete="email" />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="c-motivo" className={labelClass}>{t('contact.reason')}</label>
                            <select id="c-motivo" name="motivo" value={form.motivo} onChange={handleChange} className={`${inputClass} [color-scheme:dark] [&_option]:bg-[#1f1f1f] [&_option]:text-white`}>
                                {REASONS.map(reason => (
                                    <option key={reason} value={reason}>{t(`contact.reason.${reason}`)}</option>
                                ))}
                            </select>
                        </div>
                        {form.motivo === 'Contratación' && (
                            <>
                                <div>
                                    <label htmlFor="c-fecha" className={labelClass}>{t('contact.date')}</label>
                                    <input id="c-fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} className={`${inputClass} [color-scheme:dark]`} />
                                </div>
                                <div>
                                    <label htmlFor="c-ciudad" className={labelClass}>{t('contact.city')}</label>
                                    <input id="c-ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} />
                                </div>
                            </>
                        )}
                        <div className="sm:col-span-2">
                            <label htmlFor="c-mensaje" className={labelClass}>{t('contact.message')}</label>
                            <textarea id="c-mensaje" name="mensaje" required rows={5} value={form.mensaje} onChange={handleChange} className={inputClass} />
                        </div>

                        {status === 'error' && (
                            <p className="sm:col-span-2 text-red-400" role="alert">
                                {t('contact.error', { email: BOOKING_EMAIL })}
                            </p>
                        )}

                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="btn-double-border text-white font-bold py-3 px-10 disabled:opacity-60"
                            >
                                {status === 'sending' ? t('contact.sending') : t('contact.send')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    )
}
