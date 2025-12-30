import { useState, useEffect } from 'react';
export function UnderConstruction() {
    const [lang, setLang] = useState('es')

    useEffect(() => {
        setLang(navigator.language.startsWith('es') ? 'es' : 'en');
    }, []);

    const content = {
        es: {
            title: 'Próximamente',
            subtitle: 'Estamos trabajando en una nueva versión de nuestro sitio',
            description: 'Volveremos pronto con una experiencia mejorada',
            follow: 'Síguenos en redes:',
        },
        en: {
            title: 'Coming Soon',
            subtitle: 'We are working on a new version of our website',
            description: 'We will be back soon with an improved experience',
            follow: 'Follow us:',
        },
    };

    const t = content[lang];

    return (
        <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50">
            <div className="text-center px-4">
                {/* Logo */}
                <svg className="w-full max-w-md mx-auto" viewBox="0 0 100 100"><image width="100" height="100" href="/logo.svg" /></svg>
                <h1 className="text-6xl font-bold mb-4">{t.title}</h1>
                <p className="text-2xl text-gray-300 mb-4">{t.subtitle}</p>
                <p className="text-lg text-gray-400 mb-8">{t.description}</p>
                <div className="space-y-4">
                    <p className="text-gray-500">{t.follow}</p>
                    <div className="flex gap-4 justify-center">
                        <a href="https://instagram.com/oeisisok" target="_blank" rel="noopener noreferrer" className="border border-white bg-black hover:bg-white hover:text-black px-6 py-2 rounded transition">
                            Instagram
                        </a>
                        <a href="https://youtube.com/@oeisis?si=ZUGzsqptoTdGM7_t" target="_blank" rel="noopener noreferrer" className="border border-white bg-white text-black hover:bg-black hover:text-white px-6 py-2 rounded transition">
                            YouTube
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}