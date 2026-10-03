const STORAGE_KEY = 'effective-adventure-studio';

const initialFiles = [
  {
    id: 'readme',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: '# Effective Adventure\n\nA flexible workspace for editing code, assets, and app packages.\n\n- Add files\n- Edit code\n- Update logos\n- Export IPA / APK / EXE\n'
  },
  {
    id: 'src-main',
    name: 'src/main.js',
    type: 'file',
    language: 'javascript',
    content: 'const app = {\n  name: "effective-adventure",\n  status: "ready"\n};\n\nconsole.log(app);\n'
  },
  {
    id: 'assets-logo',
    name: 'assets/logo.txt',
    type: 'file',
    language: 'plaintext',
    content: 'EA\nEffective Adventure\n'
  }
];

const state = {
  files: loadState(),
  selectedFileId: null,
  logoConfig: {
    text: 'EA',
    color: '#7c3aed',
    accent: '#22c55e',
    size: 64
  }
};

const elements = {
  fileTree: document.getElementById('file-tree'),
  editor: document.getElementById('editor'),
  activeFileLabel: document.getElementById('active-file-label'),
  languageSelect: document.getElementById('language-select'),
  newFileBtn: document.getElementById('new-file-btn'),
  newFolderBtn: document.getElementById('new-folder-btn'),
  uploadBtn: document.getElementById('upload-btn'),
  fileInput: document.getElementById('file-input'),
  saveBtn: document.getElementById('save-btn'),
  deleteBtn: document.getElementById('delete-btn'),
  exportBtn: document.getElementById('export-btn'),
  logoText: document.getElementById('logo-text'),
  logoColor: document.getElementById('logo-color'),
  logoAccent: document.getElementById('logo-accent'),
  logoSize: document.getElementById('logo-size'),
  canvas: document.getElementById('logo-canvas'),
  tabs: Array.from(document.querySelectorAll('.tab')),
  tabPanels: Array.from(document.querySelectorAll('.tab-panel')),
  packageButtons: Array.from(document.querySelectorAll('.package-btn'))
};

function loadState() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) return structuredClone(initialFiles);

  try {
    const parsed = JSON.parse(existing);
    return Array.isArray(parsed) && parsed.length ? parsed : structuredClone(initialFiles);
  } catch {
    return structuredClone(initialFiles);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.files));
}

function selectFile(fileId) {
  const file = state.files.find(item => item.id === fileId);
  if (!file) return;

  state.selectedFileId = fileId;
  elements.activeFileLabel.textContent = file.name;
  elements.editor.value = file.content;
  elements.languageSelect.value = file.language || 'plaintext';

  document.querySelectorAll('.file-item').forEach(item => {
    item.classList.toggle('selected', item.dataset.id === fileId);
  });
}

function renderFileTree() {
  elements.fileTree.innerHTML = '';

  state.files.forEach(file => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'file-item';
    item.dataset.id = file.id;
    item.innerHTML = `<span class="file-name">${file.name}</span>`;
    item.addEventListener('click', () => selectFile(file.id));

    if (file.id === state.selectedFileId) {
      item.classList.add('selected');
    }

    elements.fileTree.appendChild(item);
  });
}

function ensureSelectedFile() {
  if (!state.selectedFileId && state.files.length) {
    state.selectedFileId = state.files[0].id;
  }

  if (state.selectedFileId) {
    selectFile(state.selectedFileId);
  }
}

function saveCurrentFile() {
  if (!state.selectedFileId) return;

  const file = state.files.find(item => item.id === state.selectedFileId);
  if (!file) return;

  file.content = elements.editor.value;
  file.language = elements.languageSelect.value;
  persistState();
  renderFileTree();
}

