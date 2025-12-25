/**
 * Load and display project detail page
 */

(function() {
  'use strict';

  // Detect language from pathname
  function detectLanguage() {
    const pathname = window.location.pathname;
    return pathname.startsWith('/zh/') || pathname === '/zh' ? 'zh' : 'en';
  }

  /**
   * Get project slug from URL
   */
  function getProjectSlug() {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/projects\/([^\/]+)/);
    return match ? match[1] : null;
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
   * Render project detail
   */
  function renderProjectDetail(project, container) {
    if (!container || !project) {
      container.innerHTML = '<p class="muted">Project not found.</p>';
      return;
    }

    const lang = detectLanguage();
    const labels = {
      en: {
        background: 'Background',
        goal: 'Goal & Constraints',
        role: 'My Role',
        highlights: 'Technical Highlights',
        results: 'Results & Metrics',
        artifacts: 'Artifacts',
        back: '← Back to Projects'
      },
      zh: {
        background: '问题背景',
        goal: '目标与约束',
        role: '我的角色',
        highlights: '技术要点',
        results: '结果与指标',
        artifacts: '相关资源',
        back: '← 返回项目列表'
      }
    };
    const t = labels[lang];

    const highlightsHTML = project.highlights.map(h => `<li>${h}</li>`).join('\n');
    const artifactsHTML = project.artifacts ? project.artifacts.map(a => `<li>${a}</li>`).join('\n') : '';

    let html = `
      <article class="project-detail">
        <h1>${project.title}</h1>
        <div class="project-meta">
          <span class="project-period">${project.period}</span>
          <span class="project-category">${project.category}</span>
        </div>

        <h2>${t.background}</h2>
        <p>${project.summary || project.background || 'Background information not available.'}</p>

        <h2>${t.goal}</h2>
        <p>${project.goal || 'Goal and constraints information not available.'}</p>

        <h2>${t.role}</h2>
        <p>${project.role || 'Role information not available.'}</p>

        <h2>${t.highlights}</h2>
        <ul>
          ${highlightsHTML}
        </ul>

        <h2>${t.results}</h2>
        <p>${project.results || 'Results and metrics available upon request.'}</p>

        ${artifactsHTML ? `
        <h2>${t.artifacts}</h2>
        <ul>
          ${artifactsHTML}
        </ul>
        ` : ''}

        <div class="project-footer">
          <p><a href="/${lang === 'zh' ? 'zh/' : ''}projects/">${t.back}</a></p>
        </div>
      </article>
    `;

    container.innerHTML = html;
  }

  /**
   * Initialize
   */
  async function init() {
    const slug = getProjectSlug();
    if (!slug) {
      console.error('Project slug not found in URL');
      return;
    }

    const lang = detectLanguage();
    const projectsUrl = `/assets/data/projects.${lang}.json`;
    const container = document.getElementById('project-detail');

    if (container) {
      const projects = await loadJSON(projectsUrl);
      const project = projects.find(p => p.slug === slug);
      renderProjectDetail(project, container);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

