import fetch from "node-fetch";

export async function handler(event) {
    try {
        const { showId } = JSON.parse(event.body);

        // URL del webhook de Netlify para disparar el rebuild
        const rebuildUrl = process.env.REBUILD_WEBHOOK_URL;

        if (!rebuildUrl) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "REBUILD_WEBHOOK_URL no está configurado" }),
            };
        }

        // Llamar al webhook para iniciar la reconstrucción del sitio
        const response = await fetch(rebuildUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "shows_updated",
                showId,
                timestamp: Date.now(),
            }),
        });

        if (!response.ok) {
            throw new Error(`Error en el webhook: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Reconstrucción iniciada" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
}
