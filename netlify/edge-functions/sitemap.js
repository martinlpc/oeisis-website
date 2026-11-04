// /sitemap.xml generado al pedirlo: home, prensa y la página de cada show
import { listDocuments } from '../lib/firestore.js'

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default async (request) => {
    const origin = new URL(request.url).origin
    const shows = await listDocuments('shows')

    const urls = [
        { loc: `${origin}/`, priority: '1.0' },
        { loc: `${origin}/prensa`, priority: '0.6' },
        ...shows.map(show => ({
            loc: `${origin}/shows/${encodeURIComponent(show.id)}`,
            lastmod: show.updateTime?.slice(0, 10),
            priority: '0.8',
        })),
    ]

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${escape(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`
    return new Response(body, {
        headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' },
    })
}

export const config = { path: '/sitemap.xml' }
