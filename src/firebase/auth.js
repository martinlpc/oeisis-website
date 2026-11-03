import { getAuth } from 'firebase/auth';
import app from './config';

// Separado de config.js para que Firebase Auth quede fuera del bundle de la home:
// solo lo cargan /login y /admin.
export const auth = getAuth(app);
