# 📦 Cómo Subir a Chrome Web Store - Versión 1.4

## 🎯 Pasos para Publicar

---

## 1️⃣ **Crear el Archivo ZIP**

### **Archivos a Incluir:**

```
Voice-Scribe-SitioWeb/
├── _locales/              (INCLUIR - 56 carpetas de idiomas)
├── icons/                 (INCLUIR - todos los iconos)
├── manifest.json          (INCLUIR - v1.4)
├── popup.html             (INCLUIR)
├── popup.js               (INCLUIR)
├── sidebar.html           (INCLUIR)
├── sidebar.js             (INCLUIR)
├── background.js          (INCLUIR)
├── permissions.html       (INCLUIR)
├── permissions.js         (INCLUIR)
├── styles.css             (INCLUIR)
├── apple-touch-icon.png   (INCLUIR)
├── favicon.ico            (INCLUIR)
└── site.webmanifest       (INCLUIR)
```

### **Archivos a EXCLUIR del ZIP:**

```
❌ NO incluir:
├── .git/                  (carpeta de git)
├── .gitignore
├── README.md
├── *.md                   (todos los archivos markdown)
├── node_modules/          (si existe)
├── .env                   (si existe)
└── cualquier archivo de desarrollo
```

---

## 2️⃣ **Comando para Crear el ZIP (PowerShell)**

```powershell
# Desde la carpeta del proyecto
cd "c:\Users\JON\Voice Scribe Nuevo\Voice-Scribe-SitioWeb"

# Crear ZIP con los archivos necesarios
Compress-Archive -Path _locales,icons,manifest.json,popup.html,popup.js,sidebar.html,sidebar.js,background.js,permissions.html,permissions.js,styles.css,apple-touch-icon.png,favicon.ico,site.webmanifest -DestinationPath voice-scribe-v1.4.zip -Force
```

---

## 3️⃣ **Información para Chrome Web Store**

### **📝 Título (máx 45 caracteres):**
```
Voice Transcription + AI Summary
```

### **📝 Descripción Corta (máx 132 caracteres):**
```
Transcribe tu voz a texto en tiempo real y genera resúmenes inteligentes con IA. Panel lateral que permanece abierto.
```

### **📝 Descripción Detallada:**

```
🎤 TRANSCRIPCIÓN DE VOZ EN TIEMPO REAL

Voice Transcription + AI es una extensión poderosa que convierte tu voz en texto instantáneamente mientras hablas. Perfecto para estudiantes, profesionales, escritores y cualquier persona que prefiera dictar texto.

✨ CARACTERÍSTICAS PRINCIPALES:

🎯 Transcripción Instantánea
• Reconocimiento de voz en tiempo real
• El texto aparece mientras hablas
• Detección automática del idioma
• Contador de palabras y caracteres en vivo

🤖 Resumen Inteligente con IA
• Genera resúmenes automáticos de tu texto
• 3 longitudes: Corto, Medio, Largo
• 3 estilos: General, Puntos Clave, Detallado
• Funciona sin conexión (resumen local)

📊 DOS MODOS DE USO:
• Modo Popup: Ventana flotante compacta
• Modo Panel Lateral: Permanece abierto todo el tiempo (RECOMENDADO)

💾 EXPORTACIÓN FLEXIBLE:
• Copiar texto con un solo clic
• Guardar como archivo TXT
• Copiar al portapapeles

🌍 SOPORTE MULTIIDIOMA:
• Interfaz en 56 idiomas
• Reconocimiento de voz en múltiples idiomas
• Detección automática del idioma del navegador

🎨 DISEÑO MODERNO Y LIMPIO:
• Interfaz intuitiva y fácil de usar
• Animaciones suaves
• Compatible con modo oscuro
• Estadísticas en tiempo real

🔒 PRIVACIDAD GARANTIZADA:
• El audio NO se graba
• Reconocimiento local (API de Chrome)
• No se envían datos a servidores externos
• Sin recopilación de datos personales

💡 CASOS DE USO:
✓ Tomar apuntes en clases o reuniones
✓ Dictar documentos y correos
✓ Transcribir entrevistas
✓ Crear contenido rápidamente
✓ Accesibilidad para personas con dificultades de escritura

🆕 NUEVO EN v1.4:
• Botón de copiar rápido en área de transcripción
• Interfaz más limpia (detección automática de idioma)
• Toggle mejorado para cambiar entre modos
• Banner de ayuda para nuevos usuarios
• Tooltips descriptivos en todos los controles
• 56 idiomas completamente actualizados

⚡ INICIO RÁPIDO:
1. Haz clic en el icono 🎙️
2. Permite acceso al micrófono
3. Haz clic en "Iniciar Grabación"
4. ¡Habla y observa el texto aparecer!

📧 SOPORTE: jonastantra@gmail.com

¡Descarga ahora y transforma tu forma de trabajar!
```

### **🏷️ Categoría:**
```
Productividad
```

### **🏷️ Etiquetas/Tags (máximo 20):**
```
1. voice to text
2. speech to text
3. transcription
4. voice recognition
5. dictation
6. AI summary
7. note taking
8. productivity
9. accessibility
10. voice typing
11. real-time transcription
12. text summary
13. voice notes
14. speech recognition
15. transcribe audio
```

---

## 4️⃣ **Capturas de Pantalla Recomendadas**

### **Tamaños para Chrome Web Store:**
- **1280 x 800 px** (recomendado)
- **640 x 400 px** (mínimo)

### **Capturas Sugeridas:**

