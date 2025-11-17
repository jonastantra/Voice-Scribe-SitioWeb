document.addEventListener('DOMContentLoaded', () => {
  // Cargar traducciones i18n
  loadI18nMessages();
  
  const askBtn = document.getElementById('askBtn');
  const status = document.getElementById('status');

  function loadI18nMessages() {
    // Traducir elementos con atributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const message = chrome.i18n.getMessage(key);
      if (message) {
        element.textContent = message;
      }
    });
    
    // Actualizar título de la página
    document.title = chrome.i18n.getMessage('permissionsTitle');
  }

  async function request() {
    status.textContent = chrome.i18n.getMessage('statusRequestingPermissions');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = chrome.i18n.getMessage('errorNoMicrophone');
        chrome.runtime.sendMessage({ action: 'microphonePermissionResult', success: false });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      // detener
      stream.getTracks().forEach(t => t.stop());
      status.textContent = chrome.i18n.getMessage('statusPermissionsGranted');
      chrome.runtime.sendMessage({ action: 'microphonePermissionResult', success: true });
      window.close();
    } catch (err) {
      console.error('Permiso de micrófono rechazado:', err);
      status.textContent = `Error: ${err?.name || ''} ${err?.message || ''}`.trim();
      chrome.runtime.sendMessage({ action: 'microphonePermissionResult', success: false, error: err?.name, message: err?.message });
    }
  }

  askBtn.addEventListener('click', request);

  // Intentar automáticamente al abrir la ventana
  setTimeout(request, 200);
});


