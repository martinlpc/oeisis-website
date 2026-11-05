import { useState } from 'react';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { YouTubeEmbed } from '../components/common/YouTubeEmbed';
import { usePress, downloadUrl } from '../hooks/usePress';
import { useVideos } from '../hooks/useVideos';
import { track } from '../utils/analytics';
import { useLang } from '../i18n/lang';
import { localize } from '../i18n/content';

const BOOKING_EMAIL = 'jeronimo.blazer@gmail.com';
const DEFAULT_PRESS_KIT = '/oeisis-gacetilla.pdf';

const label = 'text-xs uppercase tracking-[0.3em] text-gray-400 mb-4';
const h2 = 'text-2xl md:text-3xl font-bold mb-6';
const fileButton = 'inline-flex items-center justify-center border border-white/25 hover:bg-white/10 px-5 py-3 font-semibold transition';

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const { t } = useLang();
    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };
    return (
        <button type="button" onClick={() => { copy(); track('prensa-bio-copiada'); }} className="text-sm underline underline-offset-4 text-gray-300 hover:text-white">
            {copied ? t('press.copied') : t('press.copyBio')}
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
    const { lang, t, path } = useLang();

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
    const p = localize('press', press, lang) || {};
    const selectedVideos = (p.videoIds || []).map(id => videos.find(v => v.id === id)).filter(Boolean).map(v => localize('videos', v, lang));
    const pressKit = p.pressKitUrl || DEFAULT_PRESS_KIT;

    return (
        <div className="min-h-screen text-white flex flex-col">
            <title>{t('press.pageTitle')}</title>
            <meta name="description" content={p.bioShort || t('press.metaDefault')} />

            <Navbar />
            <main className="flex-1 pt-28 md:pt-36 pb-20 px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    <header className="pb-12">
                        <p className={label}>{t('press.label')}</p>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">{t('press.title')}</h1>
                        {p.bioShort && (
                            <div className="max-w-3xl">
                                <p className="text-xl text-gray-200 leading-relaxed mb-3">{p.bioShort}</p>
                                <CopyButton text={p.bioShort} />
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-10">
                            <a href={`mailto:${BOOKING_EMAIL}`} className="btn-double-border text-white text-center font-bold py-3 px-6">{t('press.book')}</a>
                            {p.riderUrl && <a href={downloadUrl(p.riderUrl)} data-umami-event="prensa-descarga" data-umami-event-archivo="rider" className={fileButton}>{t('press.rider')}</a>}
                            <a href={downloadUrl(pressKit)} download={pressKit === DEFAULT_PRESS_KIT ? true : undefined} data-umami-event="prensa-descarga" data-umami-event-archivo="gacetilla" className={fileButton}>{t('press.kit')}</a>
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
                        <Section title={t('press.bio')}>
                            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line max-w-3xl">{p.bioLong}</p>
                        </Section>
                    )}

                    {p.photos?.length > 0 && (
                        <Section title={t('press.photos')}>
                            <p className="text-gray-400 mb-6">{t('press.photosHint')}</p>
                            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {p.photos.map(photo => (
                                    <li key={photo.url}>
                                        <a href={downloadUrl(photo.url)} data-umami-event="prensa-descarga" data-umami-event-archivo="foto" className="group block" aria-label={`${t('press.downloadPhoto')}${photo.credit ? ` (${photo.credit})` : ''}`}>
                                            <img src={photo.previewUrl || photo.url} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover rounded group-hover:opacity-80 transition" />
                                            <span className="flex justify-between gap-3 mt-2 text-sm">
                                                <span className="text-gray-400 truncate">{photo.credit}</span>
                                                <span className="underline underline-offset-4 shrink-0">{t('press.download')}</span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {selectedVideos.length > 0 && (
                        <Section title={t('press.live')}>
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

                    <Section title={t('press.contact')}>
                        <p className="text-gray-300 mb-2">
                            {t('press.contactLine')} <a href={`mailto:${BOOKING_EMAIL}`} className="underline underline-offset-4">{BOOKING_EMAIL}</a>
                        </p>
                        <p className="text-gray-400">
                            {t('press.formBefore')}<a href={path('/#contacto')} className="underline underline-offset-4">{t('press.formLink')}</a>{t('press.formAfter')}
                        </p>
                    </Section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
