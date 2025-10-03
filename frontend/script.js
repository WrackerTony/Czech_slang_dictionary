// Application state
const state = {
  words: [],
  filteredWords: [],
  currentTheme: localStorage.getItem('theme') || 'light',
  searchQuery: '',
  currentFilter: 'all' // 'all', 'slovo', 'zkratka'
};

// DOM elements
const elements = {
  themeToggle: document.getElementById('themeToggle'),
  helpBtn: document.getElementById('helpBtn'),
  searchInput: document.getElementById('searchInput'),
  clearBtn: document.getElementById('clearBtn'),
  searchSuggestions: document.getElementById('searchSuggestions'),
  wordGrid: document.getElementById('wordGrid'),
  wordCount: document.getElementById('wordCount'),
  loading: document.getElementById('loading'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  modalClose: document.getElementById('modalClose'),
  helpModal: document.getElementById('helpModal'),
  helpModalClose: document.getElementById('helpModalClose')
};

// API base URL
const API_BASE = 'http://localhost:3000/api';

// Mobile optimizations
function initializeMobileOptimizations() {
  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Better touch feedback
  document.addEventListener('touchstart', function(e) {
    const target = e.target.closest('.word-card, .theme-toggle, .help-btn, .modal-close, .clear-btn, .suggestion-item');
    if (target) {
      target.style.transform = 'scale(0.95)';
      target.style.transition = 'transform 0.1s ease';
    }
  });

  document.addEventListener('touchend', function(e) {
    const target = e.target.closest('.word-card, .theme-toggle, .help-btn, .modal-close, .clear-btn, .suggestion-item');
    if (target) {
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    }
  });

  // Swipe to close modal on mobile
  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  elements.modalOverlay.addEventListener('touchstart', function(e) {
    if (e.target === elements.modalOverlay || e.target.classList.contains('modal-backdrop')) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }
  });

  elements.modalOverlay.addEventListener('touchmove', function(e) {
    if (!isDragging) return;

    currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 50) { // Swipe down
      const modalContainer = elements.modalOverlay.querySelector('.modal-container');
      if (modalContainer) {
        modalContainer.style.transform = `scale(1) translateY(${Math.max(0, diff - 50)}px)`;
        modalContainer.style.opacity = Math.max(0.5, 1 - (diff - 50) / 200);
      }
    }
  });

  elements.modalOverlay.addEventListener('touchend', function(e) {
    if (!isDragging) return;

    const diff = currentY - startY;
    isDragging = false;

    if (diff > 100) { // Close modal on swipe down
      hideModal(elements.modalOverlay);
    } else {
      // Reset position
      const modalContainer = elements.modalOverlay.querySelector('.modal-container');
      if (modalContainer) {
        modalContainer.style.transform = '';
        modalContainer.style.opacity = '';
      }
    }
  });

  // Keyboard navigation improvements for mobile
  elements.searchInput.addEventListener('focus', function() {
    // Scroll search into view on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        elements.searchInput.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }
  });
}

// Theme management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', state.currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.currentTheme);
  localStorage.setItem('theme', state.currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = elements.themeToggle.querySelector('i');
  icon.className = state.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Event listeners
function setupEventListeners() {
  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Help button
  elements.helpBtn.addEventListener('click', () => showModal(elements.helpModal));
  elements.helpModalClose.addEventListener('click', () => hideModal(elements.helpModal));

  // Search functionality
  elements.searchInput.addEventListener('input', handleSearch);
  elements.searchInput.addEventListener('focus', () => {
    if (state.filteredWords.length > 0 && elements.searchInput.value) {
      showSuggestions();
    }
  });
  elements.clearBtn.addEventListener('click', clearSearch);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.currentTarget.getAttribute('data-filter');
      setFilter(filter);
    });
  });

  // Modal close
  elements.modalClose.addEventListener('click', () => hideModal(elements.modalOverlay));
  elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay || e.target.classList.contains('modal-backdrop')) {
      hideModal(elements.modalOverlay);
    }
  });
  elements.helpModal.addEventListener('click', (e) => {
    if (e.target === elements.helpModal) {
      hideModal(elements.helpModal);
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyDown);

  // Click outside to hide suggestions
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideSuggestions();
    }
  });
}

function handleKeyDown(e) {
  // Escape key to close modals
  if (e.key === 'Escape') {
    hideModal(elements.modalOverlay);
    hideModal(elements.helpModal);
    hideSuggestions();
  }
  
  // Focus search input with Ctrl+K or Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    elements.searchInput.focus();
  }
}

