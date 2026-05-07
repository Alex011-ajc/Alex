# 📖 GUÍA COMPLETA — AniRank

## 🗂 ESTRUCTURA DEL PROYECTO

```
anime-ranking/
├── frontend/
│   └── index.html          ← La web completa (un solo archivo)
└── backend/
    ├── server.js            ← Servidor principal
    ├── package.json
    ├── .env.example         ← Plantilla de variables de entorno
    ├── .gitignore
    ├── config/
    │   └── passport.js      ← Login con Google
    ├── middleware/
    │   └── auth.js          ← Protección de rutas admin
    ├── models/
    │   ├── Anime.js         ← Modelo de datos del anime
    │   └── User.js          ← Modelo de usuario/admin
    └── routes/
        ├── auth.js          ← Login, Google OAuth
        └── animes.js        ← CRUD de animes
```

---

## 🚀 PASO 1 — CONFIGURAR MONGODB (base de datos gratis)

1. Ve a **https://mongodb.com/atlas** y crea una cuenta gratuita.
2. Crea un **cluster gratuito** (M0, región Europa).
3. En *Database Access* → crea usuario y contraseña.
4. En *Network Access* → añade `0.0.0.0/0` (permite acceso desde cualquier IP).
5. En tu cluster → *Connect* → *Connect your application* → copia la URL.
   - Tiene este formato: `mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/`
   - Añade `anirank` al final: `…mongodb.net/anirank?retryWrites=true&w=majority`

---

## 🚀 PASO 2 — CONFIGURAR EL BACKEND

```bash
# Entra a la carpeta del backend
cd anime-ranking/backend

# Instala las dependencias
npm install

# Copia el archivo de ejemplo y rellénalo
cp .env.example .env
```

Abre `.env` y rellena:

```env
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/anirank?retryWrites=true&w=majority
JWT_SECRET=cualquier_texto_largo_y_secreto_aqui_abc123xyz
PORT=3001
FRONTEND_URL=http://localhost:5500
```

Arranca el backend:

```bash
npm run dev
# Verás: ✅ MongoDB conectado
# Verás: 🚀 Servidor en http://localhost:3001
```

---

## 🚀 PASO 3 — ABRIR EL FRONTEND

Abre `frontend/index.html` directamente en el navegador.

> 💡 **Recomendado:** Usa la extensión **Live Server** de VS Code para evitar problemas de CORS.
> Haz clic derecho en `index.html` → *Open with Live Server* (se abre en `http://localhost:5500`)

---

## 🚀 PASO 4 — CREAR TU CUENTA DE ADMIN (primera vez)

1. Abre la web → pulsa **"Iniciar sesión"**
2. Pon tu email: `alex137julio@gmail.com` (o el otro admin)
3. Pon una contraseña (la que quieras, la primera vez crea la cuenta)
4. ¡Ya puedes añadir, editar y borrar animes!

---

## 🚀 PASO 5 — CONFIGURAR EMAILJS (sugerencias por correo)

1. Ve a **https://emailjs.com** → crea cuenta gratuita (200 emails/mes gratis).
2. *Email Services* → *Add New Service* → conecta tu Gmail.
3. *Email Templates* → *Create New Template*. Escribe:

```
Subject: Nueva sugerencia de anime — AniRank

De: {{from_name}} ({{from_email}})
Anime sugerido: {{anime_name}}

Mensaje:
{{message}}
```

4. Apunta estos valores:
   - **Service ID** (ej: `service_abc123`)
   - **Template ID** (ej: `template_xyz789`)
   - **Public Key** (en Account → API Keys)

5. Abre `frontend/index.html` y busca estas líneas al principio del script:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';   // ← cambia esto
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // ← cambia esto
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // ← cambia esto
```

---

## 🚀 PASO 6 — GOOGLE LOGIN (opcional)

1. Ve a **https://console.cloud.google.com**
2. Crea proyecto → *APIs y servicios* → *Credenciales* → *Crear credenciales* → *ID de cliente OAuth 2.0*
3. Tipo: *Aplicación web*
4. Añade en "URIs de redireccionamiento autorizados": `http://localhost:3001/api/auth/google/callback`
5. Copia el **Client ID** y **Client Secret** y ponlos en tu `.env`.

Si no necesitas Google Login, simplemente no lo uses (el login con email/contraseña funciona sin él).

---

## 🌍 PUBLICAR EN INTERNET

### Backend → Render (gratis)

1. Crea cuenta en **https://render.com**
2. *New* → *Web Service* → conecta tu repositorio de GitHub.
3. Configuración:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. En *Environment Variables* añade todas las variables de tu `.env`.
5. Una vez desplegado, copia la URL (ej: `https://anirank-api.onrender.com`).

### Frontend → Netlify (gratis)

1. Crea cuenta en **https://netlify.com**
2. Arrastra la carpeta `frontend` a la web de Netlify.
3. ¡Listo! Te da una URL tipo `https://anirank-xyz.netlify.app`.

### Conectar frontend con backend en producción

En `frontend/index.html`, cambia esta línea:

```javascript
const API = 'http://localhost:3001/api';
// →
const API = 'https://anirank-api.onrender.com/api';
```

También actualiza en Render la variable:
```
FRONTEND_URL=https://anirank-xyz.netlify.app
```

---

## 🌐 COMPRAR Y CONECTAR UN DOMINIO .COM

1. Ve a **https://namecheap.com** o **https://porkbun.com** (los más baratos, ~10€/año).
2. Busca `anirank.com` (o el nombre que quieras) → cómpralo.
3. **Para el frontend (Netlify):**
   - En Netlify → *Domain settings* → *Add custom domain*
   - Sigue los pasos, te dirán qué DNS configurar en Namecheap.
4. **Para el backend (Render):**
   - En Render → *Settings* → *Custom Domains*
   - Añade `api.tudominio.com` y configura el DNS.

> ⏱ Los cambios DNS tardan entre 30 min y 24h en propagarse.

---

## 📋 RESUMEN RÁPIDO

| Paso | Qué hacer | Servicio |
|------|-----------|---------|
| 1 | Base de datos | MongoDB Atlas (gratis) |
| 2 | Backend | Render (gratis) |
| 3 | Frontend | Netlify (gratis) |
| 4 | Emails | EmailJS (gratis) |
| 5 | Dominio | Namecheap (~10€/año) |

---

## 🔒 SEGURIDAD IMPLEMENTADA

- ✅ Contraseñas hasheadas con bcrypt (nunca se guardan en texto plano)
- ✅ Tokens JWT con expiración de 7 días
- ✅ Rutas de admin protegidas en el backend (no solo en el frontend)
- ✅ Lista de emails admin hardcoded en el servidor
- ✅ Validación de datos en todos los endpoints
- ✅ CORS configurado para solo permitir tu dominio

---

## ❓ PROBLEMAS COMUNES

**Error de CORS:**
→ Asegúrate de que `FRONTEND_URL` en el backend coincide exactamente con la URL del frontend.

**No aparecen los animes:**
→ Comprueba que el backend está corriendo (`npm run dev`) y que `API` en el frontend apunta a `localhost:3001`.

**No puedo hacer login:**
→ La primera vez crea la cuenta con tu email admin. Si ya existe, usa la misma contraseña.

**EmailJS no envía:**
→ Verifica que copiaste bien los 3 valores (Service ID, Template ID, Public Key) y que el servicio de email está verificado en EmailJS.
