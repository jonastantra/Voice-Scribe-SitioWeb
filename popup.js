document.addEventListener('DOMContentLoaded', async function() {
    // Cargar traducciones i18n primero
    loadI18nMessages();
    
    // Detectar idioma del navegador para la interfaz
    const browserLang = chrome.i18n.getUILanguage();
    const isSpanish = browserLang.startsWith('es');
    
    // Elementos del DOM
    const voiceLangSelect = document.getElementById('voiceLangSelect');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const summaryBtn = document.getElementById('summaryBtn');
    const saveBtn = document.getElementById('saveBtn');
    const copyBtn = document.getElementById('copyBtn');
    const transcribedText = document.getElementById('transcribedText');
    const summaryText = document.getElementById('summaryText');
    const summaryLength = document.getElementById('summaryLength');
    const summaryStyle = document.getElementById('summaryStyle');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const summaryLoader = document.getElementById('summaryLoader');
    const realTimeIndicator = document.getElementById('realTimeIndicator');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const copyTranscriptionBtn = document.getElementById('copyTranscriptionBtn');
    
    // Toggle de cambio de modo
    const modeToggleCheckbox = document.getElementById('modeToggleCheckbox');
    const viewToggle = document.getElementById('viewToggle');
    const sidebarHintBanner = document.getElementById('sidebarHintBanner');
    const closeBanner = document.getElementById('closeBanner');
    
    // Variables para el reconocimiento de voz
    let recognition;
    let isRecording = false;
    let finalTranscript = '';
    let currentVoiceLang = isSpanish ? 'es-ES' : 'en-US';
    
    // Cargar idioma de voz guardado o establecer por defecto
    chrome.storage.local.get(['voiceLang'], function(result) {
        if (result.voiceLang) {
            currentVoiceLang = result.voiceLang;
            voiceLangSelect.value = result.voiceLang;
        } else {
            voiceLangSelect.value = currentVoiceLang;
        }
    });
    
    // Actualizar idioma de voz cuando cambia el selector
    voiceLangSelect.addEventListener('change', function() {
        currentVoiceLang = voiceLangSelect.value;
        chrome.storage.local.set({ 'voiceLang': currentVoiceLang });
        
        // Si está grabando, detener y reiniciar con el nuevo idioma
        if (isRecording) {
            stopRecording();
            setTimeout(() => {
                startRecording();
            }, 500);
        }
    });
    
    // ==========================================
    // FUNCIONALIDAD DE CAMBIO DE MODO (TOGGLE)
    // ==========================================
    
    // Inicializar estado del toggle (popup mode)
    if (modeToggleCheckbox) {
        modeToggleCheckbox.checked = false;
    }
    
    // Manejar cambio de modo con el toggle
    if (viewToggle) {
        viewToggle.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isCurrentlyPopup = !modeToggleCheckbox.checked;
            
            if (isCurrentlyPopup) {
                // Cambiar a modo SIDEBAR
                console.log('Toggle clickeado, cambiando a modo sidebar...');
                
                try {
                    // Cambiar a modo sidebar y guardarlo como preferencia
                    await chrome.storage.local.set({ 'displayMode': 'sidebar' });
                    console.log('Preferencia guardada: modo sidebar');
                    
                    // Obtener la pestaña activa
                    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                    
                    if (tab && tab.windowId) {
                        // Abrir el sidebar directamente (esto FUNCIONA porque es respuesta a un clic)
                        await chrome.sidePanel.open({ windowId: tab.windowId });
                        console.log('✅ Sidebar abierto exitosamente - Ya NO se cerrará');
                        
                        // Cerrar el popup después de un pequeño delay
                        setTimeout(() => {
                            window.close();
                        }, 100);
                    } else {
                        console.error('No se pudo obtener la pestaña activa');
                        alert('Error al abrir el panel lateral. Por favor, intenta de nuevo.');
                    }
                } catch (error) {
                    console.error('Error al cambiar a modo sidebar:', error);
                    alert('Error al abrir el panel lateral: ' + error.message);
                }
            } else {
                // Ya está en sidebar, cambiar a popup
                await chrome.storage.local.set({ 'displayMode': 'popup' });
                console.log('Preferencia cambiada a popup (se cerrará al hacer clic fuera)');
                modeToggleCheckbox.checked = false;
            }
        });
    }
    
    // Clave de API de OpenAI (¡IMPORTANTE: Reemplaza con tu propia clave!)
    const OPENAI_API_KEY = 'tu-api-key-aqui';
    
    // Variable para almacenar el estado de conectividad del servidor
    let serverStatus = {
        openai: 'unknown', // 'online', 'offline', 'unknown'
        lastCheck: null
    };
    
    // Función para verificar el estado de la API de OpenAI
    async function checkServerStatus() {
        // Solo verificar si se está usando la API de OpenAI
        if (OPENAI_API_KEY === 'tu-api-key-aqui') {
            serverStatus.openai = 'not-configured';
            return { success: true, mode: 'local' };
        }
        
        try {
            console.log('Verificando estado del servidor OpenAI...');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
            
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                serverStatus.openai = 'online';
                serverStatus.lastCheck = Date.now();
                console.log('✅ Servidor OpenAI: Online');
                return { success: true, mode: 'api' };
            } else if (response.status === 401) {
                serverStatus.openai = 'auth-error';
                console.warn('⚠️ Error de autenticación con OpenAI API');
                return { success: false, error: 'auth', message: isSpanish ? 'Clave API inválida' : 'Invalid API key' };
            } else {
                serverStatus.openai = 'error';
                console.warn('⚠️ Error del servidor OpenAI:', response.status);
                return { success: false, error: 'server', message: isSpanish ? 'Error del servidor' : 'Server error' };
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                serverStatus.openai = 'timeout';
                console.error('❌ Timeout al conectar con OpenAI');
                return { success: false, error: 'timeout', message: isSpanish ? 'Tiempo de espera agotado' : 'Connection timeout' };
            } else {
                serverStatus.openai = 'offline';
                console.error('❌ No se pudo conectar con OpenAI:', error);
                return { success: false, error: 'network', message: isSpanish ? 'Sin conexión al servidor' : 'No server connection' };
            }
        }
    }
    
    // Función para solicitar permisos del micrófono directamente desde el popup (MV3 no permite getUserMedia en background)
    async function requestMicrophonePermission() {
        try {
            console.log('Solicitando permisos del micrófono (popup)...');

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                statusText.textContent = chrome.i18n.getMessage('errorNoMicrophone');
                return false;
            }

            // Solicitar permiso directamente (tras gesto del usuario)
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Detener inmediatamente (solo necesitamos el permiso)
            stream.getTracks().forEach(track => track.stop());
            console.log('Permisos del micrófono concedidos');
            statusText.textContent = chrome.i18n.getMessage('statusPermissionsGranted');
            return true;
        } catch (error) {
            console.error('Error al solicitar permisos de micrófono:', error, 'name:', error?.name, 'message:', error?.message);

            // Si el popup no puede mostrar el prompt de permisos, abrir una ventana dedicada
            if (error && (error.name === 'NotAllowedError' || error.name === 'AbortError' || error.name === 'InvalidStateError')) {
                statusText.textContent = chrome.i18n.getMessage('statusPermissionWindow');
                const permitted = await openPermissionWindowAndWait();
                if (permitted) {
                    statusText.textContent = chrome.i18n.getMessage('statusPermissionsGrantedFromWindow');
                    return true;
                }
                statusText.textContent = chrome.i18n.getMessage('statusPermissionsNotGranted');
                return false;
            }

            switch (error?.name) {
                case 'NotFoundError':
                    statusText.textContent = chrome.i18n.getMessage('errorNoDevice');
                    break;
                case 'NotReadableError':
                    statusText.textContent = chrome.i18n.getMessage('errorDeviceBusy');
                    break;
                case 'SecurityError':
                    statusText.textContent = chrome.i18n.getMessage('errorNotSecure');
                    break;
                default:
                    statusText.textContent = `Error: ${error?.message || chrome.i18n.getMessage('errorNoMicrophone')}`;
            }
            return false;
        }
    }

    // Abre una ventana de permisos y espera el resultado
    function openPermissionWindowAndWait() {
        return new Promise((resolve) => {
            let resolved = false;
            const width = 520;
            const height = 420;

            chrome.windows.create({
                url: 'permissions.html',
                type: 'popup',
                width,
                height
            }, (createdWindow) => {
                const windowId = createdWindow?.id;

                const timeoutId = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve(false);
                        if (windowId) chrome.windows.remove(windowId);
                    }
                }, 60000);

                const listener = (message) => {
                    if (message && message.action === 'microphonePermissionResult') {
                        chrome.runtime.onMessage.removeListener(listener);
                        clearTimeout(timeoutId);
                        if (!resolved) {
                            resolved = true;
                            resolve(Boolean(message.success));
                            if (windowId) chrome.windows.remove(windowId);
                        }
                    }
                };

                chrome.runtime.onMessage.addListener(listener);
            });
        });
    }
    
    // Función para cargar mensajes i18n en elementos HTML
    function loadI18nMessages() {
        // Traducir elementos con atributo data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.textContent = message;
            }
        });
        
        // Traducir placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.placeholder = message;
            }
        });
        
        // Actualizar título de la página
        document.title = chrome.i18n.getMessage('extTitle');
    }
    
    // Función para actualizar estadísticas del texto
    function updateTextStats() {
        const text = transcribedText.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        wordCount.textContent = chrome.i18n.getMessage('wordCount', [words.toString()]);
        charCount.textContent = chrome.i18n.getMessage('charCount', [chars.toString()]);
    }
    
    // Función para inicializar el reconocimiento de voz
    function initRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.lang = currentVoiceLang;
            recognition.continuous = true;
            recognition.interimResults = true;
        
        recognition.onstart = () => {
            isRecording = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusDot.classList.add('active');
            statusText.textContent = chrome.i18n.getMessage('statusRecording');
            transcribedText.value = '';
            finalTranscript = '';
            realTimeIndicator.classList.add('show');
        };
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    // Agregar al texto final
                    finalTranscript += transcript;
                } else {
                    // Texto provisional (en tiempo real)
                    interimTranscript += transcript;
                }
            }
            
            // Mostrar texto final + texto provisional
            transcribedText.value = finalTranscript + interimTranscript;
            
            // Actualizar estadísticas
            updateTextStats();
            
            // Hacer scroll automático al final
            transcribedText.scrollTop = transcribedText.scrollHeight;
        };
        
        recognition.onerror = (event) => {
            console.error('Error en reconocimiento:', event.error);
            stopRecording();
            
            // Manejo específico de errores
            switch(event.error) {
                case 'not-allowed':
                    statusText.textContent = chrome.i18n.getMessage('errorPermissionDenied');
                    alert(chrome.i18n.getMessage('alertPermissionRequest'));
                    break;
                case 'no-speech':
                    statusText.textContent = chrome.i18n.getMessage('errorNoSpeech');
                    break;
                case 'audio-capture':
                    statusText.textContent = chrome.i18n.getMessage('errorAudioCapture');
                    break;
                case 'network':
                    statusText.textContent = chrome.i18n.getMessage('errorNetwork');
                    break;
                case 'aborted':
                    statusText.textContent = chrome.i18n.getMessage('errorAborted');
                    break;
                default:
                    statusText.textContent = `Error: ${event.error}`;
            }
        };
        
        recognition.onend = () => {
            if (isRecording) {
                // Si se detiene inesperadamente, reiniciar
                console.log('Reiniciando reconocimiento...');
                setTimeout(() => {
                    if (isRecording) {
                        recognition.start();
                    }
                }, 100);
            }
        };
        } else {
            alert(chrome.i18n.getMessage('alertNoSupport'));
        }
    }
    
    // Inicializar reconocimiento al cargar
    initRecognition();
    
    // Eventos de los botones
    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    clearBtn.addEventListener('click', clearText);
    summaryBtn.addEventListener('click', generateSummary);
    saveBtn.addEventListener('click', saveToFile);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Evento para copiar solo la transcripción
    if (copyTranscriptionBtn) {
        copyTranscriptionBtn.addEventListener('click', copyTranscriptionOnly);
    }
    
    // Evento para actualizar estadísticas cuando cambia el texto
    transcribedText.addEventListener('input', updateTextStats);
    
    async function startRecording() {
        if (!recognition) {
            alert(chrome.i18n.getMessage('alertNotAvailable'));
            return;
        }
        
        // Cambiar el estado del botón inmediatamente para feedback visual
        startBtn.disabled = true;
        statusText.textContent = chrome.i18n.getMessage('statusRequestingPermissions');
        
        // Solicitar permisos del micrófono primero
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            startBtn.disabled = false;
            return;
        }
        
        try {
            statusText.textContent = chrome.i18n.getMessage('statusStarting');
            // Reinicializar con el idioma actual antes de empezar
            if (recognition) {
                recognition.lang = currentVoiceLang;
            }
            recognition.start();
        } catch (error) {
            console.error('Error al iniciar grabación:', error);
            statusText.textContent = chrome.i18n.getMessage('errorStartRecording');
            startBtn.disabled = false;
        }
    }
    
    function stopRecording() {
        if (recognition) {
            recognition.stop();
            isRecording = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            statusDot.classList.remove('active');
            statusText.textContent = chrome.i18n.getMessage('statusStopped');
            realTimeIndicator.classList.remove('show');
        }
    }
    
    function clearText() {
        transcribedText.value = '';
        summaryText.value = '';
        finalTranscript = '';
        statusText.textContent = chrome.i18n.getMessage('statusReady');
        updateTextStats();
    }
    
    async function generateSummary() {
        const text = transcribedText.value.trim();
        if (!text) {
            alert(chrome.i18n.getMessage('alertNoTextToSummarize'));
            return;
        }
        
        // Mostrar loader
        summaryLoader.style.display = 'inline-block';
        summaryBtn.disabled = true;
        
        try {
            // Intentar usar el proxy seguro para generar resumen
            try {
                console.log('🔍 Generando resumen con API segura...');
                await generateOpenAISummary(text);
            } catch (error) {
                console.warn('⚠️ Fallo al usar API, intentando resumen local...', error);
                // Fallback a local
                console.log('📝 Generando resumen local...');
                const summary = generateLocalSummary(text, summaryLength.value, summaryStyle.value);
                summaryText.value = summary;
            }
            
        } catch (error) {
            console.error('Error al generar resumen:', error);
            const errorMsg = isSpanish 
                ? '❌ Error al generar resumen: ' + (error.message || 'Error desconocido')
                : '❌ Error generating summary: ' + (error.message || 'Unknown error');
            alert(errorMsg);
        } finally {
            summaryLoader.style.display = 'none';
            summaryBtn.disabled = false;
        }
    }
    
    // Función para generar resumen con OpenAI
    async function generateOpenAISummary(text) {
        const lengthMap = {
            'short': isSpanish ? 'corto' : 'short',
            'medium': isSpanish ? 'medio' : 'medium',
            'long': isSpanish ? 'largo' : 'long'
        };
        
        const styleMap = {
            'general': isSpanish ? 'general' : 'general',
            'bullet': isSpanish ? 'en puntos clave' : 'in key points',
            'detailed': isSpanish ? 'detallado' : 'detailed'
        };
        
        const languageInstruction = isSpanish ? 'en español' : 'in English';
        const promptInstruction = isSpanish ? 'Genera un resumen' : 'Generate a summary';
        const styleInstruction = isSpanish ? 'de estilo' : 'in style';
        const textInstruction = isSpanish ? 'del siguiente texto' : 'of the following text';
        
        console.log(`Generando resumen: ${summaryLength.value} (${lengthMap[summaryLength.value]}) - ${summaryStyle.value} (${styleMap[summaryStyle.value]})`);
        const prompt = `${promptInstruction} ${lengthMap[summaryLength.value]} ${styleInstruction} ${styleMap[summaryStyle.value]} ${textInstruction} ${languageInstruction}: ${text}`;
        
        // URL del Proxy (Debe ser actualizada por el usuario)
        const API_PROXY_URL = 'https://tusubdominio.hostinger.com/api/proxy.php';
        
        const response = await fetch(API_PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: summaryLength.value === 'long' ? 300 : 150,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error de API: ${response.status}`);
        }
        
        const data = await response.json();
        const summary = data.choices[0].message.content.trim();
        summaryText.value = summary;
    }
    
    // Función para generar resumen local sin API
    function generateLocalSummary(text, length, style) {
        console.log(`Generando resumen local: ${length} - ${style}`);
        // Dividir el texto en oraciones
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        
        if (sentences.length === 0) {
            return chrome.i18n.getMessage('localSummaryError');
        }
        
        // Seleccionar oraciones según la longitud deseada
        let selectedSentences;
        switch(length) {
            case 'short':
                selectedSentences = sentences.slice(0, 1);
                break;
            case 'medium':
                selectedSentences = sentences.slice(0, Math.min(3, sentences.length));
                break;
            case 'long':
                selectedSentences = sentences.slice(0, Math.min(5, sentences.length));
                break;
            default:
                selectedSentences = sentences.slice(0, Math.min(3, sentences.length));
        }
        
        // Generar resumen según el estilo
        let summary = '';
        switch(style) {
            case 'bullet':
                summary = chrome.i18n.getMessage('localSummaryKeyPoints') + '\n' + selectedSentences.map((sentence, index) =>
                    `• ${sentence.trim()}`).join('\n');
                break;
            case 'detailed':
                summary = chrome.i18n.getMessage('localSummaryDetailed') + '\n' + selectedSentences.join('. ');
                break;
            default:
                summary = chrome.i18n.getMessage('localSummaryGeneral') + ' ' + selectedSentences.join('. ');
        }
        
        // Agregar puntos finales si no los tienen
        if (!summary.endsWith('.') && !summary.endsWith('!') && !summary.endsWith('?')) {
            summary += '.';
        }
        
        return summary;
    }
    
    // Función para guardar como archivo
    function saveToFile() {
        const text = transcribedText.value.trim();
        const summary = summaryText.value.trim();
        
        if (!text && !summary) {
            alert(chrome.i18n.getMessage('alertNoContentToSave'));
            return;
        }
        
        let content = '';
        if (text) {
            content += chrome.i18n.getMessage('transcribedTextHeader') + '\n\n';
            content += text + '\n\n';
        }
        
        if (summary) {
            content += chrome.i18n.getMessage('summaryHeader') + '\n\n';
            content += summary + '\n\n';
        }
        
        const locale = isSpanish ? 'es-ES' : 'en-US';
        content += `\n${chrome.i18n.getMessage('generatedOn')} ${new Date().toLocaleString(locale)}`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcripcion_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Función para copiar solo la transcripción
    async function copyTranscriptionOnly() {
        const text = transcribedText.value.trim();
        
        if (!text) {
            alert(chrome.i18n.getMessage('alertNoTranscriptionToCopy'));
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            // Feedback visual
            const originalText = copyTranscriptionBtn.innerHTML;
            copyTranscriptionBtn.innerHTML = '✓ ' + chrome.i18n.getMessage('alertTranscriptionCopied').replace('¡', '').replace('!', '');
            copyTranscriptionBtn.style.background = 'var(--success-green)';
            copyTranscriptionBtn.style.color = 'white';
            copyTranscriptionBtn.style.borderColor = 'var(--success-green)';
            
            setTimeout(() => {
                copyTranscriptionBtn.innerHTML = originalText;
                copyTranscriptionBtn.style.background = '';
                copyTranscriptionBtn.style.color = '';
                copyTranscriptionBtn.style.borderColor = '';
            }, 2000);
        } catch (error) {
            console.error('Error al copiar transcripción:', error);
            alert(chrome.i18n.getMessage('alertCopyError'));
        }
    }
    
    // Función para copiar al portapapeles
    async function copyToClipboard() {
        const text = transcribedText.value.trim();
        const summary = summaryText.value.trim();
        
        if (!text && !summary) {
            alert(chrome.i18n.getMessage('alertNoContentToCopy'));
            return;
        }
        
        let content = '';
        if (text) {
            content += chrome.i18n.getMessage('transcribedTextHeader') + '\n\n';
            content += text + '\n\n';
        }
        
        if (summary) {
            content += chrome.i18n.getMessage('summaryHeader') + '\n\n';
            content += summary;
        }
        
        try {
            await navigator.clipboard.writeText(content);
            alert(chrome.i18n.getMessage('alertCopiedToClipboard'));
        } catch (error) {
            console.error('Error al copiar:', error);
            alert(chrome.i18n.getMessage('alertCopyError'));
        }
    }
    
    // Cargar texto guardado al abrir el popup
    chrome.storage.local.get(['transcribedText', 'summaryText'], function(result) {
        if (result.transcribedText) {
            transcribedText.value = result.transcribedText;
            finalTranscript = result.transcribedText;
        }
        if (result.summaryText) {
            summaryText.value = result.summaryText;
        }
        updateTextStats();
    });
    
    // Guardar texto cuando cambia
    transcribedText.addEventListener('input', function() {
        chrome.storage.local.set({ 'transcribedText': transcribedText.value });
    });
    
    summaryText.addEventListener('input', function() {
        chrome.storage.local.set({ 'summaryText': summaryText.value });
    });
    
    // Inicializar estadísticas
    updateTextStats();
    
    // ==========================================
    // INICIALIZACIÓN DE PREFERENCIAS Y BANNER
    // ==========================================
    
    // Cargar preferencia de modo
    const modePreference = await chrome.storage.local.get(['displayMode']);
    const preferredMode = modePreference.displayMode || 'popup';
    
    console.log('Preferencia de modo cargada:', preferredMode);
    
    // Si la preferencia es sidebar, marcar el toggle visualmente
    if (preferredMode === 'sidebar' && modeToggleCheckbox) {
        console.log('💡 Preferencia guardada: Sidebar');
        modeToggleCheckbox.checked = true;
    }
    
    // Mostrar banner informativo si el usuario no ha usado el sidebar
    chrome.storage.local.get(['sidebarHintDismissed'], (result) => {
        if (!result.sidebarHintDismissed && preferredMode !== 'sidebar') {
            setTimeout(() => {
                if (sidebarHintBanner) {
                    sidebarHintBanner.style.display = 'block';
                }
            }, 1000);
        }
    });
    
    // Cerrar banner
    if (closeBanner) {
        closeBanner.addEventListener('click', () => {
            if (sidebarHintBanner) {
                sidebarHintBanner.style.display = 'none';
                chrome.storage.local.set({ 'sidebarHintDismissed': true });
            }
        });
    }
});
    
    // ==========================================
    // FUNCIONALIDAD DE CALIFICACIÓN Y SOPORTE
    // ==========================================
    
    const starsContainer = document.getElementById('starsContainer');
    const stars = document.querySelectorAll('.star-rating');
    const copySupportEmailBtn = document.getElementById('copySupportEmailBtn');
    
    // Email de soporte
    const SUPPORT_EMAIL = 'jonastantra@gmail.com';
    
    // Enlaces de calificación
    const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeDyQO5f50X9otPC77CkJkJwCOVbhdV8uHXbMn3NSdLSAl7dA/viewform';
    const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/voice-transcription-+-ai/pcklabcphhbkoghekdbpcplmjbdkfnbi?authuser=0&hl=es-419';
    
    // Estado de calificación seleccionada
    let selectedRating = 0;
    
    // Efecto hover en estrellas
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
        
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            selectStars(selectedRating);
            
            // Agregar animación
            star.classList.add('animate');
            setTimeout(() => {
                star.classList.remove('animate');
            }, 300);
            
            // Redirigir según la calificación
            if (selectedRating <= 3) {
                // 1-3 estrellas: formulario de feedback
                chrome.tabs.create({ url: FEEDBACK_FORM_URL });
            } else {
                // 4-5 estrellas: Chrome Web Store
                chrome.tabs.create({ url: CHROME_STORE_URL });
            }
        });
    });
    
    // Restaurar estrellas al salir del contenedor
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', () => {
            if (selectedRating > 0) {
                selectStars(selectedRating);
            } else {
                clearStars();
            }
        });
    }
    
    // Función para resaltar estrellas (hover)
    function highlightStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('hover');
            } else {
                star.classList.remove('hover');
            }
        });
    }
    
    // Función para seleccionar estrellas (click)
    function selectStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('selected');
                star.classList.remove('hover');
            } else {
                star.classList.remove('selected', 'hover');
            }
        });
    }
    
    // Función para limpiar estrellas
    function clearStars() {
        stars.forEach(star => {
            star.classList.remove('hover', 'selected');
        });
    }
    
    // Copiar email de soporte
    if (copySupportEmailBtn) {
        copySupportEmailBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(SUPPORT_EMAIL);
                alert(chrome.i18n.getMessage('emailCopied'));
            } catch (error) {
                console.error('Error al copiar email:', error);
                // Fallback: crear un elemento temporal
                const tempInput = document.createElement('input');
                tempInput.value = SUPPORT_EMAIL;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert(chrome.i18n.getMessage('emailCopied'));
            }
        });
    }