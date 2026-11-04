import { getYouTubeId, getThumbnailUrl, getStartSeconds } from '../../utils/youtube'
import { Field, inputClass } from './ui'

// Campo para pegar un link de YouTube en cualquier formato (watch, youtu.be, shorts, embed...)
// Muestra la miniatura para confirmar que es el video correcto.
export function YouTubeField({ label = 'Link de YouTube', name, value, onChange, required = false }) {
    const touched = Boolean(value)
    const valid = Boolean(getYouTubeId(value))
    const start = valid ? getStartSeconds(value) : 0

    return (
        <div>
            <Field
                label={label}
                hint="Pegá el link como lo copiás de YouTube. Si tiene minuto de inicio (t=), se respeta."
                error={touched && !valid ? 'No reconozco ese link como un video de YouTube' : null}
            >
                <input
                    type="url"
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={inputClass}
                    placeholder="https://www.youtube.com/watch?v=..."
                />
            </Field>
            {valid && (
                <div className="mt-3 flex items-center gap-3">
                    <img src={getThumbnailUrl(value, 'mqdefault')} alt="" className="w-32 aspect-video object-cover rounded" />
                    <p className="text-xs text-gray-400">
                        Video {getYouTubeId(value)}
                        {start > 0 && <><br />Empieza en {Math.floor(start / 60)}:{String(start % 60).padStart(2, '0')}</>}
                    </p>
                </div>
            )}
        </div>
    )
}
