// /sitemap.xml generado al pedirlo: home, prensa y la página de cada show, en español y en inglés.
// Cada URL indica su versión en el otro idioma (hreflang), como pide Google para sitios multilingües.
import { listDocuments } from '../lib/firestore.js'
import { localizePath } from '../../src/i18n/paths.js'

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default async (request) => {
    const origin = new URL(request.url).origin
    const shows = await listDocuments('shows')

    const pages = [
        { path: '/', priority: '1.0' },
        { path: '/prensa', priority: '0.6' },
        ...shows.map(show => ({
            path: `/shows/${encodeURIComponent(show.id)}`,
            lastmod: show.updateTime?.slice(0, 10),
            priority: '0.8',
        })),
    ]

    const entries = pages.flatMap(page => {
        const es = `${origin}${localizePath('es', page.path)}`
        const en = `${origin}${localizePath('en', page.path)}`
        const links = [
            `<xhtml:link rel="alternate" hreflang="es" href="${escape(es)}"/>`,
            `<xhtml:link rel="alternate" hreflang="en" href="${escape(en)}"/>`,
            `<xhtml:link rel="alternate" hreflang="x-default" href="${escape(es)}"/>`,
        ].join('')
        return [es, en].map(loc =>
            `  <url><loc>${escape(loc)}</loc>${links}${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}<priority>${page.priority}</priority></url>`,
        )
    })

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
    return new Response(body, {
        headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
    })
}

export const config = { path: '/sitemap.xml' }
