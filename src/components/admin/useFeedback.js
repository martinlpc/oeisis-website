import { useContext } from 'react'
import { FeedbackContext } from './feedbackContext'

// const toast = useToast(); toast.success('Guardado')
// const confirm = useConfirm(); if (await confirm({ title, message })) { ... }
export const useToast = () => useContext(FeedbackContext).toast
export const useConfirm = () => useContext(FeedbackContext).confirm
