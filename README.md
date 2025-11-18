# 🎙️ Voice Transcription + AI Summary

## Descripción General

**Voice Transcription + AI Summary** es una extensión de Chrome que permite transcribir voz a texto en tiempo real y generar resúmenes con inteligencia artificial. La extensión ofrece dos modos de visualización (popup compacto y sidebar expandido) para adaptarse a las necesidades del usuario.

**Versión actual:** 1.3.2

---

## 🌟 Características Principales

### 1. **Transcripción de Voz en Tiempo Real**
- Reconocimiento de voz continuo utilizando la Web Speech API
- Transcripción instantánea mientras hablas
- Soporte para 12 idiomas principales:
  - 🇪🇸 Español
  - 🇺🇸 Inglés
  - 🇧🇷 Portugués
  - 🇫🇷 Francés
  - 🇩🇪 Alemán
  - 🇮🇹 Italiano
  - 🇷🇺 Ruso
  - 🇨🇳 Chino
  - 🇯🇵 Japonés
  - 🇰🇷 Coreano
  - 🇸🇦 Árabe
  - 🇮🇳 Hindi

### 2. **Sistema de Modos Dual**
- **Modo Popup:** Interfaz compacta que se abre desde el ícono de la extensión
- **Modo Sidebar:** Panel lateral expandido para trabajar con mayor espacio
- Cambio entre modos mediante toggle visual
- Atajo de teclado: `Ctrl+Shift+T` (Windows/Linux) o `Cmd+Shift+T` (Mac)
- Estado persistente: la extensión recuerda tu modo preferido

### 3. **Generación de Resúmenes con IA**
- Integración con OpenAI API (GPT-4o-mini)
- Modo local sin API (resumen automático básico)
- Tres longitudes de resumen:
  - Corto (1 oración)
  - Medio (3 oraciones)
  - Largo (5 oraciones)
- Tres estilos de resumen:
  - General
  - Puntos clave (bullet points)
  - Detallado

### 4. **Exportación y Gestión de Contenido**
- **Guardar como TXT:** Descarga el texto transcrito y el resumen
- **Copiar al portapapeles:** Copia rápida del contenido completo
- **Limpieza de texto:** Borra transcripción y resumen con un clic
- **Persistencia:** El contenido se guarda automáticamente en el navegador

### 5. **Estadísticas en Tiempo Real**
- Contador de palabras
- Contador de caracteres
- Actualización automática mientras se transcribe

### 6. **Sistema de Calificación y Soporte**
- Calificación por estrellas (1-5)
- **1-3 estrellas:** Redirige a formulario de feedback para mejoras
- **4-5 estrellas:** Redirige a Chrome Web Store para dejar reseña
- Botón para copiar email de soporte: `jonastantra@gmail.com`

### 7. **Gestión de Permisos de Micrófono**
- Solicitud de permisos integrada
- Ventana dedicada para permisos si el popup no puede mostrar el prompt
- Manejo robusto de errores de micrófono
- Configuración de audio optimizada (cancelación de eco, supresión de ruido, control automático de ganancia)

### 8. **Internacionalización (i18n)**
- Interfaz traducida automáticamente según el idioma del navegador
- Soporte completo para español e inglés
- Sistema de traducciones extensible para más idiomas

---

## 🏗️ Arquitectura Técnica

### Archivos Principales

#### **Frontend**
- **`popup.html`** - Interfaz del modo popup compacto
- **`sidebar.html`** - Interfaz del modo sidebar expandido
- **`popup.js`** - Lógica del modo popup
- **`sidebar.js`** - Lógica del modo sidebar
- **`styles.css`** - Estilos compartidos para ambos modos
- **`permissions.html`** - Ventana dedicada para permisos del micrófono
- **`permissions.js`** - Lógica de solicitud de permisos

#### **Backend**
- **`background.js`** - Service Worker que gestiona:
  - Cambio entre modos (popup ↔ sidebar)
  - Apertura y cierre de sidepanels
  - Gestión de comandos de teclado
  - Estado de la aplicación

