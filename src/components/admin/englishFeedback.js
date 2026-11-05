// Aviso cuando se guardó en español pero la traducción automática falló
export function warnIfNotTranslated(toast, result) {
    if (result?.translated === false) {
        toast.warning('Se guardó, pero falló la traducción al inglés. Mientras tanto, la versión en inglés muestra este texto en español. Podés reintentar desde el panel "Inglés" o desde Mantenimiento.')
    }
}
