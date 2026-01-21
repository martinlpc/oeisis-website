import { useState } from 'react';

export function PhotoCard({ photo }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="relative overflow-hidden rounded-lg cursor-pointer group h-48"
            >
                <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end p-4">
                    <div>
                        <h3 className="text-white font-bold opacity-0 group-hover:opacity-100 transition">
                            {photo.title}
                        </h3>
                        <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition">
                            {photo.date}
                        </p>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition z-10"
                        >
                            ✕
                        </button>
                        <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-auto rounded-lg"
                        />
                        <div className="mt-4 text-center">
                            <h3 className="text-white text-xl font-bold">{photo.title}</h3>
                            <p className="text-gray-400">{photo.date}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}