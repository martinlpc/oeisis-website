// src/components/ShowsList.jsx
import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';
import { showsService } from '../lib/showsService';

const ShowsList = ({ shows: initialShows }) => {
    const [shows, setShows] = useState(initialShows || []);
    const [loading, setLoading] = useState(false);

    // Este efecto solo es necesario si quieres actualizaciones en tiempo real
    // Si prefieres el renderizado estático, puedes eliminarlo
    useEffect(() => {
        const fetchUpdatedShows = async () => {
            try {
                setLoading(true);
                const freshShows = await showsService.getFutureShows();
                setShows(freshShows);
            } catch (error) {
                console.error("Error actualizando shows:", error);
            } finally {
                setLoading(false);
            }
        };

        // Actualizar datos cuando el componente se monta
        // fetchUpdatedShows();

        // Descomenta esta sección si quieres actualizaciones periódicas
        // const interval = setInterval(fetchUpdatedShows, 60000); // Actualizar cada minuto
        // return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {shows.map((show) => (
                <div
                    key={show.id}
                    className="bg-gray-100 dark:bg-neutral-900 rounded-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h3 className="text-lg md:text-xl font-medium">
                            {show.nombre}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>{formatDate(show.fecha)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>{show.lugar}</span>
                            {show.direccion && (
                                <span className="text-gray-500">
                                    - {show.direccion}
                                </span>
                            )}
                        </div>
                    </div>
                    {show.link && (
                        <a
                            href={show.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                            Comprar Tickets
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ShowsList;