// Data loading
async function loadWords() {
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE}/words`);
    if (!response.ok) throw new Error('Failed to fetch words');
    
    state.words = await response.json();
    state.filteredWords = [...state.words];
    renderWords();
    updateWordCount();
  } catch (error) {
    console.error('Error loading words:', error);
    showError('Chyba při načítání slov. Zkontrolujte připojení k serveru.');
  } finally {
    showLoading(false);
  }
}

// Search functionality
function handleSearch(e) {
  const query = e.target.value.trim();
  state.searchQuery = query;

  // Show/hide clear button
  elements.clearBtn.classList.toggle('visible', query.length > 0);

  applyFilters();
}

function setFilter(filter) {
  state.currentFilter = filter;
  
  // Update active state on buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
  });
  
  applyFilters();
}

function applyFilters() {
  let filtered = [...state.words];
  
  // Apply word type filter
  if (state.currentFilter !== 'all') {
    filtered = filtered.filter(word => word.word_type === state.currentFilter);
  }
  
  // Apply search query
  if (state.searchQuery.length > 0) {
    filtered = fuzzySearch(state.searchQuery, filtered);
    
    // Show suggestions if there are results
    if (filtered.length > 0) {
      state.filteredWords = filtered;
      showSuggestions();
    } else {
      hideSuggestions();
    }
  } else {
    hideSuggestions();
  }
  
  state.filteredWords = filtered;
  renderWords();
  updateWordCount();
}

function clearSearch() {
  elements.searchInput.value = '';
  elements.clearBtn.classList.remove('visible');
  state.searchQuery = '';
  hideSuggestions();
  applyFilters();
  elements.searchInput.focus();
}

function showSuggestions() {
  if (state.filteredWords.length === 0) return;
  
  const suggestions = state.filteredWords.slice(0, 5); // Show max 5 suggestions
  elements.searchSuggestions.innerHTML = suggestions.map(word => `
    <div class="suggestion-item" onclick="showWordDetail('${word.slang_word}')">
      <div>
        <div class="suggestion-main">${highlightText(word.slang_word, state.searchQuery)}</div>
        <div class="suggestion-sub">${word.standard_word}</div>
      </div>
    </div>
  `).join('');
  
  elements.searchSuggestions.classList.add('visible');
}

function hideSuggestions() {
  elements.searchSuggestions.classList.remove('visible');
}

function highlightText(text, query) {
  if (!query) return text;

  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);

  // Try to find the best match for highlighting
  const words = text.split(/\s+/);
  const normalizedWords = normalizedText.split(/\s+/);

  return words.map((word, index) => {
    const normalizedWord = normalizedWords[index];
    if (normalizedWord && normalizedWord.includes(normalizedQuery)) {
      return `<strong>${word}</strong>`;
    }
    return word;
  }).join(' ');
}

// Rendering functions
function renderWords() {
  if (state.filteredWords.length === 0) {
    elements.wordGrid.innerHTML = `
      <div class="loading">
        <i class="fas fa-search"></i>
        <span>${state.searchQuery ? 'Žádná slova nenalezena' : 'Žádná slova k zobrazení'}</span>
      </div>
    `;
    return;
  }
  
  elements.wordGrid.innerHTML = state.filteredWords.map((word, index) => {
    const typeIcon = word.word_type === 'zkratka' ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-font"></i>';
    const typeColor = word.word_type === 'zkratka' ? 'background: #f59e0b; color: white;' : '';
    
    return `
    <div class="word-card slide-in" onclick="showWordDetail('${word.slang_word}')" style="animation-delay: ${index * 0.05}s">
      <div class="word-category" style="${typeColor}">${typeIcon} ${word.category}</div>
      <div class="word-main">${highlightText(word.slang_word, state.searchQuery)}</div>
      <div class="word-standard">${word.standard_word}</div>
      <div class="word-meaning">${word.meaning}</div>
    </div>
  `;
  }).join('');
}

function updateWordCount() {
  const count = state.filteredWords.length;
  const total = state.words.length;
  
  let filterText = '';
  if (state.currentFilter === 'slovo') {
    filterText = ' (Slova)';
  } else if (state.currentFilter === 'zkratka') {
    filterText = ' (Zkratky)';
  }
  
  elements.wordCount.textContent = state.searchQuery || state.currentFilter !== 'all'
    ? `${count} z ${total} slov${filterText}`
    : `${total} slov`;
}

function showLoading(show) {
  if (show) {
    elements.wordGrid.innerHTML = `
      <div class="loading" id="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Načítání...</span>
      </div>
    `;
  }
}

function showError(message) {
  const isMobile = window.innerWidth <= 768;

  elements.wordGrid.innerHTML = `
    <div class="loading">
      <i class="fas fa-exclamation-triangle" style="color: var(--text-secondary);"></i>
      <span style="color: var(--text-secondary); ${isMobile ? 'font-size: 1rem;' : ''}">${message}</span>
      <button onclick="loadWords()" class="retry-btn" style="
        margin-top: 1rem;
        padding: ${isMobile ? '0.75rem 1.5rem' : '0.5rem 1rem'};
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: ${isMobile ? '1rem' : '0.9rem'};
        font-weight: 500;
        transition: all 0.2s ease;
      ">
        <i class="fas fa-redo" style="margin-right: 0.5rem;"></i>
        Zkusit znovu
      </button>
    </div>
  `;
}

// Word detail modal
async function showWordDetail(slangWord) {
  try {
    hideSuggestions();
    
    const response = await fetch(`${API_BASE}/word/${encodeURIComponent(slangWord)}`);
    if (!response.ok) throw new Error('Word not found');
    
    const word = await response.json();
    
    elements.modalTitle.textContent = `Detail slova: ${word.slang_word}`;
    elements.modalBody.innerHTML = generateWordDetailHTML(word);
    
    showModal(elements.modalOverlay);
  } catch (error) {
    console.error('Error loading word detail:', error);
    alert('Chyba při načítání detailu slova.');
  }
}

function generateWordDetailHTML(word) {
  return `
    <div class="word-detail">
      <div class="detail-header">
        <div class="detail-slang">${word.slang_word}${word.grammatical_info ? ', ' + word.grammatical_info : ''}</div>
        <div class="detail-standard">${word.standard_word}</div>
        ${word.genitive_form ? `<div class="detail-standard" style="font-size: 1.2rem; margin-top: 0.5rem;">2. pád: bez ${word.genitive_form}</div>` : ''}
      </div>
      
      <div class="detail-section">
        <h3><i class="fas fa-tag"></i> Typ</h3>
        <p>${word.word_type === 'slovo' ? 'Slovo' : 'Zkratka'}</p>
      </div>
      
      ${word.grammatical_info ? `
        <div class="detail-section">
          <h3><i class="fas fa-book"></i> Gramatické údaje</h3>
          <p>${word.grammatical_info}</p>
        </div>
      ` : ''}
      
      <div class="detail-section">
        <h3><i class="fas fa-info-circle"></i> Význam</h3>
        <p>${word.meaning}</p>
      </div>
      
      ${word.examples ? `
        <div class="detail-section">
          <h3><i class="fas fa-quote-left"></i> Příklady použití</h3>
          <p>${word.examples}</p>
        </div>
      ` : ''}
      
      ${word.diminutives ? `
        <div class="detail-section">
          <h3><i class="fas fa-heart"></i> Zdrobněliny</h3>
          <p>${word.diminutives}</p>
        </div>
      ` : ''}
      
      ${word.adjectives ? `
        <div class="detail-section">
          <h3><i class="fas fa-tags"></i> Přídavná jména</h3>
          <p>${word.adjectives}</p>
        </div>
      ` : ''}
      
      <div class="detail-section">
        <h3><i class="fas fa-folder"></i> Kategorie</h3>
        <p>${word.category}</p>
      </div>
    </div>
  `;
}

// Modal management
function showModal(modal) {
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
  
  // Add entrance animation
  if (modal === elements.modalOverlay) {
    const modalContainer = modal.querySelector('.modal-container');
    if (modalContainer) {
      modalContainer.style.animation = 'none';
      setTimeout(() => {
        modalContainer.style.animation = 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
      }, 10);
    }
  }
}

function hideModal(modal) {
  const modalContainer = modal.querySelector('.modal-container');
  if (modalContainer) {
    modalContainer.style.animation = 'modalSlideOut 0.3s ease-in forwards';
    setTimeout(() => {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    }, 300);
  } else {
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

// Utility functions for fuzzy search
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, ''); // Remove special characters except spaces
}

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(query, text, maxDistance = 1) {
  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);

  // Exact match (including normalized)
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  // Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(normalizedQuery, normalizedText);
  return distance <= maxDistance;
}

function fuzzySearch(query, words) {
  if (!query.trim()) return words;

  const normalizedQuery = normalizeText(query);

  return words.filter(word => {
    // Search in multiple fields
    const fields = [
      word.slang_word,
      word.standard_word,
      word.meaning,
      word.examples || '',
      word.diminutives || '',
      word.adjectives || ''
    ];

    return fields.some(field => fuzzyMatch(query, field));
  }).sort((a, b) => {
    // Sort by relevance: exact matches first, then fuzzy matches
    const aExact = normalizeText(a.slang_word).includes(normalizedQuery) ||
                   normalizeText(a.standard_word).includes(normalizedQuery);
    const bExact = normalizeText(b.slang_word).includes(normalizedQuery) ||
                   normalizeText(b.standard_word).includes(normalizedQuery);

    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // Then sort alphabetically
    return a.slang_word.localeCompare(b.slang_word);
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupEventListeners();
  initializeMobileOptimizations();
  loadWords();
});