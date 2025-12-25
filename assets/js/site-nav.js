/**
 * Unified Site Navigation
 * Automatically generates navigation bar based on current pathname
 */

(function() {
  'use strict';

  // Navigation configuration
  const navConfig = {
    en: {
      brand: 'XU BIN LAB',
      items: [
        { label: 'About', href: '/#about' },
        { label: 'Tech Stack', href: '/tech-stack/' },
        { label: 'Projects', href: '/projects/' },
        { label: 'Notes', href: '/notes/' },
        { label: 'Tools', href: '/tools/' },
        { label: 'Misc', href: '/misc/' },
        { label: 'Contact', href: '/#contact' }
      ],
      langSwitch: { label: '中文', getHref: getChinesePath }
    },
    zh: {
      brand: 'XU BIN LAB',
      items: [
        { label: '关于', href: '/zh/#about' },
        { label: '技术体系', href: '/zh/tech-stack/' },
        { label: '项目', href: '/zh/projects/' },
        { label: '技术笔记', href: '/zh/notes/' },
        { label: '工具', href: '/zh/tools/' },
        { label: '杂谈', href: '/zh/misc/' },
        { label: '联系', href: '/zh/#contact' }
      ],
      langSwitch: { label: 'EN', getHref: getEnglishPath }
    }
  };

  /**
   * Detect current language from pathname
   */
  function detectLanguage() {
    const pathname = window.location.pathname;
    return pathname.startsWith('/zh/') || pathname === '/zh' ? 'zh' : 'en';
  }

  /**
   * Get current relative path (without language prefix)
   */
  function getCurrentRelativePath() {
    let pathname = window.location.pathname;
    // Remove trailing slash for consistency
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    // Remove /zh or /en prefix if present (for robustness, though /en/ pages are removed)
    if (pathname.startsWith('/zh')) {
      pathname = pathname.substring(3);
      if (pathname === '') pathname = '/';
    } else if (pathname.startsWith('/en')) {
      pathname = pathname.substring(3);
      if (pathname === '') pathname = '/';
    }
    return pathname;
  }

  /**
   * Get Chinese path for current page
   */
  function getChinesePath() {
    const relPath = getCurrentRelativePath();
    // Check if Chinese version exists by testing path
    // For now, we assume all pages have Chinese versions
    // Fallback to /zh/ if specific page doesn't exist
    return '/zh' + relPath;
  }

  /**
   * Get English path for current page
   */
  function getEnglishPath() {
    const relPath = getCurrentRelativePath();
    return relPath === '/' ? '/' : relPath;
  }

  /**
   * Check if a nav item is active
   */
  function isActiveNavItem(href, pathname) {
    // Handle hash anchors
    if (href.includes('#')) {
      const baseHref = href.split('#')[0];
      // For home page anchors, check if we're on home page
      if (baseHref === '/' && (pathname === '/' || pathname === '/zh/')) {
        return true;
      }
      // For other anchors, check base path
      return pathname === baseHref || pathname === baseHref + '/';
    }
    // Exact match
    if (pathname === href || pathname === href + '/') {
      return true;
    }
    // For section pages, check if current path starts with nav href
    // (e.g., /notes/something.html should highlight "Notes")
    if (href !== '/' && pathname.startsWith(href)) {
      return true;
    }
    return false;
  }

  /**
   * Generate navigation HTML
   */
  function generateNav() {
    const lang = detectLanguage();
    const config = navConfig[lang];
    const pathname = window.location.pathname;
    
    // Build brand
    const brandLink = lang === 'en' ? '/' : '/zh/';
    let html = `
      <nav>
        <div class="brand">
          <a href="${brandLink}" style="color:inherit;text-decoration:none;">${config.brand}</a>
        </div>
        <ul>
    `;

    // Build nav items
    config.items.forEach(item => {
      const active = isActiveNavItem(item.href, pathname) ? ' class="active"' : '';
      html += `      <li${active}><a href="${item.href}">${item.label}</a></li>\n`;
    });

    // Add language switch
    const langHref = config.langSwitch.getHref();
    html += `      <li class="lang-switch"><a href="${langHref}">${config.langSwitch.label}</a></li>\n`;
    
    html += `        </ul>
      </nav>`;

    return html;
  }

  /**
   * Initialize navigation
   */
  function init() {
    const navContainer = document.getElementById('site-nav');
    if (!navContainer) {
      console.warn('Site nav container #site-nav not found');
      return;
    }

    const navHTML = generateNav();
    navContainer.innerHTML = navHTML;

    // Update header structure if needed
    const header = navContainer.closest('header');
    if (header && !header.querySelector('nav')) {
      header.innerHTML = navHTML;
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

