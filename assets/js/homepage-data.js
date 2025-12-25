/**
 * Load and display Projects and Notes data on homepage
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
   * Render project cards
   */
  function renderProjects(projects, container) {
    if (!container || projects.length === 0) return;

    const lang = detectLanguage();
    const readMore = lang === 'zh' ? '阅读更多' : 'Read more';

    let html = '<div class="projects-grid">';
    
    projects.slice(0, 3).forEach(project => {
      const highlightsHTML = project.highlights.map(h => `<li>${h}</li>`).join('\n');
      html += `
        <div class="project-card">
          <h3>${project.title}</h3>
          <p class="project-tagline">${project.tagline}</p>
          <ul class="project-highlights">
            ${highlightsHTML}
          </ul>
          <a href="/${lang === 'zh' ? 'zh/' : ''}projects/${project.slug}/" class="btn secondary">${readMore} →</a>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }

  /**
   * Render notes list
   */
  function renderNotes(notes, container) {
    if (!container || notes.length === 0) return;

    const lang = detectLanguage();
    
    let html = '<ul class="notes-list">';
    
    notes.slice(0, 3).forEach(note => {
      const date = note.date || '';
      html += `
        <li class="note-item">
          <h4><a href="/${lang === 'zh' ? 'zh/' : ''}notes/${note.slug}.html">${note.title}</a></h4>
          <div class="note-meta">
            <span class="note-date">${date}</span>
            <span class="note-category">${note.category}</span>
          </div>
          <p class="note-summary">${note.summary}</p>
        </li>
      `;
    });

    html += '</ul>';
    container.innerHTML = html;
  }

  /**
   * Initialize
   */
  async function init() {
    const lang = detectLanguage();
    const projectsUrl = `/assets/data/projects.${lang}.json`;
    const notesUrl = `/assets/data/notes.${lang}.json`;

    // Load and render projects
    const projectsContainer = document.getElementById('homepage-projects');
    if (projectsContainer) {
      const projects = await loadJSON(projectsUrl);
      renderProjects(projects, projectsContainer);
    }

    // Load and render notes
    const notesContainer = document.getElementById('homepage-notes');
    if (notesContainer) {
      const notes = await loadJSON(notesUrl);
      renderNotes(notes, notesContainer);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

