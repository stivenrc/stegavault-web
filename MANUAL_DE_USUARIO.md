# 📖 Manual de Usuario Oficial: StegaVault Enterprise v2.0
> **Sistema Empresarial Universal de Seguridad Criptográfica, Esteganografía LSB y Protección de Documentos**

---

## 📋 Índice
1. [Visión General del Sistema](#-visión-general-del-sistema)
2. [Arquitectura Dual: Escritorio de PC vs. Web App PWA](#-arquitectura-dual)
3. [Guía de Uso: Software de Escritorio para PC](#-guía-de-uso-software-de-escritorio-para-pc)
   - [3.1 Ocultar Información en PNG (Esteganografía LSB)](#31-ocultar-información-en-png)
   - [3.2 Extraer Información de PNG](#32-extraer-información-de-png)
   - [3.3 Protección Criptográfica de PDF (AES-256)](#33-protección-criptográfica-de-pdf)
   - [3.4 Protección Criptográfica de Documentos Office (Word, Excel, PowerPoint)](#34-protección-criptográfica-de-documentos-office)
   - [3.5 Extraer / Desproteger Documentos Office](#35-extraer--desproteger-documentos-office)
   - [3.6 Tabla de Historial Auditivo (Buscador, Ordenación y CRUD)](#36-tabla-de-historial-auditivo)
4. [Guía de Uso: Portal Web Empresarial (PWA 100% Offline)](#-guía-de-uso-portal-web-empresarial)
   - [4.1 Desencriptador Universal Drag & Drop](#41-desencriptador-universal-drag--drop)
   - [4.2 Certificación de Integridad SHA-256](#42-certificación-de-integridad-sha-256)
   - [4.3 Vista Previa Directa Multi-Formato (Word, Excel, PDF, Imágenes, Texto)](#43-vista-previa-directa-multi-formato)
   - [4.4 Instalación PWA en Celular / PC y Uso sin Internet](#44-instalación-pwa-en-celular--pc)
5. [💡 Recomendaciones de Uso y Mejores Prácticas](#-recomendaciones-de-uso-y-mejores-prácticas)
6. [⚠️ Notas Claves y Preguntas Frecuentes (FAQ)](#-notas-claves-y-preguntas-frecuentes-faq)

---

## 🛡️ Visión General del Sistema

**StegaVault Enterprise v2.0** es una plataforma de ciberseguridad diseñada para la protección, cifrado y camuflaje de información confidencial. El sistema permite **ocultar archivos y textos secretos dentro de imágenes PNG inocuas** sin alterar su apariencia visual (Esteganografía LSB), así como aplicar **cifrado criptográfico fuerte (AES-256 / PBKDF2 HMAC-SHA256)** a documentos de ofimática (Word, Excel, PowerPoint) y archivos PDF.

---

## 🌐 Arquitectura Dual

El ecosistema StegaVault está compuesto por dos soluciones complementarias:

| Característica | 💻 Software de PC (Instalable / Portátil) | 📲 Web App PWA (Navegador / Móvil) |
| :--- | :--- | :--- |
| **Generación y Ocultamiento de PNG** | ✅ Sí (Genera PNGs esteganográficos) | ❌ Solo lectura / Desencriptación |
| **Cifrado de PDF y Office** | ✅ Sí (Word, Excel, PPTX, PDF) | ❌ Solo lectura / Desencriptación |
| **Desencriptación Universal** | ✅ Sí | ✅ Sí |
| **Vista Previa de Documentos** | 🚀 Mediante aplicaciones del sistema | 👁️ Rendimiento nativo en pantalla (Word, Excel, PDF) |
| **Integridad Criptográfica** | ✅ Certificado local | 🛡️ Insignia SHA-256 en tiempo real |
| **Historial Auditivo** | 📊 Tabla CRUD con buscador | 📜 Registro interactivo de sesión |
| **Conexión a Internet** | 🌐 100% Offline (No requiere) | ⚡ 100% Offline (Instalable PWA) |

---

## 💻 Guía de Uso: Software de Escritorio para PC

### 3.1 Ocultar Información en PNG (Esteganografía LSB)
Permite camuflar un mensaje o cualquier archivo adjunto dentro de una imagen PNG normal.

1. Abre la pestaña **"Encriptar"** en el menú lateral.
2. Haz clic en **"Seleccionar PNG"** para elegir la imagen de cobertura.
3. En **"Tipo de contenido"**, elige:
   - 💬 **Texto secreto:** Escribe el mensaje que deseas camuflar.
   - 📁 **Archivo adjunto:** Selecciona cualquier documento (`.pdf`, `.docx`, `.xlsx`, `.zip`, `.txt`, `.jpg`, `.pem`, etc.).
4. Ingresa una **Contraseña de Seguridad** (mínimo 8 caracteres) y confírmala.
5. Observa la **Barra de Capacidad**: indicará cuánto espacio de la imagen estás utilizando.
6. Presiona **"Ocultar y guardar PNG"** y selecciona la carpeta de destino.

---

### 3.2 Extraer Información de PNG
1. Abre la pestaña **"Extraer"** en el menú lateral.
2. Haz clic en **"Abrir PNG"** y selecciona la imagen que contiene la información oculta.
3. Escribe la **Contraseña** utilizada al momento de ocultar.
4. Presiona **"Extraer y descifrar"**.
5. Si el contenido era texto, aparecerá en el recuadro **"Contenido recuperado"**. Si era un archivo adjunto, se habilitará el botón **"💾 Guardar archivo extraído en PC"**.

---

### 3.3 Protección Criptográfica de PDF (AES-256)
1. Ve a la pestaña **"Proteger PDF"**.
2. Haz clic en **"Seleccionar PDF"** y escoge el archivo a cifrar.
3. Asigna y confirma la contraseña de protección.
4. Presiona **"Proteger y guardar PDF"**. Se creará una copia cifrada con AES-256.

---

### 3.4 Protección Criptográfica de Documentos Office
Protege documentos de Word (`.docx`), Excel (`.xlsx`) y PowerPoint (`.pptx`).

1. Ve a la pestaña **"Proteger Office"**.
2. Selecciona el archivo de Word, Excel o PowerPoint.
3. Ingresa la contraseña elegida.
4. Presiona **"Proteger y guardar Office"**. La copia generada solicitará contraseña nativa al intentarla abrir en Microsoft Office o LibreOffice.

---

### 3.5 Extraer / Desproteger Documentos Office
1. Ve a la pestaña **"Extraer Office"**.
2. Selecciona el archivo Office protegido.
3. Escribe la contraseña del documento.
4. Presiona **"Extraer y guardar copia"** para generar una versión libre de clave.

---

### 3.6 Tabla de Historial Auditivo (Buscador, Ordenación y CRUD)
La pestaña **"Historial"** registra todas las operaciones efectuadas localmente para auditoría de seguridad:

- 🔍 **Buscador Dinámico:** Escribe cualquier nombre de archivo, extensión (`.pdf`, `.docx`, `.png`) o fecha para filtrar los registros al instante.
- 🔀 **Ordenación:** Clasifica por *Más reciente*, *Más antiguo*, o alfabéticamente *(A-Z / Z-A)*.
- 🗑️ **Eliminación Individual:** Elimina una fila específica haciendo clic en su botón **`🗑️`**.
- 🗑️ **Limpiar Todo:** Borra el registro completo con un solo clic.

> [!NOTE]
> **Memoria de Pestañas Persistente:** Puedes cambiar libremente entre las pestañas del menú lateral sin temor a perder los archivos cargados en pantalla o el avance del trabajo.

---

## 🌐 Guía de Uso: Portal Web Empresarial (PWA)

### 4.1 Desencriptador Universal Drag & Drop
El portal web permite desencriptar y extraer cualquier contenido directamente en el navegador:
1. Arrastra cualquier archivo (PNG con esteganografía, PDF, Word, Excel, ZIP) a la **Zona de Arrastre (Dropzone)**.
2. Ingresa la contraseña corporativa.
3. Presiona **"Desencriptar & Extraer Contenido"**.

---

### 4.2 Certificación de Integridad SHA-256
Una vez desencriptado el archivo, la Web App calcula automáticamente la firma digital de hash **SHA-256 (256 bits)** y despliega la insignia:
`🛡️ ✅ Documento 100% Auténtico e Intacto - SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

---

### 4.3 Vista Previa Directa Multi-Formato
No necesitas instalar programas adicionales para verificar el contenido extraído. Al presionar **"👁️ Previsualizar Documento en Pantalla"**, la Web App renderea:
- 📝 **Word (`.docx`):** Convierte el archivo a HTML estructurado en pantalla.
- 📊 **Excel (`.xlsx` / `.csv`):** Renderiza una tabla interactiva con pestañas navegables por cada hoja de cálculo.
- 📕 **PDF (`.pdf`):** Despliega el lector nativo visor de PDF.
- 🖼️ **Imágenes y Texto (`.png`, `.jpg`, `.txt`, `.json`, `.pem`):** Vista previa directa en pantalla.

---

### 4.4 Instalación PWA en Celular / PC y Uso sin Internet
1. Presiona el botón **`📲 Instalar App`** ubicado en la barra superior.
2. Confirma la instalación. El icono de **StegaVault** se añadirá al escritorio o pantalla de inicio de tu smartphone.
3. La aplicación funcionará **100% Offline (Sin Internet)** gracias al Service Worker integrado.

---

## 💡 Recomendaciones de Uso y Mejores Prácticas

> [!TIP]
> ### 1. Preservación del Formato PNG (Regla de Oro de Esteganografía)
> Las imágenes PNG esteganográficas ocultan datos modificando los bits menos significativos (LSB) de los colores de cada píxel.
> - **✅ RECOMENDADO:** Enviar la imagen como **"Documento / Archivo"** en WhatsApp, Telegram, correo electrónico, Google Drive, OneDrive o USB.
> - **❌ EVITAR:** Enviar la imagen como foto comprimida en redes sociales (Facebook, Instagram) o chats normales, ya que los algoritmos de compresión destruirán los datos ocultos.

> [!IMPORTANT]
> ### 2. Gestión de Contraseñas Fuertes
> Utiliza contraseñas de al menos **8 a 16 caracteres** combinando letras mayúsculas, minúsculas, números y símbolos (ejemplo: `St3ga#V4ult!2026`). El motor utiliza derivación de clave **PBKDF2 HMAC-SHA256 con 480,000 iteraciones** para resistir ataques de fuerza bruta.

> [!NOTE]
> ### 3. Selección de Imágenes de Cobertura
> Utiliza imágenes PNG de alta resolución con variedad de colores o texturas (como fotografías de paisajes o gráficos). Evita imágenes con fondos planos transparentes o de un solo color sólido.

---

## ⚠️ Notas Claves y Preguntas Frecuentes (FAQ)

#### Q1: ¿Los archivos procesados en la Web App suben a algún servidor en internet?
> **Respuesta:** **No.** StegaVault funciona **100% Client-Side**. Todo el descifrado, derivación de claves PBKDF2 y desempaquetado de archivos ocurre dentro de la memoria RAM de tu navegador o computadora. Ninguna clave ni archivo sale jamás de tu dispositivo.

#### Q2: ¿Puedo instalar el software en cualquier PC con Windows?
> **Respuesta:** Sí. Dispones de dos formatos en la carpeta `dist`:
> 1. **`StegaVault-v2.0-Setup.exe`:** Instalador estándar de Windows con accesos directos.
> 2. **`StegaVault-v2.0-portable.exe`:** Versión portátil que no requiere instalación previa ni permisos de administrador.

#### Q3: ¿Por qué una imagen PNG ocupa el mismo tamaño visual después de ocultarle un archivo?
> **Respuesta:** La esteganografía LSB reemplaza los últimos bits de color que el ojo humano no puede percibir. La imagen mantiene exactamente las mismas dimensiones de ancho y alto, la misma extensión `.png` y no presenta distorsión apreciable.

---
*StegaVault Enterprise v2.0 • Documento de Soporte y Manual de Usuario Oficial*
