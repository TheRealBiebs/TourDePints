// ── stickers.js ───────────────────────────────────────────────────────────
// Loads sticker images from a Supabase Storage bucket and randomly scatters
// them across every .sticker-wall on the page. Re-randomises on every load.
//
// Also handles the "Add Your Sticker" upload modal on index.html.
//
// Dependencies (loaded before this script on every page):
//   • @supabase/supabase-js CDN  → global `supabase`
//   • js/config.js               → globals SUPABASE_URL, SUPABASE_ANON_KEY

const STICKER_BUCKET = 'stickers';
const STICKER_MAX_MB = 2;

// Build a Supabase client (cheap — just an object, not a new connection)
function getStickerDb() {
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ---------------------------------------------------------------------------
// Placement zones — stickers are assigned zones round-robin after shuffling,
// so distribution is always even while exact positions are fully random.
// ---------------------------------------------------------------------------
const ZONES = [
  // Left edge — upper half
  { side:'left',  sideMin:0,  sideMax:8,  topMin:5,  topMax:40, wMin:65, wMax:105 },
  // Left edge — lower half
  { side:'left',  sideMin:0,  sideMax:8,  topMin:45, topMax:85, wMin:65, wMax:105 },
  // Right edge — upper half
  { side:'right', sideMin:0,  sideMax:8,  topMin:5,  topMax:40, wMin:65, wMax:105 },
  // Right edge — lower half
  { side:'right', sideMin:0,  sideMax:8,  topMin:45, topMax:85, wMin:65, wMax:105 },
  // Left inset — mid-height (peeks further into the hero)
  { side:'left',  sideMin:6,  sideMax:16, topMin:20, topMax:72, wMin:85, wMax:120 },
  // Right inset — mid-height
  { side:'right', sideMin:6,  sideMax:16, topMin:20, topMax:72, wMin:85, wMax:120 },
  // Bottom strip — wide logos look great here
  { side:'left',  sideMin:15, sideMax:60, topMin:83, topMax:92, wMin:115, wMax:165 },
];

// Tighter zones for narrow screens — small stickers peek in from left/right edges only
const ZONES_MOBILE = [
  { side:'left',  sideMin:-5, sideMax:2, topMin:5,  topMax:40, wMin:52, wMax:68 },
  { side:'left',  sideMin:-5, sideMax:2, topMin:45, topMax:82, wMin:52, wMax:68 },
  { side:'right', sideMin:-5, sideMax:2, topMin:5,  topMax:40, wMin:52, wMax:68 },
  { side:'right', sideMin:-5, sideMax:2, topMin:45, topMax:82, wMin:52, wMax:68 },
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------
function placeStickersInWall(wall, urls, zones = ZONES) {
  // Remove any previously placed image stickers so re-calling is safe
  wall.querySelectorAll('img.sticker-img').forEach(el => el.remove());

  // Shuffle so zone assignment is different every load
  const shuffled = [...urls].sort(() => Math.random() - 0.5);

  shuffled.forEach((url, i) => {
    const zone   = zones[i % zones.length];
    const top    = rand(zone.topMin,  zone.topMax).toFixed(1);
    const offset = rand(zone.sideMin, zone.sideMax).toFixed(1);
    const width  = Math.round(rand(zone.wMin, zone.wMax));
    const rot    = ((Math.random() - 0.5) * 36).toFixed(1); // ±18°
    const z      = Math.ceil(Math.random() * 8);             // 1–8

    const img = document.createElement('img');
    img.className = 'sticker-img';
    img.src = url;
    // Derive a readable alt text from the filename portion of the URL
    img.alt = decodeURIComponent(url.split('/').pop())
                .replace(/^\d+_/, '')          // strip timestamp prefix
                .replace(/\.[^.]+$/, '')       // strip extension
                .replace(/[-_]/g, ' ');
    img.style.cssText =
      `top:${top}%;` +
      `${zone.side}:${offset}%;` +
      `transform:rotate(${rot}deg);` +
      `width:${width}px;` +
      `z-index:${z};`;

    wall.appendChild(img);
  });
}

async function loadStickerUrls() {
  const db = getStickerDb();
  const { data: files, error } = await db.storage
    .from(STICKER_BUCKET)
    .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

  if (error || !files) {
    console.warn('Could not list stickers bucket:', error?.message);
    return [];
  }

  return files
    .filter(f => f.name && /\.(png|jpg|jpeg|webp|gif)$/i.test(f.name))
    .map(f => db.storage.from(STICKER_BUCKET).getPublicUrl(f.name).data.publicUrl);
}

async function placeAllStickers() {
  const urls = await loadStickerUrls();
  if (!urls.length) return;
  const isMobile = window.innerWidth < 600;
  document.querySelectorAll('.sticker-wall').forEach(wall => {
    placeStickersInWall(wall, urls, isMobile ? ZONES_MOBILE : ZONES);
  });
}

// Expose globally so event.html can trigger after its dynamic render
window.placeAllStickers = placeAllStickers;

// ---------------------------------------------------------------------------
// Upload modal — only wires up if the modal markup exists on the page
// ---------------------------------------------------------------------------
async function uploadSticker(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (PNG, JPG, or WEBP).');
  }
  if (file.size > STICKER_MAX_MB * 1024 * 1024) {
    throw new Error(`File is too large — maximum size is ${STICKER_MAX_MB} MB.`);
  }

  const db  = getStickerDb();
  const ext  = file.name.split('.').pop().toLowerCase() || 'png';
  const base = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-]/g, '_')
    .slice(0, 40);
  const filename = `${Date.now()}_${base}.${ext}`;

  const { error } = await db.storage
    .from(STICKER_BUCKET)
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(error.message || 'Upload failed. Please try again.');

  // Notify admin (best-effort — don't block on failure)
  db.functions.invoke('notify-sticker-upload', { body: { filename } }).catch(() => {});

  return filename;
}

