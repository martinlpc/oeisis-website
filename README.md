# OEISIS - Oasis Tribute Band

Sitio web profesional para banda homenaje a Oasis con panel de administración completo.

## 🎯 Características

### Sitio público

- En español (`/`) y en inglés (`/en`), según el idioma del navegador, con selector ES/EN
- Hero con video en loop y parallax scroll
- Destacado con imagen o video y botones propios
- Próximos shows con hora local de cada país, entrada libre o link de entradas, y shows anteriores agrupados por año
- Página por show (`/shows/:id`): flyer, mapa, Google Calendar, archivo .ics y compartir
- Noticias y entrevistas
- Galería de videos de YouTube (el reproductor carga al hacer click)
- Galería de fotos con álbumes, miniaturas y visor
- Kit de prensa (`/prensa`): bio, fotos en alta, rider, gacetilla y videos
- Formulario de contacto (Netlify Forms)
- Vista previa al compartir links (WhatsApp, Instagram, X...), sitemap y robots generados en el momento

### Panel de administración

- Alta, edición y baja de shows, noticias, videos, fotos, destacado y kit de prensa
- Zona horaria por show, sugerida según la ciudad o el país
- Al subir un flyer se genera la imagen de 1200×630 para compartir; al subir una foto, su miniatura
- Traducción automática al inglés al guardar, con panel para corregirla
- Mantenimiento: traducir lo pendiente, crear miniaturas y borrar archivos sin uso en Supabase
- Autenticación con Firebase

## 🛠️ Stack Tecnológico

**Frontend:**

- React 19.2 + Vite
- Tailwind CSS
- React Router v7

**Backend y servicios:**

- Firebase: Firestore y Authentication. El sitio público lee con `firestore/lite`; el admin usa el SDK completo.
- Supabase Storage: imágenes, videos, audio y PDFs
- Google Cloud Translation: traducción del contenido al inglés
- Google Maps Embed API: mapa en la página de cada show
- Umami: estadísticas de visitas, sin cookies

**Hosting:**

- Netlify: deploy automático, Forms, Edge Functions (idioma, vista previa al compartir, sitemap, robots) y Functions (traducción)

## 🎨 Diseño

- **Paleta de colores:** Dark mode profesional (#1f1f1f, #141414)
- **Transiciones:** Smooth fade-in con Intersection Observer
- **Responsive:** Mobile-first design approach
- **Tipografía:** Límpia y legible en todos los dispositivos
- **CTA Buttons:** Borde doble estilo Oasis

## 🔐 Autenticación

El panel de administración está protegido con Firebase Authentication. Los usuarios admin tienen el custom claim `role: 'authenticated'`, que piden las reglas de Firestore, las policies de Supabase y la función de traducción.

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 💻 Desarrollo local

```bash
pnpm install
pnpm dev      # sitio y admin (sin funciones de Netlify)
pnpm lint
```

Con `pnpm dev` no corren las funciones de Netlify: la traducción, la detección de idioma y la vista previa al compartir. Para probarlas, usar `netlify dev` (Netlify CLI) o un deploy preview.

### Variables de entorno

En `.env.local` para desarrollo y en Netlify para producción:

| Variable | Uso |
| --- | --- |
| `VITE_FIREBASE_*` | Configuración de Firebase. `VITE_FIREBASE_PROJECT_ID` y `VITE_FIREBASE_API_KEY` también con alcance Functions |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Storage |
| `VITE_GOOGLE_MAPS_EMBED_KEY` | Mapa de cada show (opcional) |
| `VITE_UMAMI_WEBSITE_ID`, `VITE_UMAMI_DOMAINS` | Estadísticas (opcional) |
| `GOOGLE_TRANSLATE_API_KEY` | Traducción al inglés. Solo en Netlify, con alcance Functions; nunca con prefijo `VITE_` |

## 🚢 Deploy

Deploy automático en Netlify:

- `master` → Producción
- Cada pull request genera un deploy preview

## 📝 Notas

Este es un proyecto real, pero también utilizado para **portfolio** que demuestra:

- Sitio bilingüe con traducción automática del contenido y detección de idioma en el edge
- Integración con Firebase (Firestore, Auth) y Supabase Storage, con permisos por custom claim
- Edge Functions de Netlify para vista previa al compartir, sitemap y redirección por idioma
- Procesamiento de imágenes en el navegador: compresión, miniaturas e imagen para redes
- Zonas horarias por show, con horario de verano

## 👨‍💻 Autor

Diseño y desarrollo por **Martín Pacheco**

[LinkedIn](https://linkedin.com/in/martinlpacheco)

## 📄 Licencia

**All Rights Reserved** - Este proyecto es propiedad exclusiva de OEISIS.

Uso permitido únicamente para propósitos internos de la banda y demostración en portfolio del desarrollador.