1. **Captura 1: Vista Principal (Popup)**
   - Mostrar la interfaz del popup
   - Con texto transcrito de ejemplo
   - Botones visibles

2. **Captura 2: Modo Panel Lateral**
   - Panel lateral abierto a la derecha
   - Mostrando transcripción en tiempo real
   - Estadísticas visibles

3. **Captura 3: Resumen con IA**
   - Sección de resumen desplegada
   - Ejemplo de resumen generado
   - Opciones de longitud y estilo

4. **Captura 4: Exportación**
   - Sección de exportar abierta
   - Botones de guardar y copiar visibles

5. **Captura 5: Multi-idioma**
   - Interfaz en diferentes idiomas
   - Mostrar soporte internacional

---

## 5️⃣ **Icono de la Extensión**

### **Archivos de Iconos:**
```
icons/icon16.png   - 16x16 px
icons/icon32.png   - 32x32 px
icons/icon48.png   - 48x48 px
icons/icon128.png  - 128x128 px
```

Todos ya incluidos en el proyecto ✅

---

## 6️⃣ **Página de Desarrollador**

### **Información del Desarrollador:**

```
Nombre: Jonas Tantra
Email: jonastantra@gmail.com
Sitio web: (opcional)
```

---

## 7️⃣ **Política de Privacidad**

### **URL de Política de Privacidad (requerida):**

Puedes crear una página simple con esta información:

```markdown
# Política de Privacidad - Voice Transcription + AI

Última actualización: Noviembre 2025

## Recopilación de Datos
Voice Transcription + AI NO recopila, almacena ni transmite ningún dato personal.

## Uso del Micrófono
- La extensión solicita acceso al micrófono únicamente cuando el usuario hace clic en "Iniciar Grabación"
- El audio NO se graba ni se guarda
- El reconocimiento de voz utiliza la API nativa de Chrome (local)
- No se envían datos de audio a servidores externos

## Almacenamiento Local
- Las transcripciones se guardan localmente en el navegador
- Los datos permanecen en tu dispositivo
- Puedes eliminar los datos en cualquier momento desde la extensión

## Servicios de Terceros
- Si usas la función de resumen con IA (OpenAI), debes proporcionar tu propia API key
- Los resúmenes locales NO requieren conexión a internet ni servicios externos

## Permisos
- storage: Para guardar preferencias y transcripciones localmente
- sidePanel: Para mostrar el panel lateral

## Contacto
Para preguntas sobre privacidad: jonastantra@gmail.com
```

Puedes hostear esto en:
- GitHub Pages (gratis)
- Google Sites (gratis)
- Tu propio sitio web

---

## 8️⃣ **Proceso de Publicación**

### **Paso a Paso:**

1. **Ir a Chrome Web Store Developer Dashboard**
   ```
   https://chrome.google.com/webstore/devconsole
   ```

2. **Iniciar Sesión**
   - Con tu cuenta de Google
   - Pagar tarifa única de $5 USD (si es la primera vez)

3. **Subir Nueva Extensión**
   - Clic en "New Item"
   - Subir el archivo ZIP (voice-scribe-v1.4.zip)
   - Esperar validación automática

4. **Completar Información**
   - Título
   - Descripción corta
   - Descripción detallada
   - Categoría
   - Idioma principal
   - Capturas de pantalla (mínimo 1)
   - Icono pequeño (128x128)
   - URL de política de privacidad

5. **Configurar Distribución**
   - Países: Todos (o selecciona específicos)
   - Visibilidad: Pública
   - Precio: Gratis

6. **Enviar para Revisión**
   - Clic en "Submit for Review"
   - Tiempo de revisión: 1-3 días hábiles

7. **Publicación**
   - Recibirás email de aprobación
   - La extensión estará disponible en Chrome Web Store

---

## 9️⃣ **Checklist Final**

### **Antes de Subir:**

- [ ] Versión actualizada a 1.4 en manifest.json
- [ ] Todas las funciones probadas
- [ ] Sin errores en la consola
- [ ] Archivo ZIP creado correctamente
- [ ] Capturas de pantalla listas (mínimo 1)
- [ ] Descripción preparada
- [ ] Política de privacidad disponible
- [ ] Email de contacto verificado
- [ ] Íconos incluidos en el ZIP

### **Durante la Subida:**

- [ ] ZIP subido correctamente
- [ ] Información completa llenada
- [ ] Capturas de pantalla subidas
- [ ] Categoría seleccionada
- [ ] Política de privacidad agregada
- [ ] Revisión final de toda la información

### **Después de Subir:**

- [ ] Enviado para revisión
- [ ] Email de confirmación recibido
- [ ] Esperando aprobación (1-3 días)
- [ ] Extensión publicada
- [ ] Link compartido

---

## 🔟 **Comandos Útiles**

### **Verificar Versión:**
```powershell
Select-String -Path "manifest.json" -Pattern '"version"'
```

### **Ver Tamaño del ZIP:**
```powershell
Get-Item voice-scribe-v1.4.zip | Select-Object Name, Length
```

### **Listar Archivos en ZIP:**
```powershell
[System.IO.Compression.ZipFile]::OpenRead("voice-scribe-v1.4.zip").Entries | Select-Object Name
```

---

## 📧 **Contacto y Soporte**

**Email:** jonastantra@gmail.com

**Para ayuda con:**
- Subida a Chrome Web Store
- Problemas técnicos
- Preguntas sobre la extensión

---

## 🎉 **¡Éxito!**

Una vez publicada, tu extensión estará disponible para millones de usuarios en Chrome Web Store.

**¡Buena suerte con la publicación! 🚀**

