// Background script para manejar permisos del micrófono y el sidePanel
chrome.runtime.onInstalled.addListener(() => {
  console.log(chrome.i18n.getMessage('backgroundInstalled'));
  
  // Establecer modo por defecto
  chrome.storage.local.get(['displayMode'], (result) => {
    if (!result.displayMode) {
      chrome.storage.local.set({ 'displayMode': 'popup' });
    }
  });
});

// Manejar clic en el icono de la extensión
chrome.action.onClicked.addListener(async (tab) => {
  // Verificar el modo de visualización guardado
  const result = await chrome.storage.local.get(['displayMode']);
  const mode = result.displayMode || 'popup';
  
  console.log('Modo actual:', mode);
  
  if (mode === 'sidebar') {
    // Abrir sidebar
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
      console.log('Sidebar abierto');
    } catch (error) {
      console.error('Error al abrir sidebar:', error);
    }
  }
  // Si es 'popup', el comportamiento por defecto del manifest se encarga
});

// Manejar comandos de teclado
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-mode') {
    const result = await chrome.storage.local.get(['displayMode']);
    const currentMode = result.displayMode || 'popup';
    const newMode = currentMode === 'popup' ? 'sidebar' : 'popup';
    
    await chrome.storage.local.set({ 'displayMode': newMode });
    
    // Obtener la ventana activa
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (newMode === 'sidebar') {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } else {
      // Cerrar sidebar si está abierto
      await chrome.sidePanel.setOptions({
        enabled: false
      });
      // Reactivar para el próximo uso
      setTimeout(async () => {
        await chrome.sidePanel.setOptions({
          enabled: true
        });
      }, 100);
    }
  }
});

// Manejar mensajes del popup y sidebar
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Mensaje recibido:', request.action);
  
  if (request.action === 'openSidebar') {
    // Abrir el sidebar
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        try {
          await chrome.sidePanel.open({ windowId: tabs[0].windowId });
          console.log('Sidebar abierto desde popup');
          sendResponse({ success: true });
        } catch (error) {
          console.error('Error al abrir sidebar:', error);
          sendResponse({ success: false, error: error.message });
        }
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Mantener el canal abierto para sendResponse asíncrono
  }
  
  if (request.action === 'closeSidebar') {
    // El sidebar se cerrará cuando se cierre su ventana
    console.log('Solicitud de cierre de sidebar recibida');
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'requestMicrophonePermission') {
    console.log(chrome.i18n.getMessage('backgroundRequestingPermission'));
    
    // Verificar si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error(chrome.i18n.getMessage('errorNoMicrophone'));
      sendResponse({
        success: false,
        error: 'NotSupportedError',
        message: chrome.i18n.getMessage('errorNoMicrophone')
      });
      return true;
    }
    
    // Intentar obtener permisos del micrófono
    navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    })
      .then(stream => {
        console.log('Stream de audio obtenido correctamente');
        // Detener el stream inmediatamente
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Track de audio detenido:', track.kind);
        });
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error al solicitar permisos:', error);
        console.error('Nombre del error:', error.name);
        console.error('Mensaje del error:', error.message);
        
        sendResponse({ 
          success: false, 
          error: error.name,
          message: error.message 
        });
      });
    return true; // Indica que la respuesta será asíncrona
  }
}); 