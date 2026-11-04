// /robots.txt con la URL del sitemap del dominio desde el que se pide (sirve igual con dominio propio)
export default (request) => {
    const origin = new URL(request.url).origin
    // Los deploy previews no se indexan
    const isPreview = /--/.test(new URL(request.url).hostname)
    const body = isPreview
        ? 'User-agent: *\nDisallow: /\n'
        : `User-agent: *\nDisallow: /admin\nDisallow: /login\n\nSitemap: ${origin}/sitemap.xml\n`
    return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } })
}

export const config = { path: '/robots.txt' }
