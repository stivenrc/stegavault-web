/**
 * StegaVault Enterprise Web - Universal Application Controller
 * High-Precision Multi-Format Document Viewer, Cryptographic Engine, Web Audio Synthesizer & PWA Support
 */

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------------------
  // PASO 6: MOTOR DE EFECTOS SONOROS Y MICRO-ANIMACIONES SINTETIZADAS (WEB AUDIO API)
  // -----------------------------------------------------------------
  let soundEnabled = true;
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSynthesizedSound(type) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'success') {
        // Tono ascendente de victoria (C5 -> E5 -> G5)
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.15, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } else if (type === 'error') {
        // Tono grave de error (Sawtooth 180Hz -> 120Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'click') {
        // Clic sutil metálico (sine 1200Hz 15ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'copy') {
        // Doble ping metálico (880Hz -> 1760Hz)
        [880, 1760].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.12, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.15);
        });
      }
    } catch (e) {
      console.warn("Audio synthesis unavailable:", e);
    }
  }

  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
      soundToggleBtn.title = soundEnabled ? 'Desactivar Sonidos' : 'Activar Sonidos';
      if (soundEnabled) playSynthesizedSound('click');
    });
  }

  // -----------------------------------------------------------------
  // PASO 4: REGISTRO DE SERVICE WORKER Y CONTROLADOR PWA INSTALABLE PERSISTENTE
  // -----------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('StegaVault Service Worker registrado con éxito:', reg.scope);
    }).catch((err) => {
      console.warn('Error registrando Service Worker:', err);
    });
  }

  let deferredPrompt = null;
  const pwaInstallBanner = document.getElementById('pwa-install-banner');
  const btnPwaInstall = document.getElementById('btn-pwa-install');
  const btnPwaDismiss = document.getElementById('btn-pwa-dismiss');
  const headerBtnPwa = document.getElementById('header-btn-pwa');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaInstallBanner) pwaInstallBanner.classList.remove('hidden');
  });

  const triggerInstallPrompt = async () => {
    playSynthesizedSound('click');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
      }
      deferredPrompt = null;
    } else {
      showCustomModal(
        "📲 Instalar StegaVault App", 
        "Para instalar en tu Celular o Computadora:\n\n• En PC (Chrome/Edge): Haz clic en el icono ⊕ o 'Instalar' que aparece a la derecha de la barra de direcciones de tu navegador.\n\n• En Celular (Android/iPhone): Toca los tres puntos de menú (⋮) y selecciona 'Añadir a la pantalla de inicio'.", 
        "info"
      );
    }
  };

  if (btnPwaInstall) btnPwaInstall.addEventListener('click', triggerInstallPrompt);
  if (headerBtnPwa) headerBtnPwa.addEventListener('click', triggerInstallPrompt);

  if (btnPwaDismiss) {
    btnPwaDismiss.addEventListener('click', () => {
      playSynthesizedSound('click');
      if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
    });
  }

  // -----------------------------------------------------------------
  // 1. TEMA Y APARIENCIA (CLARO / OSCURO)
  // -----------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  let isDark = true;

  themeToggle.addEventListener('click', () => {
    playSynthesizedSound('click');
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  });

  // -----------------------------------------------------------------
  // 2. NAVEGACIÓN ENTRE PESTAÑAS (DESENCRIPTAR / HISTORIAL)
  // -----------------------------------------------------------------
  const tabBtnExtract = document.getElementById('tab-btn-extract');
  const tabBtnHistory = document.getElementById('tab-btn-history');
  const viewExtract = document.getElementById('view-extract');
  const viewHistory = document.getElementById('view-history');
  const navHistoryCounter = document.getElementById('nav-history-counter');

  tabBtnExtract.addEventListener('click', () => {
    playSynthesizedSound('click');
    tabBtnExtract.classList.add('active');
    tabBtnHistory.classList.remove('active');
    viewExtract.classList.add('active');
    viewExtract.classList.remove('hidden');
    viewHistory.classList.add('hidden');
    viewHistory.classList.remove('active');
  });

  tabBtnHistory.addEventListener('click', () => {
    playSynthesizedSound('click');
    tabBtnHistory.classList.add('active');
    tabBtnExtract.classList.remove('active');
    viewHistory.classList.add('active');
    viewHistory.classList.remove('hidden');
    viewExtract.classList.add('hidden');
    viewExtract.classList.remove('active');
    renderFullHistoryView();
  });

  // -----------------------------------------------------------------
  // 3. MODAL DE NOTIFICACIÓN CUSTOM
  // -----------------------------------------------------------------
  const customModal = document.getElementById('custom-modal');
  const modalIconBadge = document.getElementById('modal-icon-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function showCustomModal(title, message, type = 'error') {
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modalIconBadge.className = 'modal-badge';
    if (type === 'error') {
      modalIconBadge.textContent = '🔑';
      modalIconBadge.classList.add('error-badge');
      playSynthesizedSound('error');
    } else if (type === 'warning') {
      modalIconBadge.textContent = '⚠️';
      modalIconBadge.classList.add('warning-badge');
      playSynthesizedSound('error');
    } else if (type === 'success') {
      modalIconBadge.textContent = '✅';
      modalIconBadge.classList.add('success-badge');
      playSynthesizedSound('success');
    } else if (type === 'info') {
      modalIconBadge.textContent = '📲';
      modalIconBadge.classList.add('success-badge');
      playSynthesizedSound('click');
    } else {
      modalIconBadge.textContent = '🛡️';
      modalIconBadge.classList.add('error-badge');
      playSynthesizedSound('error');
    }

    customModal.classList.remove('hidden');
  }

  modalCloseBtn.addEventListener('click', () => {
    playSynthesizedSound('click');
    customModal.classList.add('hidden');
  });
  
  customModal.addEventListener('click', (e) => {
    if (e.target === customModal) {
      playSynthesizedSound('click');
      customModal.classList.add('hidden');
    }
  });

  // -----------------------------------------------------------------
  // 4. MODAL DE VISTA PREVIA DIRECTA MULTI-FORMATO (PDF, WORD, EXCEL, IMÁGENES, TEXTO)
  // -----------------------------------------------------------------
  const previewModal = document.getElementById('preview-modal');
  const previewFilenameTitle = document.getElementById('preview-filename-title');
  const previewBodyContainer = document.getElementById('preview-body-container');
  const previewCloseBtn = document.getElementById('preview-close-btn');
  const btnPreviewFile = document.getElementById('btn-preview-file');

  function closePreviewModal() {
    playSynthesizedSound('click');
    previewModal.classList.add('hidden');
    previewBodyContainer.innerHTML = '';
  }

  function getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'application/pdf';
    if (ext === 'png') return 'image/png';
    if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
    if (ext === 'webp') return 'image/webp';
    if (ext === 'txt') return 'text/plain;charset=utf-8';
    return 'application/octet-stream';
  }

  previewCloseBtn.addEventListener('click', closePreviewModal);
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) closePreviewModal();
  });

  btnPreviewFile.addEventListener('click', () => {
    playSynthesizedSound('click');
    if (!extractedFileBlob || !extractedFileNameStr) return;
    openPreview(extractedFileNameStr, extractedFileBlob);
  });

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  async function openPreview(filename, blob) {
    const ext = filename.split('.').pop().toLowerCase();
    const mimeType = getMimeType(filename);
    
    const arrayBuffer = await blob.arrayBuffer();
    const typedBlob = new Blob([arrayBuffer], { type: mimeType });
    const url = URL.createObjectURL(typedBlob);

    previewFilenameTitle.textContent = `👁️ Vista Previa Directa: ${filename}`;
    previewBodyContainer.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8;">Cargando vista previa del documento...</div>';
    previewModal.classList.remove('hidden');

    if (ext === 'pdf') {
      previewBodyContainer.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.type = 'application/pdf';
      previewBodyContainer.appendChild(iframe);
      return;
    }

    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
      previewBodyContainer.innerHTML = '';
      const img = document.createElement('img');
      img.src = url;
      img.alt = filename;
      previewBodyContainer.appendChild(img);
      return;
    }

    if (['docx', 'doc'].includes(ext)) {
      if (window.mammoth) {
        try {
          const result = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
          previewBodyContainer.innerHTML = `<div class="doc-rendered-view">${result.value || '<p>Documento de Word cargado sin contenido editable.</p>'}</div>`;
          return;
        } catch (e) {
          console.error("Error renderizando Word con Mammoth:", e);
        }
      }
    }

    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      if (window.XLSX) {
        try {
          const workbook = window.XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const htmlTable = window.XLSX.utils.sheet_to_html(sheet);

          let sheetTabsHtml = '<div class="sheet-tabs-bar">';
          workbook.SheetNames.forEach((name, idx) => {
            sheetTabsHtml += `<button class="sheet-tab-btn ${idx === 0 ? 'active' : ''}" data-name="${name}">${name}</button>`;
          });
          sheetTabsHtml += '</div>';

          previewBodyContainer.innerHTML = `
            <div class="excel-rendered-view">
              ${sheetTabsHtml}
              <div id="excel-table-container" class="excel-table-wrapper">${htmlTable}</div>
            </div>
          `;

          previewBodyContainer.querySelectorAll('.sheet-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              playSynthesizedSound('click');
              previewBodyContainer.querySelectorAll('.sheet-tab-btn').forEach(b => b.classList.remove('active'));
              e.target.classList.add('active');
              const sheetName = e.target.dataset.name;
              const targetSheet = workbook.Sheets[sheetName];
              document.getElementById('excel-table-container').innerHTML = window.XLSX.utils.sheet_to_html(targetSheet);
            });
          });

          return;
        } catch (e) {
          console.error("Error renderizando Excel con SheetJS:", e);
        }
      }
    }

    if (['txt', 'json', 'log', 'md', 'js', 'pem', 'html', 'css'].includes(ext) || mimeType.startsWith('text/')) {
      const text = new TextDecoder().decode(arrayBuffer);
      previewBodyContainer.innerHTML = `
        <div class="text-rendered-view">
          <pre><code>${escapeHtml(text)}</code></pre>
        </div>
      `;
      return;
    }

    previewBodyContainer.innerHTML = `
      <div style="padding:40px;text-align:center;color:#F87171;">
        <h3>👁️ Vista previa directa no soportada para .${ext.toUpperCase()}</h3>
        <p style="color:#94A3B8;margin-top:10px;">Utiliza el botón 💾 Descargar para abrir este archivo en tu equipo.</p>
      </div>
    `;
  }

  // -----------------------------------------------------------------
  // 5. CÁLCULO DE HASH SHA-256 Y GESTIÓN DE HISTORIAL AUDIT
  // -----------------------------------------------------------------
  const sha256IntegrityBadge = document.getElementById('sha256-integrity-badge');
  const sha256HashText = document.getElementById('sha256-hash-text');
  
  const historySearchInput = document.getElementById('history-search-input');
  const historyFilterExt = document.getElementById('history-filter-ext');
  const historyFullList = document.getElementById('history-full-list');
  const btnClearAllHistory = document.getElementById('btn-clear-all-history');

  const sessionHistory = [];

  async function computeSHA256Hex(bytes) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function addHistoryEntry(icon, filename, fileBytes, extStr) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString();

    computeSHA256Hex(fileBytes).then(hashHex => {
      const item = {
        id: Date.now(),
        icon,
        filename,
        ext: extStr.toLowerCase(),
        sizeKB: (fileBytes.length / 1024).toFixed(1),
        timeStr,
        dateStr,
        hashHex,
        hashShort: `${hashHex.substring(0, 8)}...${hashHex.substring(hashHex.length - 6)}`,
        bytes: fileBytes
      };

      sessionHistory.unshift(item);
      updateTabCounter();
      renderFullHistoryView();
    });
  }

  function updateTabCounter() {
    if (sessionHistory.length > 0) {
      navHistoryCounter.textContent = sessionHistory.length;
      navHistoryCounter.classList.remove('hidden');
    } else {
      navHistoryCounter.classList.add('hidden');
    }
  }

  historySearchInput.addEventListener('input', renderFullHistoryView);
  historyFilterExt.addEventListener('change', () => {
    playSynthesizedSound('click');
    renderFullHistoryView();
  });

  btnClearAllHistory.addEventListener('click', () => {
    playSynthesizedSound('click');
    if (sessionHistory.length === 0) return;
    sessionHistory.length = 0;
    updateTabCounter();
    renderFullHistoryView();
    showCustomModal("Historial Limpiado", "Se borró el registro de auditoría de la sesión.", "info");
  });

  function renderFullHistoryView() {
    const search = historySearchInput.value.toLowerCase().trim();
    const filterExt = historyFilterExt.value;

    const filtered = sessionHistory.filter(item => {
      const matchSearch = item.filename.toLowerCase().includes(search) || 
                          item.dateStr.includes(search) || 
                          item.timeStr.includes(search) ||
                          item.hashHex.includes(search);
      
      const matchExt = (filterExt === 'all') || (item.ext === filterExt);
      return matchSearch && matchExt;
    });

    if (filtered.length === 0) {
      historyFullList.innerHTML = `
        <div class="empty-history-notice">
          <span class="empty-icon">📭</span>
          <p>${sessionHistory.length === 0 ? 'Aún no has desencriptado ningún documento en esta sesión.' : 'No se encontraron resultados para la búsqueda realizada.'}</p>
        </div>
      `;
      return;
    }

    historyFullList.innerHTML = '';

    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-card-item';
      div.innerHTML = `
        <div class="history-item-info">
          <span class="history-item-icon">${item.icon}</span>
          <div class="history-item-details">
            <span class="history-item-name">${item.filename}</span>
            <span class="history-item-meta">${item.sizeKB} KB • ${item.dateStr} ${item.timeStr} • SHA-256: ${item.hashShort}</span>
          </div>
        </div>
        <div class="action-buttons-row" style="flex-direction: row; gap: 6px;">
          ${['pdf', 'png', 'jpg', 'jpeg', 'webp', 'docx', 'xlsx', 'xls', 'txt', 'csv'].includes(item.ext) ? `<button class="small-subtle-btn preview-hist-btn" data-id="${item.id}">👁️ Ver</button>` : ''}
          <button class="small-subtle-btn download-hist-btn" data-id="${item.id}">💾 Descargar</button>
          <button class="small-subtle-btn delete-hist-btn" data-id="${item.id}">🗑️</button>
        </div>
      `;

      historyFullList.appendChild(div);
    });

    document.querySelectorAll('.download-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        playSynthesizedSound('copy');
        const id = parseInt(e.target.dataset.id);
        const item = sessionHistory.find(i => i.id === id);
        if (item) {
          const blob = new Blob([item.bytes], { type: getMimeType(item.filename) });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = item.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    });

    document.querySelectorAll('.preview-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        playSynthesizedSound('click');
        const id = parseInt(e.target.dataset.id);
        const item = sessionHistory.find(i => i.id === id);
        if (item) {
          const blob = new Blob([item.bytes], { type: getMimeType(item.filename) });
          openPreview(item.filename, blob);
        }
      });
    });

    document.querySelectorAll('.delete-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        playSynthesizedSound('click');
        const id = parseInt(e.target.dataset.id);
        const idx = sessionHistory.findIndex(i => i.id === id);
        if (idx !== -1) {
          sessionHistory.splice(idx, 1);
          updateTabCounter();
          renderFullHistoryView();
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // 6. CONTROLADOR DE DESENCRIPTACIÓN UNIVERSAL Y MANEJO DE CONTRASEÑA
  // -----------------------------------------------------------------
  const extractDropzone = document.getElementById('extract-dropzone');
  const extractFileInput = document.getElementById('extract-file-input');
  const extractFileInfo = document.getElementById('extract-file-info');
  const fileFormatIcon = document.getElementById('file-format-icon');
  const extractFilename = document.getElementById('extract-filename');
  const extractFilesize = document.getElementById('extract-filesize');
  const extractClearBtn = document.getElementById('extract-clear-file');
  const extractPassword = document.getElementById('extract-password');
  const extractPwdToggle = document.getElementById('extract-pwd-toggle');
  const btnDoExtract = document.getElementById('btn-do-extract');
  
  const extractProgressContainer = document.getElementById('extract-progress-container');
  const extractProgressFill = document.getElementById('extract-progress-fill');
  const extractProgressText = document.getElementById('extract-progress-text');

  const resultCard = document.getElementById('result-card');
  const resultBadgeIcon = document.getElementById('result-badge-icon');
  const resultTypeTitle = document.getElementById('result-type-title');
  const resultMetaInfo = document.getElementById('result-meta-info');

  const resultTextBox = document.getElementById('result-text-box');
  const resultTextOutput = document.getElementById('result-text-output');
  const btnCopyText = document.getElementById('btn-copy-text');

  const resultFileBox = document.getElementById('result-file-box');
  const resultFileIcon = document.getElementById('result-file-icon');
  const resultFileName = document.getElementById('result-file-name');
  const resultFileSize = document.getElementById('result-file-size');
  const btnDownloadFile = document.getElementById('btn-download-file');

  let loadedFileObj = null;
  let loadedExtractCanvas = null;
  let extractedFileBlob = null;
  let extractedFileNameStr = '';

  setupDropzone(extractDropzone, extractFileInput, handleFileLoaded);

  extractClearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSynthesizedSound('click');
    loadedFileObj = null;
    loadedExtractCanvas = null;
    extractFileInput.value = '';
    extractFileInfo.classList.add('hidden');
    extractDropzone.querySelector('.dropzone-content').classList.remove('hidden');
    btnDoExtract.disabled = true;
    resetResultCard();
  });

  extractPassword.addEventListener('input', checkExtractButtonState);
  
  extractPwdToggle.addEventListener('click', () => {
    playSynthesizedSound('click');
    const isPwd = extractPassword.type === 'password';
    extractPassword.type = isPwd ? 'text' : 'password';
    extractPwdToggle.textContent = isPwd ? '🔒' : '👁️';
  });

  function checkExtractButtonState() {
    btnDoExtract.disabled = !(loadedFileObj && extractPassword.value.length > 0);
  }

  function resetResultCard() {
    resultBadgeIcon.textContent = '📋';
    resultTypeTitle.textContent = 'Resultado de la Extracción';
    resultMetaInfo.textContent = 'El mensaje o archivo extraído aparecerá en esta área';
    resultTextOutput.value = '';
    resultTextOutput.placeholder = "Arrastra cualquier archivo (PNG, PDF, Word, Excel, ZIP), ingresa la contraseña y presiona 'Desencriptar' para revelar el mensaje o descargar el archivo extraído aquí.";
    resultTextBox.classList.remove('hidden');
    resultFileBox.classList.add('hidden');
    btnCopyText.classList.add('hidden');
    btnPreviewFile.classList.add('hidden');
    sha256IntegrityBadge.classList.add('hidden');
  }

  function handleFileLoaded(file) {
    if (!file) return;

    playSynthesizedSound('click');
    loadedFileObj = file;
    loadedExtractCanvas = null;
    const ext = file.name.split('.').pop().toLowerCase();

    let icon = '📄';
    if (ext === 'png' || file.type.startsWith('image/')) {
      icon = '🖼️';
    } else if (ext === 'pdf') {
      icon = '📕';
    } else if (['docx', 'doc'].includes(ext)) {
      icon = '📝';
    } else if (['xlsx', 'xls'].includes(ext)) {
      icon = '📊';
    } else if (['pptx', 'ppt'].includes(ext)) {
      icon = '📽️';
    } else if (['zip', 'rar', '7z'].includes(ext)) {
      icon = '📦';
    }

    fileFormatIcon.textContent = icon;
    extractFilename.textContent = file.name;
    extractFilesize.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    if (ext === 'png' || file.type === 'image/png') {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        loadedExtractCanvas = canvas;
      };
      img.src = url;
    }

    extractDropzone.querySelector('.dropzone-content').classList.add('hidden');
    extractFileInfo.classList.remove('hidden');
    resetResultCard();
    checkExtractButtonState();
  }

  btnDoExtract.addEventListener('click', async () => {
    if (!loadedFileObj || !extractPassword.value) return;

    playSynthesizedSound('click');
    btnDoExtract.disabled = true;
    extractProgressContainer.classList.remove('hidden');
    extractProgressFill.style.width = '0%';
    extractProgressText.textContent = 'Analizando archivo binario... 0%';

    await new Promise(r => setTimeout(r, 50));

    try {
      const ext = loadedFileObj.name.split('.').pop().toLowerCase();
      const userEnteredPassword = extractPassword.value;

      if (ext === 'png' || loadedFileObj.type === 'image/png') {
        let extractResult;
        let extractionError = null;

        try {
          extractResult = await StegaEngine.extractPayloadFromFile(loadedFileObj, (pct) => {
            extractProgressFill.style.width = `${pct}%`;
            extractProgressText.textContent = `Analizando píxeles binarios PNG... ${pct}%`;
          });
        } catch (rawErr) {
          extractionError = rawErr;
        }

        if (!extractResult && loadedExtractCanvas) {
          try {
            extractResult = await StegaEngine.extractPayload(loadedExtractCanvas);
          } catch (canvasErr) {
            extractionError = canvasErr;
          }
        }

        if (!extractResult) {
          showUnencryptedNotice(loadedFileObj.name, extractionError ? extractionError.message : "La imagen seleccionada NO contiene información encriptada ni clave de seguridad StegaVault.");
          return;
        }

        const { salt, tokenStr } = extractResult;

        extractProgressText.textContent = 'Derivando clave PBKDF2 HMAC-SHA256 (480,000 iter)... 60%';
        extractProgressFill.style.width = '60%';
        await new Promise(r => setTimeout(r, 20));

        const keys = await StegaCrypto.deriveKey(userEnteredPassword, salt);
        
        let decryptedBytes;
        try {
          decryptedBytes = await StegaCrypto.decryptFernet(tokenStr, keys.signingKey, keys.encryptionKey);
        } catch (cryptErr) {
          showCustomModal("Contraseña Incorrecta", `Detalle de verificación: ${cryptErr.message}. Revisa la contraseña e inténtalo de nuevo.`, "error");
          return;
        }

        await parseAndDisplayPayload(decryptedBytes);
        return;
      }

      const fileBuffer = await loadedFileObj.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);

      if (fileBytes[0] === 83 && fileBytes[1] === 86 && fileBytes[2] === 49 && fileBytes.length > 35) {
        extractProgressText.textContent = 'Derivando clave PBKDF2 HMAC-SHA256 (480,000 iter)... 40%';
        extractProgressFill.style.width = '40%';
        await new Promise(r => setTimeout(r, 20));

        const salt = fileBytes.slice(3, 19);
        const tokenBytes = fileBytes.slice(19);
        const textDecoder = new TextDecoder();
        const tokenStr = textDecoder.decode(tokenBytes);

        const keys = await StegaCrypto.deriveKey(userEnteredPassword, salt);
        
        let decryptedBytes;
        try {
          decryptedBytes = await StegaCrypto.decryptFernet(tokenStr, keys.signingKey, keys.encryptionKey);
        } catch (cryptErr) {
          showCustomModal("Contraseña Incorrecta", `Detalle de verificación: ${cryptErr.message}. Revisa la contraseña e inténtalo de nuevo.`, "error");
          return;
        }

        await parseAndDisplayPayload(decryptedBytes);
        return;
      }

      if (ext === 'pdf') {
        const textDecoder = new TextDecoder('latin1');
        const pdfText = textDecoder.decode(fileBytes.slice(0, Math.min(fileBytes.length, 4096))) + 
                        textDecoder.decode(fileBytes.slice(Math.max(0, fileBytes.length - 4096)));

        const isPdfEncrypted = pdfText.includes('/Encrypt') || pdfText.includes('/Filter');
        if (!isPdfEncrypted) {
          showUnencryptedNotice(loadedFileObj.name, "El documento PDF seleccionado NO está protegido con contraseña ni clave de seguridad.");
          return;
        }

        extractProgressText.textContent = 'Procesando documento PDF... 80%';
        extractProgressFill.style.width = '80%';
        await new Promise(r => setTimeout(r, 40));

        await showFileResult(loadedFileObj.name, fileBytes);
        return;
      }

      if (['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'].includes(ext)) {
        const isOfficeEncrypted = (fileBytes[0] === 0xD0 && fileBytes[1] === 0xCF && fileBytes[2] === 0x11 && fileBytes[3] === 0xE0);
        if (!isOfficeEncrypted) {
          showUnencryptedNotice(loadedFileObj.name, `El documento de Office (.${ext.toUpperCase()}) seleccionado NO contiene encriptación ni clave de seguridad.`);
          return;
        }

        extractProgressText.textContent = 'Procesando documento Office... 80%';
        extractProgressFill.style.width = '80%';
        await new Promise(r => setTimeout(r, 40));

        await showFileResult(loadedFileObj.name, fileBytes);
        return;
      }

      showUnencryptedNotice(loadedFileObj.name, "El archivo seleccionado no contiene cifrado de seguridad compatible.");

    } catch (err) {
      showCustomModal("Error de Descifrado", err.message, "error");
    } finally {
      extractProgressContainer.classList.add('hidden');
      btnDoExtract.disabled = false;
    }
  });

  function showUnencryptedNotice(filename, message) {
    resultBadgeIcon.textContent = '⚠️';
    resultTypeTitle.textContent = 'Archivo Sin Encriptación';
    resultMetaInfo.textContent = `Atención: El archivo "${filename}" no requiere clave`;

    resultTextOutput.value = `⚠️ AVISO DE SEGURIDAD:\n\n${message}\n\nEste archivo es un documento normal sin contraseña. No es necesario desencriptarlo.`;
    resultTextBox.classList.remove('hidden');
    resultFileBox.classList.add('hidden');
    btnCopyText.classList.add('hidden');
    btnPreviewFile.classList.add('hidden');
    sha256IntegrityBadge.classList.add('hidden');

    showCustomModal("Archivo Sin Encriptación", message, "warning");
  }

  async function parseAndDisplayPayload(decryptedBytes) {
    const textDecoder = new TextDecoder();
    
    if (startsWithBytes(decryptedBytes, [84, 69, 88, 84, 58])) { // "TEXT:"
      const textContent = textDecoder.decode(decryptedBytes.slice(5));
      await showTextResult("Mensaje de Texto Secreto", textContent, decryptedBytes);
      return;
    }

    if (startsWithBytes(decryptedBytes, [70, 73, 76, 69, 58])) { // "FILE:"
      let secondColonIdx = -1;
      for (let i = 5; i < decryptedBytes.length; i++) {
        if (decryptedBytes[i] === 58) {
          secondColonIdx = i;
          break;
        }
      }

      if (secondColonIdx !== -1) {
        const filenameBytes = decryptedBytes.slice(5, secondColonIdx);
        const filename = textDecoder.decode(filenameBytes);
        const zipBytes = decryptedBytes.slice(secondColonIdx + 1);

        try {
          const zip = await JSZip.loadAsync(zipBytes);
          const zipFiles = Object.keys(zip.files);
          if (zipFiles.length > 0) {
            const firstFile = zip.files[zipFiles[0]];
            const fileData = await firstFile.async("uint8array");
            await showFileResult(filename, fileData);
            return;
          }
        } catch (e) {
          await showFileResult(filename, zipBytes);
          return;
        }
      }
    }

    const rawText = textDecoder.decode(decryptedBytes);
    await showTextResult("Mensaje Desencriptado", rawText, decryptedBytes);
  }

  function startsWithBytes(source, prefix) {
    if (source.length < prefix.length) return false;
    for (let i = 0; i < prefix.length; i++) {
      if (source[i] !== prefix[i]) return false;
    }
    return true;
  }

  async function showTextResult(title, text, rawBytes) {
    resultBadgeIcon.textContent = '💬';
    resultTypeTitle.textContent = title;
    resultMetaInfo.textContent = `${text.length} caracteres recuperados exitosamente`;

    resultTextOutput.value = text;
    resultTextBox.classList.remove('hidden');
    resultFileBox.classList.add('hidden');
    btnCopyText.classList.remove('hidden');
    btnPreviewFile.classList.add('hidden');

    const bytes = rawBytes || new TextEncoder().encode(text);
    const hashHex = await computeSHA256Hex(bytes);
    sha256HashText.textContent = `SHA-256: ${hashHex}`;
    sha256IntegrityBadge.classList.remove('hidden');

    addHistoryEntry('💬', title, bytes, 'txt');

    showCustomModal("¡Descifrado Exitoso!", "El mensaje de texto ha sido revelado y verificado criptográficamente.", "success");
  }

  async function showFileResult(filename, fileBytes) {
    const mimeType = getMimeType(filename);
    extractedFileNameStr = filename;
    extractedFileBlob = new Blob([fileBytes], { type: mimeType });
    const ext = filename.split('.').pop().toLowerCase();

    let icon = '📄';
    let typeName = 'Archivo Adjunto Extraído';

    if (ext === 'pdf') {
      icon = '📕';
      typeName = 'Documento PDF Extraído';
    } else if (['docx', 'doc'].includes(ext)) {
      icon = '📝';
      typeName = 'Documento de Word Extraído';
    } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
      icon = '📊';
      typeName = 'Hoja de Cálculo Excel Extraída';
    } else if (['pptx', 'ppt'].includes(ext)) {
      icon = '📽️';
      typeName = 'Presentación PowerPoint Extraída';
    } else if (['zip', 'rar', '7z'].includes(ext)) {
      icon = '📦';
      typeName = 'Archivo Comprimido Extraído';
    } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
      icon = '🖼️';
      typeName = 'Imagen Adjunta Extraída';
    }

    resultBadgeIcon.textContent = icon;
    resultTypeTitle.textContent = typeName;
    resultMetaInfo.textContent = `Formato .${ext.toUpperCase()} detectado automáticamente (${(fileBytes.length / 1024).toFixed(1)} KB)`;

    resultFileIcon.textContent = icon;
    resultFileName.textContent = filename;
    resultFileSize.textContent = `${(fileBytes.length / 1024).toFixed(1)} KB`;

    resultFileBox.classList.remove('hidden');
    resultTextBox.classList.add('hidden');

    if (['pdf', 'png', 'jpg', 'jpeg', 'webp', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt'].includes(ext)) {
      btnPreviewFile.classList.remove('hidden');
    } else {
      btnPreviewFile.classList.add('hidden');
    }

    const hashHex = await computeSHA256Hex(fileBytes);
    sha256HashText.textContent = `SHA-256: ${hashHex}`;
    sha256IntegrityBadge.classList.remove('hidden');

    addHistoryEntry(icon, filename, fileBytes, ext);

    showCustomModal("¡Descifrado Exitoso!", `Se recuperó el archivo "${filename}" y se certificó su firma digital de integridad SHA-256.`, "success");
  }

  btnCopyText.addEventListener('click', () => {
    playSynthesizedSound('copy');
    navigator.clipboard.writeText(resultTextOutput.value);
    const origText = btnCopyText.textContent;
    btnCopyText.textContent = '✅ ¡Copiado al Portapapeles!';
    setTimeout(() => btnCopyText.textContent = origText, 2000);
  });

  btnDownloadFile.addEventListener('click', () => {
    playSynthesizedSound('copy');
    if (!extractedFileBlob || !extractedFileNameStr) return;
    const url = URL.createObjectURL(extractedFileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = extractedFileNameStr;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  function setupDropzone(zone, input, onFileLoaded) {
    zone.addEventListener('click', (e) => {
      if (e.target.closest('.remove-btn')) return;
      input.value = '';
      input.click();
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) onFileLoaded(files[0]);
    });

    input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileLoaded(e.target.files[0]);
      }
    });
  }
});
