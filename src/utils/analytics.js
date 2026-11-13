// Umami Cloud: estadísticas sin cookies (no hace falta banner de consentimiento).
// Se activa solo si está configurado VITE_UMAMI_WEBSITE_ID; en local y sin la variable no carga nada.
//
// Eventos: los links con data-umami-event="nombre" se registran solos al hacer click.
// Para otros casos (envío de formulario, descargas generadas por código) se usa track().

const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID
const SCRIPT_SRC = import.meta.env.VITE_UMAMI_SRC || 'https://cloud.umami.is/script.js'
// Opcional: dominios donde se mide, separados por coma (ej: "oeisis.com"). Sin valor, mide en todos.
const DOMAINS = import.meta.env.VITE_UMAMI_DOMAINS

const PRIVATE_PATHS = /^\/(admin|login)(\/|$)/

export function loadAnalytics() {
    if (!WEBSITE_ID || typeof document === 'undefined') return

    // El panel de la banda no cuenta como visita
    window.oeisisUmamiBeforeSend = (type, payload) => (PRIVATE_PATHS.test(payload?.url || '') ? false : payload)

    const script = document.createElement('script')
    script.defer = true
    script.src = SCRIPT_SRC
    script.dataset.websiteId = WEBSITE_ID
    script.dataset.beforeSend = 'oeisisUmamiBeforeSend'
    if (DOMAINS) script.dataset.domains = DOMAINS
    document.head.appendChild(script)
}

export function track(event, data) {
    try {
        window.umami?.track(event, data)
    } catch {
        // las estadísticas nunca rompen el sitio
    }
}