function initUploadModal() {
  const openBtn    = document.getElementById('open-sticker-upload');
  const modal      = document.getElementById('sticker-modal');
  const cancelBtn  = document.getElementById('upload-cancel');
  const dropZone   = document.getElementById('upload-drop-zone');
  const fileInput  = document.getElementById('sticker-file-input');
  const preview    = document.getElementById('upload-preview');
  const previewImg = document.getElementById('upload-preview-img');
  const clearBtn   = document.getElementById('upload-clear');
  const submitBtn  = document.getElementById('upload-submit');
  const status     = document.getElementById('upload-status');

  if (!openBtn || !modal) return; // not on this page

  let selectedFile = null;

  function openModal() {
    modal.removeAttribute('aria-hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    submitBtn.disabled = true;
    clearSelection();
    hideStatus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    selectedFile = null;
  }

  function clearSelection() {
    selectedFile = null;
    fileInput.value = '';
    preview.style.display = 'none';
    previewImg.src = '';
    dropZone.querySelector('.upload-drop-label').style.display = '';
    submitBtn.disabled = true;
    hideStatus();
  }

  function showPreview(file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      preview.style.display = 'flex';
      dropZone.querySelector('.upload-drop-label').style.display = 'none';
      submitBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  function showStatus(msg, type) { // type: 'success' | 'error'
    status.textContent = msg;
    status.className = `upload-status upload-status--${type}`;
    status.style.display = 'block';
  }

  function hideStatus() {
    status.style.display = 'none';
    status.textContent = '';
  }

  // Open / close
  openBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // File input (click to browse)
  dropZone.addEventListener('click', e => {
    if (e.target === clearBtn || e.target === submitBtn) return;
    if (!selectedFile) fileInput.click();
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) showPreview(fileInput.files[0]);
  });

  // Drag and drop
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) showPreview(file);
  });

  // Clear selection
  clearBtn.addEventListener('click', e => {
    e.stopPropagation();
    clearSelection();
  });

  // Submit upload
  submitBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sticking it up… 🍺';
    hideStatus();

    try {
      await uploadSticker(selectedFile);
      submitBtn.textContent = 'Stick It';
      clearSelection();
      // Show success with reload option
      status.innerHTML =
        '🍺 Your sticker is on the wall! ' +
        '<button class="upload-reload-btn" onclick="location.reload()">Reload to see it →</button>';
      status.className = 'upload-status upload-status--success';
      status.style.display = 'block';
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Stick It';
      showStatus('⚠️ ' + err.message, 'error');
    }
  });
}

// ---------------------------------------------------------------------------
// Auto-run
// ---------------------------------------------------------------------------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    placeAllStickers();
    initUploadModal();
  });
} else {
  placeAllStickers();
  initUploadModal();
}
