export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/** Grid principal */}
                <div className="grid md:grid-cols-3 gap-12 mb-12 justify-items-center md:justify-items-start">
                    {/** Logo + copy + gacetilla */}
                    <div className="text-center md:text-left">
                        <div className="w-24 md:w-28 mx-auto md:mx-0 mb-6">
                            <svg className="w-full" viewBox="0 30 100 50"><image width="100" height="100" href="/logo.svg" /></svg>
                        </div>

                        <p className="text-sm leading-relaxed">
                            Tributo a Oasis, desde Argentina para todo el mundo. La mejor experiencia del clásico británico con una propuesta única y memorable.
                        </p>

                        <a
                            href="/oeisis-gacetilla.pdf"
                            download
                            className="inline-block mt-4 text-gray-400 hover:text-white hover:underline transition text-sm"
                        >
                            📄 Descargar Gacetilla
                        </a>
                    </div>

                    {/* Redes Sociales */}
                    <div className="text-center md:text-left">
                        <h3 className="text-white font-bold text-lg mb-4">Seguinos</h3>
                        <div className="flex gap-4">
                            {/* YOUTUBE */}
                            <a href="https://youtube.com/oeisis" target="_blank" class="hover:text-yellow-500 transition-colors" aria-label="Youtube logo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                                    ></path>
                                </svg>
                            </a>
                            {/* INSTAGRAM */}
                            <a href="https://instagram.com/oeisisok" target="_blank" class="hover:text-yellow-500 transition-colors" aria-label="Instagram logo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881" /></svg>
                            </a>
                            {/* TIKTOK */}
                            <a href="https://tiktok.com/@oeisisok" target="_blank" class="hover:text-yellow-500 transition-colors" aria-label="TikTok logo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 3 3 0 0 1 .88.13V9.4a7 7 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a5 5 0 0 1-1-.1z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="text-center md:text-left">
                        <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
                        <div className="space-y-2 text-sm">
                            <a
                                href="mailto:jeronimo.blazer@gmail.com"
                                className="block hover:text-white transition"
                            >
                                📧 jeronimo.blazer@gmail.com
                            </a>
                            <a
                                href="https://instagram.com/ourmusicproductions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:text-white transition"
                            >
                                🎵 OurMusic Productions
                            </a>
                        </div>
                    </div>
                </div>
                {/* Disclaimer */}
                <div className="border-t border-gray-800 pt-8 mb-8">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Oasis, la banda mundialmente conocida, y todas las marcas relacionadas son marcas registradas y pertenecen a sus respectivos dueños. Este sitio no está
                        afiliado, asociado, autorizado, respaldado o patrocinado por los propietarios de las marca Oasis.
                        <br />
                        <br />
                        Oasis, the world-renowned band, and all related trademarks are registered trademarks and belong to their respective owners. This site is not affiliated,
                        associated, authorized, endorsed by, or in any way officially connected with the owners of the Oasis trademarks.
                    </p>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
                    <p>&copy; {currentYear} OEISIS. Todos los derechos reservados.</p>
                    <p className="mt-2">
                        👨🏻‍💻Diseño y desarrollo por{' '}
                        <a href="https://github.com/martinlpc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                            Martín Pacheco
                        </a>
                    </p>
                </div>

            </div>
        </footer >
    )
}