function addFile(name = `new-file-${Date.now()}.txt`) {
  const file = {
    id: `file-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name,
    type: 'file',
    language: 'plaintext',
    content: 'Write something here...'
  };

  state.files.push(file);
  state.selectedFileId = file.id;
  persistState();
  renderFileTree();
  selectFile(file.id);
}

function addFolder(name = `new-folder-${Date.now()}`) {
  const folder = {
    id: `folder-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name,
    type: 'folder',
    language: 'plaintext',
    content: ''
  };

  state.files.push(folder);
  persistState();
  renderFileTree();
}

function deleteSelectedFile() {
  if (!state.selectedFileId) return;

  state.files = state.files.filter(file => file.id !== state.selectedFileId);
  state.selectedFileId = state.files[0]?.id || null;
  persistState();
  renderFileTree();
  ensureSelectedFile();
}

function handleUpload(files) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const item = {
        id: `upload-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name: file.name,
        type: 'file',
        language: inferLanguage(file.name),
        content: String(reader.result || '')
      };

      state.files.push(item);
      state.selectedFileId = item.id;
      persistState();
      renderFileTree();
      selectFile(item.id);
    };
    reader.readAsText(file);
  });
}

function inferLanguage(fileName) {
  const ext = fileName.split('.').pop()?.toLowerCase();

  if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) return 'javascript';
  if (['html', 'htm'].includes(ext)) return 'html';
  if (['css'].includes(ext)) return 'css';
  if (['json'].includes(ext)) return 'json';
  if (['md'].includes(ext)) return 'markdown';
  return 'plaintext';
}

function applyLogoToCanvas() {
  const ctx = elements.canvas.getContext('2d');
  const w = elements.canvas.width;
  const h = elements.canvas.height;

  ctx.clearRect(0, 0, w, h);

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, state.logoConfig.color);
  gradient.addColorStop(1, state.logoConfig.accent);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  ctx.beginPath();
  ctx.arc(85, 90, 52, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = `700 ${state.logoConfig.size}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.logoConfig.text, 220, 92);

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(0, 140, w, 40);

  ctx.fillStyle = '#dbeafe';
  ctx.font = '600 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Effective Adventure', 22, 166);
}

function updateLogoFromInputs() {
  state.logoConfig.text = elements.logoText.value || 'EA';
  state.logoConfig.color = elements.logoColor.value;
  state.logoConfig.accent = elements.logoAccent.value;
  state.logoConfig.size = Number(elements.logoSize.value) || 64;
  applyLogoToCanvas();
}

function exportPackage(ext) {
  const activeFile = state.files.find(item => item.id === state.selectedFileId);
  const content = activeFile?.content || 'Effective Adventure package';

  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `effective-adventure.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function setupTabs() {
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      elements.tabs.forEach(btn => btn.classList.toggle('active', btn === tab));
      elements.tabPanels.forEach(panel => {
        panel.classList.toggle('visible', panel.id === target);
      });
    });
  });
}

function setupEvents() {
  elements.editor.addEventListener('input', () => saveCurrentFile());
  elements.languageSelect.addEventListener('change', () => saveCurrentFile());

  elements.newFileBtn.addEventListener('click', () => addFile());
  elements.newFolderBtn.addEventListener('click', () => addFolder());
  elements.saveBtn.addEventListener('click', saveCurrentFile);
  elements.deleteBtn.addEventListener('click', deleteSelectedFile);
  elements.exportBtn.addEventListener('click', () => exportPackage('zip'));
  elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());

  elements.fileInput.addEventListener('change', (event) => {
    handleUpload(event.target.files);
    event.target.value = '';
  });

  elements.logoText.addEventListener('input', updateLogoFromInputs);
  elements.logoColor.addEventListener('input', updateLogoFromInputs);
  elements.logoAccent.addEventListener('input', updateLogoFromInputs);
  elements.logoSize.addEventListener('input', updateLogoFromInputs);

  elements.packageButtons.forEach(button => {
    button.addEventListener('click', () => exportPackage(button.dataset.ext));
  });
}

function init() {
  state.selectedFileId = state.files[0]?.id || null;
  renderFileTree();
  ensureSelectedFile();
  setupTabs();
  setupEvents();
  applyLogoToCanvas();
}

init();
