export const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
};

export const formatDateTime = (dateString) => {
    const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };
    return new Date(dateString).toLocaleString("es-ES", options);
};

// Formato para input datetime-local
export const toInputDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
};