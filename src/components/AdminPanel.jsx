import React, { useState, useEffect } from "react";
import { showsService } from "../lib/showsService";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { formatDateTime, toInputDateTime } from "../utils/dateUtils";

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newShow, setNewShow] = useState({
        nombre: "",
        fecha: "",
        lugar: "",
        direccion: "",
        link: ""
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchShows();
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchShows = async () => {
        setLoading(true);
        try {
            const showData = await showsService.getShows();
            setShows(showData);
        } catch (err) {
            setError("Error al cargar los shows");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError("Error de autenticación: " + err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            setError("Error al cerrar sesión");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewShow((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddShow = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!newShow.nombre || !newShow.fecha || !newShow.lugar) {
            setError("Por favor, completa los campos obligatorios");
            return;
        }

        try {
            await showsService.addShow(newShow);
            setSuccessMessage("Show agregado con éxito");
            setNewShow({
                nombre: "",
                fecha: "",
                lugar: "",
                direccion: "",
                link: ""
            });
            setShowForm(false);
            fetchShows();
        } catch (err) {
            setError("Error al agregar show: " + err.message);
        }
    };

    const handleDeleteShow = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este show?")) {
            try {
                await showsService.deleteShow(id);
                setSuccessMessage("Show eliminado con éxito");
                fetchShows();
            } catch (err) {
                setError("Error al eliminar show: " + err.message);
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Panel de Administración</h2>
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Panel de Administración de Shows</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            {showForm ? "Cancelar" : "Nuevo Show"}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>
                )}

                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Show</h3>
                        <form onSubmit={handleAddShow}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={newShow.nombre}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Fecha *</label>
                                    <input
                                        type="datetime-local"
                                        name="fecha"
                                        value={newShow.fecha}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Lugar *</label>
                                    <input
                                        type="text"
                                        name="lugar"
                                        value={newShow.lugar}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Dirección</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={newShow.direccion}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-2">Link de Entradas</label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={newShow.link}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Agregar Show
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Shows Existentes</h3>
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : shows.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b text-left">Nombre</th>
                                        <th className="py-2 px-4 border-b text-left">Fecha</th>
                                        <th className="py-2 px-4 border-b text-left">Lugar</th>
                                        <th className="py-2 px-4 border-b text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shows.map((show) => (
                                        <tr key={show.id}>
                                            <td className="py-2 px-4 border-b">{show.nombre}</td>
                                            <td className="py-2 px-4 border-b">
                                                {formatDateTime(show.fecha)}
                                            </td>
                                            <td className="py-2 px-4 border-b">{show.lugar}</td>
                                            <td className="py-2 px-4 border-b">
                                                <button
                                                    onClick={() => handleDeleteShow(show.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No hay shows disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;