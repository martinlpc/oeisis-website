import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FeedbackContext } from './feedbackContext'
import { Button } from './ui'

// Toasts (avisos que desaparecen solos) y modal de confirmación para el panel.
// Los hooks para usarlos están en useFeedback.js

export function FeedbackProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const [dialog, setDialog] = useState(null)
    const nextId = useRef(0)

    const dismiss = useCallback((id) => setToasts(list => list.filter(t => t.id !== id)), [])

    const push = useCallback((kind, message) => {
        const id = ++nextId.current
        setToasts(list => [...list, { id, kind, message }])
        setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 4000)
    }, [dismiss])

    const toast = useMemo(() => ({
        success: (message) => push('success', message),
        error: (message) => push('error', message),
        warning: (message) => push('warning', message),
    }), [push])

    const confirm = useCallback((options) => new Promise(resolve => {
        setDialog({ ...options, resolve })
    }), [])

    const closeDialog = (result) => {
        dialog?.resolve(result)
        setDialog(null)
    }

    const value = useMemo(() => ({ toast, confirm }), [toast, confirm])

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            <Toasts toasts={toasts} onDismiss={dismiss} />
            {dialog && <ConfirmDialog {...dialog} onClose={closeDialog} />}
        </FeedbackContext.Provider>
    )
}

const TOAST_STYLES = {
    success: 'border-white/20',
    warning: 'border-yellow-500/50',
    error: 'border-red-500/60',
}

function Toasts({ toasts, onDismiss }) {
    return (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 sm:w-96" aria-live="polite">
            {toasts.map(t => (
                <div
                    key={t.id}
                    role={t.kind === 'error' ? 'alert' : 'status'}
                    className={`flex items-start gap-3 bg-[#141414] border ${TOAST_STYLES[t.kind]} rounded-lg px-4 py-3 shadow-lg text-sm`}
                >
                    <p className="flex-1">{t.message}</p>
                    <button type="button" onClick={() => onDismiss(t.id)} className="text-gray-400 hover:text-white" aria-label="Cerrar aviso">✕</button>
                </div>
            ))}
        </div>
    )
}

function ConfirmDialog({ title, message, confirmLabel = 'Eliminar', danger = true, onClose }) {
    const cancelRef = useRef(null)

    useEffect(() => {
        const previousFocus = document.activeElement
        cancelRef.current?.focus()
        const onKey = (e) => { if (e.key === 'Escape') onClose(false) }
        window.addEventListener('keydown', onKey)
        return () => {
            window.removeEventListener('keydown', onKey)
            previousFocus?.focus?.()
        }
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => onClose(false)}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                className="w-full max-w-md bg-[#1f1f1f] border border-white/15 rounded-lg p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="confirm-title" className="text-lg font-bold mb-2">{title}</h2>
                {message && <p className="text-gray-300 text-sm mb-6">{message}</p>}
                <div className="flex justify-end gap-2">
                    <Button ref={cancelRef} variant="secondary" onClick={() => onClose(false)}>Cancelar</Button>
                    <Button variant={danger ? 'danger' : 'primary'} onClick={() => onClose(true)}>{confirmLabel}</Button>
                </div>
            </div>
        </div>
    )
}
