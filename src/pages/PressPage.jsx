import { useState } from 'react';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { YouTubeEmbed } from '../components/common/YouTubeEmbed';
import { usePress, downloadUrl } from '../hooks/usePress';
import { useVideos } from '../hooks/useVideos';
import { track } from '../utils/analytics';

const BOOKING_EMAIL = 'jeronimo.blazer@gmail.com';
const DEFAULT_PRESS_KIT = '/oeisis-gacetilla.pdf';

const label = 'text-xs uppercase tracking-[0.3em] text-gray-400 mb-4';
const h2 = 'text-2xl md:text-3xl font-bold mb-6';
const fileButton = 'inline-flex items-center justify-center border border-white/25 hover:bg-white/10 px-5 py-3 font-semibold transition';

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };
    return (
        <button type="button" onClick={() => { copy(); track('prensa-bio-copiada'); }} className="text-sm underline underline-offset-4 text-gray-300 hover:text-white">
            {copied ? 'Copiada' : 'Copiar bio corta'}
        </button>
    );
}

function Section({ title, children }) {
    return (
        <section className="py-12 border-t border-white/10">
            <h2 className={h2}>{title}</h2>
            {children}
        </section>
    );
}

export function PressPage() {
    const { press, loading } = usePress({ realtime: false });
    const { videos } = useVideos({ realtime: false });

    if (loading) {
        return (
            <div className="min-h-screen text-white">
                <Navbar />
                <main className="pt-36 px-4 max-w-5xl mx-auto" aria-busy="true">
                    <div className="h-12 w-1/2 bg-white/5 motion-safe:animate-pulse rounded mb-6" />
                    <div className="h-40 bg-white/5 motion-safe:animate-pulse rounded" />
                </main>
            </div>
        );
    }

    // Si falla la lectura se muestra igual lo que no depende de Firestore (gacetilla y contacto)
    const p = press || {};
    const selectedVideos = (p.videoIds || []).map(id => videos.find(v => v.id === id)).filter(Boolean);
    const pressKit = p.pressKitUrl || DEFAULT_PRESS_KIT;

    return (
        <div className="min-h-screen text-white flex flex-col">
            <title>Prensa · Oeisis</title>
            <meta name="description" content={p.bioShort || 'Kit de prensa de Oeisis, banda tributo a Oasis: bio, fotos, rider técnico y contacto de contrataciones.'} />

            <Navbar />
            <main className="flex-1 pt-28 md:pt-36 pb-20 px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    <header className="pb-12">
                        <p className={label}>Prensa y contrataciones</p>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Kit de prensa</h1>
                        {p.bioShort && (
                            <div className="max-w-3xl">
                                <p className="text-xl text-gray-200 leading-relaxed mb-3">{p.bioShort}</p>
                                <CopyButton text={p.bioShort} />
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-10">
                            <a href={`mailto:${BOOKING_EMAIL}`} className="btn-double-border text-white text-center font-bold py-3 px-6">Escribir para contrataciones</a>
                            {p.riderUrl && <a href={downloadUrl(p.riderUrl)} data-umami-event="prensa-descarga" data-umami-event-archivo="rider" className={fileButton}>Descargar rider (PDF)</a>}
                            <a href={downloadUrl(pressKit)} download={pressKit === DEFAULT_PRESS_KIT ? true : undefined} data-umami-event="prensa-descarga" data-umami-event-archivo="gacetilla" className={fileButton}>Descargar gacetilla (PDF)</a>
                        </div>
                    </header>

                    {p.facts?.length > 0 && (
                        <section className="py-10 border-t border-white/10">
                            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {p.facts.map((fact, i) => (
                                    <div key={i}>
                                        <dt className="text-xs uppercase tracking-widest text-gray-400 mb-1">{fact.label}</dt>
                                        <dd className="text-xl font-semibold">{fact.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    )}

                    {p.bioLong && (
                        <Section title="Bio">
                            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line max-w-3xl">{p.bioLong}</p>
                        </Section>
                    )}

                    {p.photos?.length > 0 && (
                        <Section title="Fotos">
                            <p className="text-gray-400 mb-6">Fotos en alta resolución para difusión. Por favor, incluí el crédito.</p>
                            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {p.photos.map(photo => (
                                    <li key={photo.url}>
                                        <a href={downloadUrl(photo.url)} data-umami-event="prensa-descarga" data-umami-event-archivo="foto" className="group block" aria-label={`Descargar foto${photo.credit ? ` (${photo.credit})` : ''}`}>
                                            <img src={photo.previewUrl || photo.url} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover rounded group-hover:opacity-80 transition" />
                                            <span className="flex justify-between gap-3 mt-2 text-sm">
                                                <span className="text-gray-400 truncate">{photo.credit}</span>
                                                <span className="underline underline-offset-4 shrink-0">Descargar</span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {selectedVideos.length > 0 && (
                        <Section title="En vivo">
                            <ul className="grid md:grid-cols-2 gap-6">
                                {selectedVideos.map(video => (
                                    <li key={video.id}>
                                        <div className="aspect-video rounded-lg overflow-hidden">
                                            <YouTubeEmbed url={video.embedUrl} title={video.title} />
                                        </div>
                                        <p className="mt-2 font-semibold">{video.title}</p>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    <Section title="Contacto">
                        <p className="text-gray-300 mb-2">
                            Contrataciones y prensa: <a href={`mailto:${BOOKING_EMAIL}`} className="underline underline-offset-4">{BOOKING_EMAIL}</a>
                        </p>
                        <p className="text-gray-400">
                            También podés escribirnos desde el <a href="/#contacto" className="underline underline-offset-4">formulario de contacto</a>.
                        </p>
                    </Section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
