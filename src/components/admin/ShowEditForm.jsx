import { useId } from 'react'
import { Field, Checkbox, FilePicker, Button, inputClass } from './ui'
import { guessTimeZone, guessTimeZoneFromCity, canonicalTimeZone, listTimeZones, nowInZone } from '../../utils/timezones'

// Zonas agrupadas por región (America, Europe...) para el selector
const ZONES_BY_REGION = listTimeZones().reduce((groups, zone) => {
    const region = zone.includes('/') ? zone.split('/')[0] : 'Otras'
    ;(groups[region] ||= []).push(zone)
    return groups
}, {})

const zoneLabel = (zone) => zone.split('/').slice(1).join(' / ').replace(/_/g, ' ') || zone

// Campos del show. data es el estado plano; onChange recibe el evento del input.
export function ShowFields({ data, onChange, flyerUploading = false, onFlyerFiles, onFlyerRemove }) {
    const flyerInputId = useId()
    const setZone = (zone) => onChange({ target: { name: 'timeZone', value: zone } })

    // La zona se sugiere sola: primero por ciudad (Ciudad Juárez, Cancún...), si no por país.
    // Siempre se puede cambiar a mano en el selector.
    const handleCity = (e) => {
        onChange(e)
        const guess = guessTimeZoneFromCity(e.target.value)
        if (guess) setZone(guess)
    }
    const handleCountry = (e) => {
        onChange(e)
        const guess = guessTimeZoneFromCity(data.city) || guessTimeZone(e.target.value)
        if (guess) setZone(guess)
    }

    const zone = canonicalTimeZone(data.timeZone) || data.timeZone
    const now = nowInZone(zone)

    return (
        <div className="space-y-4">
            <Field label="Título">
                <input name="title" value={data.title} onChange={onChange} required className={inputClass} placeholder="Ej: Oeisis en Club A" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha">
                    <input type="date" name="date" value={data.date} onChange={onChange} required className={inputClass} />
                </Field>
                <Field label="Hora">
                    <input type="time" name="time" value={data.time} onChange={onChange} required className={inputClass} />
                </Field>
            </div>

            <Field label="Lugar">
                <input name="venue" value={data.venue} onChange={onChange} required className={inputClass} placeholder="Nombre del lugar" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Dirección">
                    <input name="address" value={data.address} onChange={onChange} className={inputClass} placeholder="Calle y número" />
                </Field>
                <Field label="Ciudad">
                    <input name="city" value={data.city} onChange={handleCity} className={inputClass} />
                </Field>
                <Field label="Provincia">
                    <input name="province" value={data.province} onChange={onChange} className={inputClass} />
                </Field>
                <Field label="País">
                    <input name="country" value={data.country} onChange={handleCountry} className={inputClass} />
                </Field>
            </div>

            <Field
                label="Zona horaria"
                hint={`Se sugiere sola según la ciudad o el país. La fecha y la hora se cargan en hora local del lugar.${now ? ` Ahora allá son las ${now}.` : ''}`}
            >
                <select name="timeZone" value={zone} onChange={onChange} required className={inputClass}>
                    {Object.entries(ZONES_BY_REGION).map(([region, zones]) => (
                        <optgroup key={region} label={region}>
                            {zones.map(z => <option key={z} value={z}>{zoneLabel(z)}</option>)}
                        </optgroup>
                    ))}
                </select>
            </Field>

            <Field label="Link de entradas" hint="Opcional. Si es entrada libre, puede ser un link para reservar lugar.">
                <input type="url" name="ticketLink" value={data.ticketLink} onChange={onChange} className={inputClass} placeholder="https://" />
            </Field>

            <Checkbox name="freeEntry" checked={data.freeEntry} onChange={onChange} label="Entrada libre" />

            <Field label="Descripción" hint="Opcional. Se muestra debajo del lugar.">
                <textarea name="description" value={data.description} onChange={onChange} rows={3} className={inputClass} />
            </Field>

            {onFlyerFiles && (
                <div>
                    <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5">Flyer (opcional)</span>
                    {data.flyer ? (
                        <div className="flex flex-wrap items-start gap-3">
                            <img src={data.flyer} alt="" className="w-28 max-h-40 object-contain bg-black rounded" />
                            {data.flyerOg && (
                                <figure>
                                    <img src={data.flyerOg} alt="" className="w-48 aspect-[1200/630] object-cover rounded border border-white/10" />
                                    <figcaption className="text-xs text-gray-500 mt-1">Al compartir el link</figcaption>
                                </figure>
                            )}
                            <Button variant="danger" onClick={onFlyerRemove}>Quitar flyer</Button>
                        </div>
                    ) : (
                        <FilePicker id={flyerInputId} label="Subir flyer" uploading={flyerUploading} onFiles={onFlyerFiles} />
                    )}
                    <span className="block text-xs text-gray-500 mt-1">Se muestra en la página del show y en la vista previa al compartir el link.</span>
                </div>
            )}
        </div>
    )
}

