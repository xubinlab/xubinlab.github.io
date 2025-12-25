#!/usr/bin/env node
/**
 * Link checker script for static site
 * Checks all internal links in HTML files to ensure they don't 404
 */

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.join(__dirname, '..');
const HTML_FILES = [];
const INTERNAL_LINKS = new Map(); // Use Map for proper deduplication
const MISSING_FILES = [];

/**
 * Recursively find all HTML files
 */
function findHTMLFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules, .git, and other hidden directories
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        findHTMLFiles(fullPath);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      HTML_FILES.push(fullPath);
    }
  }
}

/**
 * Extract internal links from HTML content
 */
function extractLinks(htmlContent, filePath) {
  // Match href attributes
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  
  while ((match = hrefRegex.exec(htmlContent)) !== null) {
    const link = match[1];
    
    // Only check internal links (starting with /, ./, or ../)
    if (link.startsWith('/') || link.startsWith('./') || link.startsWith('../')) {
      // Skip anchors and external protocols
      if (!link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('mailto:')) {
        const source = path.relative(SITE_ROOT, filePath);
        const key = `${source} -> ${link}`;
        if (!INTERNAL_LINKS.has(key)) {
          INTERNAL_LINKS.set(key, {
            link: link,
            source: source
          });
        }
      }
    }
  }
}

/**
 * Resolve link path relative to source file
 */
function resolveLinkPath(link, sourceFile) {
  // Remove anchor
  const linkWithoutAnchor = link.split('#')[0];
  
  if (linkWithoutAnchor.startsWith('/')) {
    // Absolute path from site root - use resolve to handle leading slash correctly
    return path.resolve(SITE_ROOT, '.' + linkWithoutAnchor);
  } else {
    // Relative path
    const sourceDir = path.dirname(sourceFile);
    return path.resolve(sourceDir, linkWithoutAnchor);
  }
}

/**
 * Check if file exists
 */
function checkLink(linkObj) {
  const resolvedPath = resolveLinkPath(linkObj.link, path.join(SITE_ROOT, linkObj.source));
  
  // Normalize path separators
  const normalizedPath = resolvedPath.replace(/\\/g, '/');
  
  // Check if file exists
  if (!fs.existsSync(normalizedPath)) {
    // Also check with index.html
    const withIndex = path.join(normalizedPath, 'index.html').replace(/\\/g, '/');
    if (!fs.existsSync(withIndex)) {
      MISSING_FILES.push({
        link: linkObj.link,
        source: linkObj.source,
        resolved: normalizedPath
      });
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning HTML files...');
  findHTMLFiles(SITE_ROOT);
  console.log(`Found ${HTML_FILES.length} HTML files\n`);

  console.log('📝 Extracting internal links...');
  for (const file of HTML_FILES) {
    const content = fs.readFileSync(file, 'utf-8');
    extractLinks(content, file);
  }
  console.log(`Found ${INTERNAL_LINKS.size} internal links\n`);

  console.log('✅ Checking links...');
  for (const linkObj of INTERNAL_LINKS.values()) {
    checkLink(linkObj);
  }

  if (MISSING_FILES.length > 0) {
    console.error('❌ Found broken links:\n');
    for (const missing of MISSING_FILES) {
      console.error(`  ${missing.link}`);
      console.error(`    Source: ${missing.source}`);
      console.error(`    Resolved: ${missing.resolved}\n`);
    }
    process.exit(1);
  } else {
    console.log('✅ All links are valid!');
    process.exit(0);
  }
}

main();