#### **Configuración**
- **`manifest.json`** - Configuración de la extensión
  - Permisos: `storage`, `sidePanel`
  - Host permissions: `https://api.openai.com/`
  - Comandos de teclado personalizados
  - Íconos en múltiples tamaños (16, 32, 48, 128)

#### **Traducciones**
- **`_locales/es/messages.json`** - Traducciones al español
- **`_locales/en/messages.json`** - Traducciones al inglés
- Sistema extensible para más idiomas

#### **Documentación**
- **`DUAL_MODE_FEATURE.md`** - Documentación del sistema de modos dual
- **`README.md`** - Este archivo

---

## 🔧 Funcionalidades Técnicas Detalladas

### Reconocimiento de Voz

```javascript
// Configuración de Web Speech API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = currentVoiceLang; // Idioma seleccionado
recognition.continuous = true;       // Grabación continua
recognition.interimResults = true;   // Resultados en tiempo real
```

**Características:**
- Manejo de resultados finales e intermedios
- Auto-reinicio si la grabación se detiene inesperadamente
- Manejo robusto de errores (permisos, red, hardware)

### Gestión de Estado

```javascript
// Chrome Storage Local
chrome.storage.local.set({
  'displayMode': 'sidebar',      // Modo preferido del usuario
  'voiceLang': 'es-ES',          // Idioma de transcripción
  'transcribedText': text,        // Texto transcrito
  'summaryText': summary          // Resumen generado
});
```

### Sistema de Comunicación

```javascript
// Mensajes entre componentes
chrome.runtime.sendMessage({
  action: 'openSidebar',
  action: 'closeSidebar',
  action: 'microphonePermissionResult'
});
```

### Integración con OpenAI API

```javascript
// Generación de resumen con IA
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0.7
  })
});
```

---

## 📱 Modos de Visualización

### Modo Popup (Compacto)
- Dimensiones: ~400px de ancho
- Se abre desde el ícono de la extensión
- Ideal para uso rápido
- Interfaz compacta y eficiente

### Modo Sidebar (Expandido)
- Panel lateral de navegador
- Mayor espacio para transcripciones largas
- Diseño más espaciado y cómodo
- Permanece abierto mientras trabajas

---

## 🎨 Interfaz de Usuario

### Secciones Principales

1. **Header**
   - Título de la extensión
   - Toggle de cambio de modo
   - Indicador visual del modo activo

2. **Grabación**
   - Selector de idioma
   - Botones de iniciar/detener
   - Indicador de estado (listo/grabando/detenido)
   - Animación de pulso durante grabación

3. **Transcripción**
   - Área de texto con scroll
   - Indicador de transcripción en tiempo real
   - Estadísticas (palabras/caracteres)
   - Botones de limpiar y generar resumen

4. **Resumen IA** (Collapsible)
   - Controles de longitud y estilo
   - Área de resumen (solo lectura)
   - Loading indicator

5. **Exportación** (Collapsible)
   - Guardar como TXT
   - Copiar al portapapeles

6. **Calificación y Soporte** (Collapsible)
   - 5 estrellas interactivas
   - Botón de email de soporte

7. **Footer**
   - Mensaje descriptivo de la extensión

---

## 🔐 Seguridad y Privacidad

- **Permisos mínimos:** Solo solicita permisos necesarios (storage, sidePanel, API de OpenAI)
- **Sin telemetría:** No se envía información de uso a servidores externos
- **Almacenamiento local:** Todo el contenido se guarda localmente en el navegador
- **API opcional:** La funcionalidad básica funciona sin necesidad de API keys

---

## 🚀 Casos de Uso

1. **Transcripción de reuniones:** Graba y transcribe reuniones en tiempo real
2. **Toma de notas por voz:** Dicta notas rápidamente sin escribir
3. **Transcripción de conferencias:** Captura el contenido de presentaciones
4. **Dictado de documentos:** Crea borradores de textos por voz
5. **Accesibilidad:** Herramienta para personas con dificultades de escritura
6. **Aprendizaje de idiomas:** Practica pronunciación y obtén transcripciones
7. **Resúmenes rápidos:** Genera resúmenes automáticos de transcripciones largas

---

## 🐛 Manejo de Errores

