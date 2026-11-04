import { Field, Checkbox, inputClass } from './ui'

// Campos del show. data es el estado plano; onChange recibe el evento del input.
export function ShowFields({ data, onChange }) {
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
                    <input name="city" value={data.city} onChange={onChange} className={inputClass} />
                </Field>
                <Field label="Provincia">
                    <input name="province" value={data.province} onChange={onChange} className={inputClass} />
                </Field>
                <Field label="País">
                    <input name="country" value={data.country} onChange={onChange} className={inputClass} />
                </Field>
            </div>

            <Field label="Link de entradas" hint="Opcional. Si es entrada libre, puede ser un link para reservar lugar.">
                <input type="url" name="ticketLink" value={data.ticketLink} onChange={onChange} className={inputClass} placeholder="https://" />
            </Field>

            <Checkbox name="freeEntry" checked={data.freeEntry} onChange={onChange} label="Entrada libre" />

            <Field label="Descripción" hint="Opcional. Se muestra debajo del lugar.">
                <textarea name="description" value={data.description} onChange={onChange} rows={3} className={inputClass} />
            </Field>
        </div>
    )
}

