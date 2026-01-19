import { useState } from 'react';
import { useShows } from '../../hooks/useShows';

export function AdminShowForm() {

    const INITIAL_FORM_DATA = {
        title: '',
        status: 'disponible',
        date: '',
        time: '',
        venue: '',
        city: '',
        province: 'Buenos Aires',
        address: '',
        country: 'Argentina',
        ticketLink: '',
        description: '',
    }

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { createShow } = useShows()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await createShow(formData)
            setMessage('✅ Show creado exitosamente')

            setFormData(INITIAL_FORM_DATA)
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    };

    return (
        <section className="min-h-screen  text-white py-20 px-4 flex items-center justify-center">
            <div className="max-w-2xl mx-auto">
                {message && (
                    <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-700">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* title */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nombre del show o del lugar..."
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* date y time */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* venue */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">venue</label>
                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="Nombre del venue..."
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* city y Dirección */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">city</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Ciudad del evento"
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Dirección del evento (solo calle y numero)"
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Provincia y País */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Provincia</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                placeholder="Buenos Aires"
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">País</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Argentina"
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Entradas */}
                    <div>
                        <div className="space-y-4">
                            <input
                                type="url"
                                name="ticketLink"
                                value={formData.ticketLink}
                                onChange={handleChange}
                                placeholder="Link de venta de entradas..."
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descripción del show..."
                            rows="4"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded transition"
                    >
                        {loading ? 'Creando...' : 'Crear Show'}
                    </button>
                </form>
            </div>
        </section>
    );
}