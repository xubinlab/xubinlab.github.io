/**
 * Load and display projects list
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
   * Group projects by category
   */
  function groupByCategory(projects) {
    const grouped = {};
    projects.forEach(project => {
      if (!grouped[project.category]) {
        grouped[project.category] = [];
      }
      grouped[project.category].push(project);
    });
    return grouped;
  }

  /**
   * Render projects
   */
  function renderProjects(projects, container) {
    if (!container || projects.length === 0) {
      container.innerHTML = '<p class="muted">No projects available.</p>';
      return;
    }

    const lang = detectLanguage();
    const readMore = lang === 'zh' ? '阅读更多' : 'Read more';
    const grouped = groupByCategory(projects);

    let html = '';

    Object.keys(grouped).forEach(category => {
      html += `<h3>${category}</h3>\n<ul class="projects-list">\n`;
      
      grouped[category].forEach(project => {
        const highlightsHTML = project.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('\n');
        html += `
          <li class="project-item">
            <div class="project-item-header">
              <h4><a href="/${lang === 'zh' ? 'zh/' : ''}projects/${project.slug}/">${project.title}</a></h4>
              <span class="project-period">${project.period}</span>
            </div>
            <p class="project-tagline">${project.tagline}</p>
            <ul class="project-highlights">
              ${highlightsHTML}
            </ul>
            <a href="/${lang === 'zh' ? 'zh/' : ''}projects/${project.slug}/" class="btn secondary">${readMore} →</a>
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
    const projectsUrl = `/assets/data/projects.${lang}.json`;
    const container = document.getElementById('projects-list');

    if (container) {
      const projects = await loadJSON(projectsUrl);
      renderProjects(projects, container);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

