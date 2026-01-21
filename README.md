# OEISIS - Oasis Tribute Band

Sitio web profesional para banda homenaje a Oasis con panel de administración completo.

## 🎯 Características

### Landing Page

- Hero con video en loop y parallax scroll
- Featured dinámico (shows/videos)
- Galería de próximos shows ordenados por fecha
- Noticias e Entrevistas
- Galería de videos YouTube
- Galería de fotos
- Footer con redes sociales
- Transiciones suaves (Intersection Observer)

### Admin Panel

- CRUD completo para:
    - Shows (fecha, ubicación, horario, tickets)
    - Noticias y Entrevistas
    - Videos YouTube
    - Fotos (con upload a Cloudinary)
- Autenticación Firebase
- Interfaz intuitiva y responsive
- Managers con edición inline

## 🛠️ Stack Tecnológico

**Frontend:**

- React 19.2 + Vite
- Tailwind CSS
- React Router v7

**Backend & Servicios:**

- Firebase (Firestore, Authentication)
- Cloudinary (image hosting)

**Hosting:**

- Netlify (deploy automático)

## 🎨 Diseño

- **Paleta de colores:** Dark mode profesional (#1f1f1f, #141414)
- **Transiciones:** Smooth fade-in con Intersection Observer
- **Responsive:** Mobile-first design approach
- **Tipografía:** Límpia y legible en todos los dispositivos
- **CTA Buttons:** Borde doble estilo Oasis

## 🔐 Autenticación

El admin panel está protegido con Firebase Authentication. Solo usuarios autenticados pueden acceder a:

- Crear/editar/eliminar shows
- Crear/editar/eliminar noticias
- Crear/editar/eliminar videos
- Crear/editar/eliminar fotos

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 🚢 Deploy

El proyecto está configurado para deploy automático en Netlify:

- `main` → Producción
- `staging` → Preview

## 📝 Notas

Este es un proyecto real, pero también utilizado para **portfolio** que demuestra:

- Arquitectura escalable en React
- Integración con Firebase (Firestore, Auth)
- Upload de archivos (Cloudinary)
- Custom hooks desacoplados
- UI/UX profesional
- Responsive design
- Buenas prácticas de código

## 👨‍💻 Autor

Diseño y desarrollo por **Martín Pacheco**

[LinkedIn](https://linkedin.com/in/martinlpacheco)

## 📄 Licencia

**All Rights Reserved** - Este proyecto es propiedad exclusiva de OEISIS.

Uso permitido únicamente para propósitos internos de la banda y demostración en portfolio del desarrollador.
