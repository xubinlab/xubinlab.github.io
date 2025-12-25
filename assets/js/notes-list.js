/**
 * Load and display notes list
 */

(function() {
  'use strict';

  // Detect language from pathname
  function detectLanguage() {
    const pathname = window.location.pathname;
    return pathname.startsWith('/zh/') || pathname === '/zh' ? 'zh' : 'en';
  }

  /**
   * Load JSON data
   */
  async function loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  }

  /**
   * Group notes by category
   */
  function groupByCategory(notes) {
    const grouped = {};
    notes.forEach(note => {
      if (!grouped[note.category]) {
        grouped[note.category] = [];
      }
      grouped[note.category].push(note);
    });
    return grouped;
  }

  /**
   * Render notes
   */
  function renderNotes(notes, container) {
    if (!container || notes.length === 0) {
      container.innerHTML = '<p class="muted">No notes available.</p>';
      return;
    }

    const lang = detectLanguage();
    const grouped = groupByCategory(notes);

    let html = '';

    Object.keys(grouped).forEach(category => {
      html += `<h3>${category}</h3>\n<ul>\n`;
      
      grouped[category].forEach(note => {
        const date = note.date || '';
        const tags = note.tags ? note.tags.split(' · ') : [];
        const tagsHTML = tags.length > 0 ? ` <span class="muted">· ${tags.join(' · ')}</span>` : '';
        html += `
          <li>
            <a href="/${lang === 'zh' ? 'zh/' : ''}notes/${note.slug}.html">
              ${note.title}
            </a>
            ${date ? ` <span class="muted"> · ${date}` : ''}${tagsHTML}</span>
          </li>
        `;
      });

      html += '</ul>\n';
    });

    container.innerHTML = html;
  }

  /**
   * Initialize
   */
  async function init() {
    const lang = detectLanguage();
    const notesUrl = `/assets/data/notes.${lang}.json`;
    const container = document.getElementById('notes-list');

    if (container) {
      const notes = await loadJSON(notesUrl);
      renderNotes(notes, container);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

