const functions = require('firebase-functions');
const fetch = require('node-fetch');

// Función que se activa cuando se modifica un documento en la colección 'shows'
exports.triggerRebuild = functions.firestore
    .document('shows/{showId}')
    .onWrite(async (change, context) => {
        try {
            // URL del webhook de reconstrucción (configure esto en Firebase environment variables)
            const webhookUrl = process.env.REBUILD_WEBHOOK_URL;

            if (!webhookUrl) {
                console.error('No se ha configurado REBUILD_WEBHOOK_URL');
                return null;
            }

            // Llamar al webhook para iniciar la reconstrucción
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: 'shows_updated',
                    showId: context.params.showId,
                    timestamp: Date.now()
                }),
            });

            if (!response.ok) {
                throw new Error(`Error en la respuesta del webhook: ${response.statusText}`);
            }

            console.log('Reconstrucción del sitio iniciada correctamente');
            return { success: true };
        } catch (error) {
            console.error('Error al disparar la reconstrucción:', error);
            return { success: false, error: error.message };
        }
    });