import { useState } from 'react'

const BOOKING_EMAIL = 'jeronimo.blazer@gmail.com'

const INITIAL = { nombre: '', email: '', motivo: 'Contratación', fecha: '', ciudad: '', mensaje: '' }

// Netlify Forms: Netlify detecta el formulario "contacto" en index.html al hacer deploy
// y recibe los envíos en "/". Los mails de aviso se configuran en el panel de Netlify.
const encode = (data) => new URLSearchParams(data).toString()

const inputClass = 'w-full bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-gray-500 focus:border-white focus:outline-none'
const labelClass = 'block text-xs uppercase tracking-widest text-gray-400 mb-2'

export function ContactSection() {
    const [form, setForm] = useState(INITIAL)
    const [status, setStatus] = useState('idle') // idle | sending | sent | error

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
                body: encode({ 'form-name': 'contacto', 'bot-field': '', ...form }),
            })
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            setStatus('sent')
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
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Contacto</h2>
                    <p className="text-gray-300 leading-relaxed mb-8">
                        Para contrataciones, prensa o cualquier consulta, escribinos por el formulario o directamente por mail.
                    </p>
                    <p className={labelClass}>Mail</p>
                    <a href={`mailto:${BOOKING_EMAIL}`} className="text-lg break-all underline underline-offset-4 hover:text-gray-300">
                        {BOOKING_EMAIL}
                    </a>
                    <p className={`${labelClass} mt-6`}>Producción</p>
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
                        <p className="text-2xl font-bold mb-3">Mensaje enviado</p>
                        <p className="text-gray-300 mb-6">Gracias por escribirnos. Te respondemos por mail.</p>
                        <button
                            type="button"
                            onClick={() => setStatus('idle')}
                            className="text-sm font-semibold underline underline-offset-4 hover:text-gray-300"
                        >
                            Enviar otro mensaje
                        </button>
                    </div>
                ) : (
                    <form name="contacto" onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
                        {/* Trampa para bots: los humanos no la ven */}
                        <p className="hidden">
                            <label>No completar: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
                        </p>

                        <div>
                            <label htmlFor="c-nombre" className={labelClass}>Nombre</label>
                            <input id="c-nombre" name="nombre" required value={form.nombre} onChange={handleChange} className={inputClass} autoComplete="name" />
                        </div>
                        <div>
                            <label htmlFor="c-email" className={labelClass}>Email</label>
                            <input id="c-email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} autoComplete="email" />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="c-motivo" className={labelClass}>Motivo</label>
                            <select id="c-motivo" name="motivo" value={form.motivo} onChange={handleChange} className={inputClass}>
                                <option>Contratación</option>
                                <option>Prensa</option>
                                <option>Otro</option>
                            </select>
                        </div>
                        {form.motivo === 'Contratación' && (
                            <>
                                <div>
                                    <label htmlFor="c-fecha" className={labelClass}>Fecha tentativa (opcional)</label>
                                    <input id="c-fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} className={`${inputClass} [color-scheme:dark]`} />
                                </div>
                                <div>
                                    <label htmlFor="c-ciudad" className={labelClass}>Ciudad (opcional)</label>
                                    <input id="c-ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} className={inputClass} />
                                </div>
                            </>
                        )}
                        <div className="sm:col-span-2">
                            <label htmlFor="c-mensaje" className={labelClass}>Mensaje</label>
                            <textarea id="c-mensaje" name="mensaje" required rows={5} value={form.mensaje} onChange={handleChange} className={inputClass} />
                        </div>

                        {status === 'error' && (
                            <p className="sm:col-span-2 text-red-400" role="alert">
                                No pudimos enviar el mensaje. Probá de nuevo o escribinos a {BOOKING_EMAIL}.
                            </p>
                        )}

                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="btn-double-border text-white font-bold py-3 px-10 disabled:opacity-60"
                            >
                                {status === 'sending' ? 'Enviando...' : 'Enviar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    )
}