### Errores de Micrófono
- **NotAllowedError:** Permisos denegados → Abre ventana de permisos
- **NotFoundError:** No hay micrófono → Mensaje de error específico
- **NotReadableError:** Micrófono en uso → Mensaje de dispositivo ocupado
- **SecurityError:** Contexto no seguro → Mensaje de HTTPS requerido
- **NetworkError:** Error de red → Mensaje de conectividad

### Errores de Transcripción
- **no-speech:** No se detecta voz → Mensaje informativo
- **audio-capture:** Error de captura → Verificar micrófono
- **network:** Fallo de red → Verificar conexión
- **aborted:** Transcripción abortada → Reintentar

---

## 🔄 Flujo de Trabajo

1. **Usuario abre la extensión** → Se carga el modo guardado (popup o sidebar)
2. **Selecciona idioma** → Se guarda la preferencia
3. **Click en "Iniciar Grabación"** → Solicita permisos de micrófono si es necesario
4. **Habla** → Transcripción en tiempo real en el textarea
5. **Click en "Detener"** → Finaliza la grabación
6. **Click en "AI Summary"** → Genera resumen (con o sin API)
7. **Exporta o copia** → Descarga TXT o copia al portapapeles
8. **Califica la extensión** → Sistema de estrellas con redirección automática

---

## 📊 Estadísticas y Métricas

La extensión proporciona:
- **Contador de palabras:** Actualización en tiempo real
- **Contador de caracteres:** Incluye espacios
- **Indicador de grabación activa:** Visual con animación
- **Estado del sistema:** Ready/Recording/Stopped

---

## 🌐 Enlaces Importantes

- **Chrome Web Store:** https://chromewebstore.google.com/detail/voice-transcription-+-ai/pcklabcphhbkoghekdbpcplmjbdkfnbi?authuser=0&hl=es-419
- **Formulario de Feedback:** https://forms.gle/HFFV3wvNPEChqmGN6
- **Email de Soporte:** jonastantra@gmail.com
- **Repositorio GitHub:** https://github.com/jonastantra/Voice-Scribe-SitioWeb.git

---

## 📝 Notas para Desarrollo

### Para Agregar un Nuevo Idioma:
1. Agregar opción en `popup.html` y `sidebar.html`
2. Crear carpeta en `_locales/[codigo-idioma]/`
3. Crear `messages.json` con todas las traducciones
4. Actualizar selector de idioma con bandera emoji

### Para Agregar una Nueva Característica:
1. Actualizar `popup.html` y `sidebar.html` si es UI
2. Implementar lógica en `popup.js` y `sidebar.js`
3. Actualizar `styles.css` para estilos
4. Actualizar `manifest.json` si requiere nuevos permisos
5. Agregar traducciones en `messages.json` (es/en)
6. Actualizar este README.md
7. Incrementar versión en `manifest.json`

### Estructura de Commits:
- ✨ Feature: Nueva funcionalidad
- 🐛 Fix: Corrección de bug
- 🔖 Version: Cambio de versión
- 📝 Docs: Documentación
- 🎨 Style: Cambios de UI/CSS
- ♻️ Refactor: Refactorización de código

---

## 🎯 Roadmap Futuro

- [ ] Soporte para más idiomas de transcripción
- [ ] Exportación a múltiples formatos (PDF, DOCX)
- [ ] Integración con más servicios de IA (Claude, Gemini)
- [ ] Transcripción de audio desde archivos
- [ ] Historial de transcripciones
- [ ] Búsqueda en transcripciones
- [ ] Compartir transcripciones
- [ ] Modo oscuro
- [ ] Personalización de temas

---

## 📄 Licencia

Esta extensión está desarrollada para uso personal y educativo. Todos los derechos reservados.

---

## 👨‍💻 Autor

**Jonas Tantra**
- Email: jonastantra@gmail.com
- Versión: 1.3.2
- Última actualización: Noviembre 2025

---

## 🙏 Agradecimientos

- Web Speech API por el reconocimiento de voz
- OpenAI por la API de generación de resúmenes
- Chrome Extensions API por las capacidades de extensión
- Comunidad de usuarios por el feedback continuo