# 🎯 Sistema de Doble Modo de Visualización

## Descripción General

La extensión VoiceScribe ahora incluye **dos modos de visualización** para adaptarse a diferentes necesidades y preferencias del usuario:

### 🔲 Modo Flotante (Popup)
- Cuadro compacto que aparece al hacer clic en el ícono de la extensión
- Diseño centrado y optimizado para uso rápido
- Se cierra automáticamente al hacer clic fuera o presionar ESC
- Ideal para transcripciones cortas y uso ocasional

### ⬛ Modo Panel Lateral (Sidebar)
- Panel que se abre del lado derecho de la ventana de Chrome
- Ocupa todo el alto de la ventana del navegador
- Desplaza el contenido de la página hacia la izquierda
- Ancho adaptativo: 450px (monitores grandes), 350px (monitores pequeños)
- Ideal para sesiones largas de transcripción y trabajo paralelo

---

## 🎨 Características Principales

### Switch de Modo
- **Ubicación**: Parte superior de la interfaz (sticky header)
- **Diseño**: Dos botones visuales con iconos intuitivos
- **Persistencia**: La preferencia del usuario se guarda automáticamente
- **Transición suave**: Animaciones fluidas al cambiar de modo

### Responsive Design
- **Monitores grandes (>1366px)**: Sidebar de 450px
- **Monitores pequeños (≤1366px)**: Sidebar de 350px  
- **Tablets**: Adaptación automática al ancho disponible
- **Móviles**: Diseño optimizado en columna única

### Dark Mode
- **Detección automática**: Sigue la preferencia del sistema operativo
- **Paleta optimizada**: Colores ajustados para mejor legibilidad
- **Transiciones suaves**: Cambios visuales sin interrupciones

### Accesibilidad
- **Atajo de teclado**: Ctrl+Shift+T (Cmd+Shift+T en Mac)
- **Focus visible**: Indicadores claros para navegación por teclado
- **Contraste mejorado**: Cumple con estándares WCAG

---

## 🔧 Implementación Técnica

### Archivos Nuevos

#### `sidebar.html`
- Estructura HTML del panel lateral
- Incluye el mode switcher en la parte superior
- Mismo contenido funcional que popup pero optimizado para espacio vertical

#### `sidebar.js`
- Lógica completa del panel lateral
- Manejo de transcripción de voz
- Gestión de cambio de modo
- Sincronización con chrome.storage

#### `DUAL_MODE_FEATURE.md`
- Este archivo de documentación

### Archivos Modificados

#### `manifest.json`
- **Versión actualizada**: 1.4.0.0
- **Nuevo permiso**: `sidePanel`
- **Configuración side_panel**: `sidebar.html` como default_path
- **Comando de teclado**: `toggle-mode` (Ctrl+Shift+T)

#### `background.js`
- Manejo de apertura del sidePanel
- Gestión del comando de teclado toggle-mode
- Sincronización del modo de visualización preferido
- Manejo del clic en el icono de la extensión

#### `popup.html` y `popup.js`
- Integración del mode switcher
- Lógica para cambiar a modo sidebar
- Cierre automático del popup al cambiar de modo

#### `styles.css`
- **+400 líneas** de nuevos estilos
- Variables CSS para fácil personalización
- Estilos del mode switcher
- Estilos específicos del sidebar
- Media queries para responsive design
- Soporte completo para dark mode
- Animaciones de transición

#### Archivos i18n
- `_locales/es/messages.json`: Traducciones en español
- `_locales/en/messages.json`: Traducciones en inglés
- Nuevas claves: `modePopup`, `modeSidebar`

---

## 📋 Uso

### Cambiar de Modo

#### Método 1: Botones visuales
1. Abre la extensión (popup o sidebar)
2. En la parte superior verás dos botones:
   - 🔲 **Flotante**: Activa el modo popup
   - ⬛ **Panel Lateral**: Activa el modo sidebar
3. Haz clic en el botón deseado
4. La extensión cambiará automáticamente de modo

#### Método 2: Atajo de teclado
- **Windows/Linux**: Presiona `Ctrl + Shift + T`
- **Mac**: Presiona `Cmd + Shift + T`
- El modo alternará automáticamente entre popup y sidebar

#### Método 3: Clic en el icono
- Si el modo guardado es "sidebar", el clic abrirá el panel lateral
- Si el modo guardado es "popup", el clic abrirá el popup flotante

### Persistencia
- Tu elección de modo se guarda automáticamente
- Al reabrir la extensión, se utilizará tu última preferencia
- La configuración se sincroniza entre sesiones

---

## 🎯 Casos de Uso

### Modo Flotante - Ideal para:
- ✅ Transcripciones rápidas y cortas
- ✅ Notas breves en reuniones
- ✅ Uso ocasional de la extensión
- ✅ Cuando necesitas que la ventana se cierre automáticamente
- ✅ Dispositivos con pantallas pequeñas

### Modo Panel Lateral - Ideal para:
- ✅ Sesiones largas de transcripción
- ✅ Trabajar mientras navegas por otras páginas
- ✅ Transcripciones de conferencias o webinars
- ✅ Necesidad de ver transcripción y contenido web simultáneamente
- ✅ Monitores grandes con espacio horizontal disponible

