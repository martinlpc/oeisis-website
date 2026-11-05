import { Link } from 'react-router-dom'
import { useLang } from '../i18n/lang'

export function NotFound() {
    const { t, path } = useLang()
    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 text-center">
            <title>{t('notFound.pageTitle')}</title>
            <svg className="w-40 h-20 mb-8" viewBox="0 30 100 50" aria-hidden="true"><image width="100" height="100" href="/logo.svg" /></svg>
            <h1 className="text-3xl font-bold mb-3">{t('notFound.title')}</h1>
            <p className="text-gray-400 mb-8">{t('notFound.hint')}</p>
            <Link to={path('/')} className="btn-double-border text-white font-bold py-3 px-8">{t('notFound.back')}</Link>
        </div>
    )
}
