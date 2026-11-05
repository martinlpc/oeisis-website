import { useLang } from '../../../i18n/lang';

export function PhotoCard({ photo, onOpen }) {
    const { t } = useLang();
    return (
        <button
            type="button"
            onClick={onOpen}
            className="relative block w-full aspect-square overflow-hidden rounded-lg group focus-visible:outline-2 focus-visible:outline-white"
            aria-label={t('photos.view', { title: photo.title })}
        >
            <img
                src={photo.thumbUrl || photo.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover motion-safe:group-hover:scale-110 transition duration-300"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 group-focus-visible:bg-black/40 transition flex items-end p-4 text-left">
                <span className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition">
                    <span className="block text-white font-bold">{photo.title}</span>
                    <span className="block text-gray-300 text-sm">{photo.date}</span>
                </span>
            </span>
        </button>
    );
}