---

## 🚀 Ventajas Técnicas

### Performance
- **Lazy loading**: Solo carga el modo que el usuario necesita
- **Memoria optimizada**: No mantiene ambos modos en memoria
- **Sincronización eficiente**: Usa chrome.storage.local para persistencia rápida

### Compatibilidad
- **Chrome MV3**: Utiliza la API oficial de Side Panel
- **Fallback**: Funcionamiento garantizado en navegadores compatibles
- **Progressive enhancement**: La funcionalidad básica funciona sin JavaScript avanzado

### Mantenibilidad
- **Código compartido**: Misma lógica de transcripción en ambos modos
- **CSS modular**: Estilos reutilizables y fáciles de modificar
- **Documentación completa**: Comentarios en código y esta documentación

---

## 🔄 Flujo de Cambio de Modo

```
Usuario hace clic en botón sidebar
    ↓
popup.js: guarda preferencia 'sidebar' en chrome.storage
    ↓
popup.js: envía mensaje 'openSidebar' a background
    ↓
background.js: recibe mensaje y abre sidePanel
    ↓
popup.js: cierra el popup
    ↓
sidebar.html: se abre como panel lateral
    ↓
sidebar.js: carga estado y continúa funcionamiento
```

---

## 🎨 Personalización

### Variables CSS Disponibles

```css
:root {
  /* Colores principales */
  --primary-color: #007bff;
  --primary-hover: #0056b3;
  
  /* Espaciado */
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  
  /* Bordes */
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Transiciones */
  --transition-normal: 0.3s ease;
}
```

### Modificar Anchos del Sidebar

```css
/* En styles.css, buscar: */
body.sidebar-mode {
    max-width: 450px; /* Cambiar este valor */
}

/* Para monitores pequeños: */
@media (max-width: 1366px) {
    body.sidebar-mode {
        max-width: 350px; /* Cambiar este valor */
    }
}
```

---

## 🐛 Resolución de Problemas

### El sidebar no se abre
1. Verifica que estés usando Chrome versión 114+
2. Verifica que el permiso `sidePanel` esté en el manifest
3. Revisa la consola de background script para errores
4. Intenta recargar la extensión

### El modo no persiste
1. Verifica que chrome.storage tenga permisos
2. Revisa la consola del navegador para errores
3. Intenta limpiar el storage y volver a configurar

### Problemas de responsive
1. Verifica el ancho de tu monitor
2. Abre DevTools y comprueba las media queries activas
3. Ajusta las variables CSS según tus necesidades

---

## 📊 Estadísticas de Implementación

- **Líneas de código añadidas**: ~1,500
- **Archivos nuevos**: 2 (sidebar.html, sidebar.js)
- **Archivos modificados**: 7
- **Nuevas traducciones**: 2 claves en 2 idiomas
- **CSS adicional**: ~400 líneas
- **Versión**: 1.4.0.0

---

## 🔮 Futuras Mejoras

### Planeadas
- [ ] Posición del sidebar configurable (izquierda/derecha)
- [ ] Ancho del sidebar ajustable mediante drag
- [ ] Mini-modo con transcripción flotante transparente
- [ ] Shortcuts personalizables
- [ ] Temas de color personalizados

### En Consideración
- [ ] Modo picture-in-picture para transcripción
- [ ] Sincronización de estado entre múltiples ventanas
- [ ] Historial de modos usados
- [ ] Modo automático según tamaño de pantalla

---

## 📝 Notas de Versión

### v1.4.0.0 (2024-11-17)
- ✨ **NUEVO**: Sistema de doble modo (Popup + Sidebar)
- ✨ **NUEVO**: Mode switcher con botones visuales
- ✨ **NUEVO**: Atajo de teclado Ctrl+Shift+T
- ✨ **NUEVO**: Responsive design completo
- ✨ **NUEVO**: Dark mode automático
- ✨ **NUEVO**: Persistencia de preferencia de modo
- 🎨 **MEJORA**: Estilos modernos con variables CSS
- 🎨 **MEJORA**: Animaciones suaves de transición
- 📱 **MEJORA**: Soporte para pantallas de todos los tamaños
- ♿ **MEJORA**: Mejor accesibilidad con focus visible
- 🌍 **MEJORA**: Traducciones para nuevas características

---

## 👨‍💻 Autor

**VoiceScribe Team**  
📧 jonastantra@gmail.com  
🌐 [Chrome Web Store](https://chromewebstore.google.com/detail/voice-transcription-+-ai/pcklabcphhbkoghekdbpcplmjbdkfnbi)

---

## 📄 Licencia

Este proyecto mantiene la misma licencia que la extensión principal VoiceScribe.

---

## 🙏 Agradecimientos

Gracias a todos los usuarios que solicitaron esta característica y proporcionaron feedback valioso durante el desarrollo.

**¿Tienes sugerencias o encontraste un bug?**  
Por favor, contáctanos en jonastantra@gmail.com o deja una reseña en la Chrome Web Store.

---

**Última actualización**: 2024-11-17  
**Versión del documento**: 1.0