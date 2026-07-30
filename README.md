# 🌐 StegaVault Web App (PWA)
> **Portal Web Empresarial de Desencriptación Universal, Verificación SHA-256 y Previsualización Multi-Formato**

![StegaVault Logo](assets/icon-192.png)

## 📌 Archivos Principales del Repositorio
Para subir este proyecto a GitHub o cualquier plataforma de Hosting (GitHub Pages, Vercel, Netlify), debes incluir los siguientes archivos esenciales de esta carpeta:

```text
stegavault-web/
├── index.html               # Interfaz principal de usuario PWA
├── manifest.json            # Configuración para instalación PWA en Celular / PC
├── sw.js                    # Service Worker (Caché 100% Offline)
├── MANUAL_DE_USUARIO.md     # Manual de Usuario Oficial
├── css/
│   └── style.css            # Sistema de diseño con Glassmorphism y temas
├── js/
│   ├── app.js               # Controlador PWA, Audio Web API y eventos
│   ├── crypto.js            # Motor PBKDF2 HMAC-SHA256, AES-256 e Integridad
│   ├── stega.js             # Desempaquetador esteganográfico LSB
│   ├── mammoth.browser.min.js # Renderizador de documentos Word (.docx)
│   └── xlsx.full.min.js     # Renderizador de hojas de cálculo Excel (.xlsx)
└── assets/
    └── icon-192.png         # Icono oficial PWA (192x192)
```

---

## 🚀 Cómo Subir a GitHub y Desplegar Gratis

### Opción A: Subir los Archivos Directamente en GitHub (Sin línea de comandos)
1. Ve a [GitHub.com](https://github.com) e inicia sesión.
2. Haz clic en el botón verde **"New"** (Nuevo Repositorio).
3. Nombre del repositorio: `stegavault-web` (o `stegavault`).
4. Selecciona **Public** y presiona **"Create repository"**.
5. En la pantalla del repositorio, haz clic en **"uploading an existing file"** (Subir archivos existentes).
6. Arrastra todos los archivos de la carpeta `stegavault-web` (index.html, manifest.json, sw.js, carpetas css, js, assets).
7. Presiona **"Commit changes"**.

### Opción B: Activar GitHub Pages (Para tener tu Web App Online Gratis)
1. Dentro de tu repositorio en GitHub, ve a la pestaña **Settings** (Configuración).
2. En el menú de la izquierda, selecciona **Pages**.
3. En **Build and deployment -> Source**, selecciona la rama **main** (o `master`) y la carpeta **/ (root)**.
4. Presiona **Save**.
5. En 1 minuto, GitHub te dará un enlace público HTTPS (ejemplo: `https://tu-usuario.github.io/stegavault-web/`) para usar y compartir tu app en cualquier celular o PC con soporte PWA.

---

## 🛡️ Seguridad y Privacidad (100% Client-Side)
Toda la lógica de descifrado criptográfico, derivación de claves PBKDF2 y previsualización de documentos Word, Excel y PDF se ejecuta **100% en la memoria RAM del navegador del usuario**. Ninguna información sale jamás hacia servidores externos.
