# Site Route Mapping

This document defines the complete route structure for the Xu Bin Lab website.

## Language Routing Principles

- **Root paths (`/`)**: Default to English
- **Chinese paths (`/zh/`)**: All Chinese content
- **Language switching**: Each page links to its counterpart in the other language
- **Fallback**: If counterpart doesn't exist, fallback to language home page

## Route Mapping Table

### Home Pages
| English | Chinese |
|---------|---------|
| `/` | `/zh/` |

### Tech Stack
| English | Chinese |
|---------|---------|
| `/tech-stack/` | `/zh/tech-stack/` |
| `/tech-stack/physics-modeling.html` | `/zh/tech-stack/physics-modeling.html` |
| `/tech-stack/numerics-hpc.html` | `/zh/tech-stack/numerics-hpc.html` |
| `/tech-stack/software-workflow.html` | `/zh/tech-stack/software-workflow.html` |
| `/tech-stack/chips-system.html` | `/zh/tech-stack/chips-system.html` |
| `/tech-stack/ai-sim-coding.html` | `/zh/tech-stack/ai-sim-coding.html` |

### Projects
| English | Chinese |
|---------|---------|
| `/projects/` | `/zh/projects/` |
| `/projects/<slug>/` | `/zh/projects/<slug>/` |

### Notes
| English | Chinese |
|---------|---------|
| `/notes/` | `/zh/notes/` |
| `/notes/<slug>.html` | `/zh/notes/<slug>.html` |

### Tools
| English | Chinese |
|---------|---------|
| `/tools/` | `/zh/tools/` |

### Misc
| English | Chinese |
|---------|---------|
| `/misc/` | `/zh/misc/` |

## Navigation Structure

All pages share the same navigation structure:

### English Navigation
- About (links to `/#about`)
- Tech Stack (links to `/tech-stack/`)
- Projects (links to `/projects/`)
- Notes (links to `/notes/`)
- Tools (links to `/tools/`)
- Misc (links to `/misc/`)
- Contact (links to `/#contact`)
- Language Switch: "中文" (links to `/zh/` + current relative path)

### Chinese Navigation
- 关于 (links to `/zh/#about`)
- 技术体系 (links to `/zh/tech-stack/`)
- 项目 (links to `/zh/projects/`)
- 技术笔记 (links to `/zh/notes/`)
- 工具 (links to `/zh/tools/`)
- 杂谈 (links to `/zh/misc/`)
- 联系 (links to `/zh/#contact`)
- Language Switch: "EN" (links to `/` + current relative path without `/zh/` prefix)

## Implementation Notes

1. All navigation is injected via `assets/js/site-nav.js`
2. Navigation detects current pathname and language automatically
3. Active tab highlighting is based on pathname matching
4. Language switching preserves the relative path structure

