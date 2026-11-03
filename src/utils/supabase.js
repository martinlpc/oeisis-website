import { createClient } from '@supabase/supabase-js';
import { auth } from '../firebase/config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Supabase valida el ID token de Firebase (third-party auth).
// Sin sesión se manda null y la request queda como anon.
export const supabase = createClient(supabaseUrl, supabaseKey, {
    accessToken: async () => (await auth.currentUser?.getIdToken()) ?? null,
});
