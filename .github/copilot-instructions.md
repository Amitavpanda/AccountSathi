

***

# AccountSaathi - AI Copilot Instructions

## Project Overview  
This project enables users to create and manage accounting by uploading Sales and Purchase data by giving the inputs through a user-friendly interface. The system processes the data, generates accounting entries, and provides downloadable reports in PDF format.

**Tech Stack:** Next.js, Supabase, Node.js,

**Prompt Cheat Sheet:** `.github/HOW_TO_PROMPT.md` — copy-paste prompt templates for frontend, backend, QA, architecture, SEO, and more.

***

## AI Documentation Integration

### Context7 MCP Extension  
This project uses the *Context7 MCP* VS Code extension for accessing real-time and up-to-date library documentation:

- **Extension:** upstash.context7-mcp (pre-installed per `.vscode/extensions.json`)  
- **Function:** Query Next.js, Node.js, Leegality API, Supabase, and other libraries instantly via Copilot  
- **Instruction:** Ask Copilot to fetch documentation via Context7 whenever you need to clarify library-specific usage or APIs


### Chrome Dev Tools MCP Extension
This project uses the *Chrome Dev Tools MCP* extension for real-time debugging and inspection whenever there is a need to interact with Chrome Dev Tools or asking about frontend changes:
- *VS Code Extension*: upstash.chrome-devtools-mcp (already installed - see .vscode/extensions.json)
- *Usage*: Access Chrome Dev Tools features directly within VS Code
- *How to use*: Ask Copilot to assist with Chrome Dev Tools commands and workflows


### Reference Documentation Sources

| Technology            | Official Docs & Guides                                                                   |
|----------------------|-----------------------------------------------------------------------------------------|
| Next.js              | [https://nextjs.org/docs](https://nextjs.org/docs)                                      |
| Supabase             | [https://supabase.com/docs](https://supabase.com/docs)                                  |
                              |
| Next.js Best Practices | [Mastering Next.js Best Practices](https://iqbalpa.medium.com/mastering-next-js-best-practices-for-clean-scalable-and-type-safe-development-2ee5693e73a9) |
| Node.js Best Practices | [Node.js Best Practices](https://dev.to/mehedihasan2810/nodejs-best-practices-a-guide-for-developers-4d65) |
| Supabase Best Practices | [RLS, Performance, and Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) |

***

## Expectations from Copilot

- **Role:** Act as a Senior Architect and Senior Full-Stack Developer  
- **Code Quality:** Follow industry standards, security best practices, clean architecture, and scalable design principles strictly  
- **Focus Areas:**  
  - Modular, maintainable code with clear separation of concerns  
  - Robust error handling and logging for debugging  
  - Efficient database schema design aligned with RLS (Row Level Security) principles in Supabase  
  - Responsive, accessible frontend components in Next.js with best UX practices  
  - Secure API integrations, including validation and sanitization in Node.js backend  

***

## Best Practices Guidelines for Developers

### Design & Architecture

- Favor modular, layered architecture (e.g., clear separation of frontend, backend, and database layers)  
- Apply SOLID principles and DRY (Don't Repeat Yourself) in code  
- Design APIs to be RESTful or follow modern GraphQL approaches, document thoroughly  
- Use environment variables and secrets management securely (avoid hardcoding keys)  

### Backend & Database

- Use Supabase RLS policies effectively to ensure data security  
- Normalize database schema for maintainability, denormalize smartly for performance  
- Use server-side validation and input sanitization  
- Implement centralized error handling and logging (Structured logs for easier debugging)  

### Frontend Development

- Use React hooks and functional components idiomatically  
- Optimize performance via code-splitting, lazy loading, and memoization  
- Follow a11y (accessibility) standards for all UI elements  
- Implement responsive design fitting typical user devices  

### Debugging & Testing

- Write unit and integration tests (e.g., Playwright, Jest) covering critical workflows  
- Use logging and monitoring to trace bugs in production  
- Leverage VS Code debugging tools and extensions for efficient dev cycles  

***

## Context7 Integration Usage

For real-time, up-to-date ABP or other library docs:  
- Prompt Copilot to query Context7 MCP extension before generating code or answering questions  

***

If you want, this file can be extended with templates for prompts, testing checklists, or team best practices summaries.

***

## Skill System

This project uses a **universal role-based skill system**. When working on a task, identify the relevant team role and load the corresponding skill file before generating code or making decisions.

### Project Context Files (read for every session)
- **Architecture**: `.github/architecture.md` — tech stack, constraints, environment variables
- **Design System**: `.github/design.md` — brand tokens, component library, animation guidelines

### How to Use Skills
1. Identify the task type (frontend, backend, design, QA, etc.)
2. Read the corresponding `SKILL.md` file from `.github/skills/<name>/SKILL.md`
3. Follow the skill's best practices, checklists, and collaboration patterns
4. Multiple skills can apply to one task (e.g., `frontend-engineer` + `accessibility-design`)

### Skill Index by Team Role

| Role | Skill File |
|------|-----------|
| **Engineering** | |
| Frontend Engineer | `.github/skills/frontend-engineer/SKILL.md` |
| Backend Engineer | `.github/skills/backend-engineer/SKILL.md` |
| Full-Stack Engineer | `.github/skills/fullstack-engineer/SKILL.md` |
| Mobile Engineer | `.github/skills/mobile-engineer/SKILL.md` |
| Frontend Testing | `.github/skills/frontend-testing/SKILL.md` |
| Backend Testing | `.github/skills/backend-testing/SKILL.md` |
| API Design | `.github/skills/api-design/SKILL.md` |
| Microservices | `.github/skills/microservices/SKILL.md` |
| Frontend Performance | `.github/skills/frontend-performance/SKILL.md` |
| Monorepo Patterns | `.github/skills/monorepo-patterns/SKILL.md` |
| **Product** | |
| Product Discovery | `.github/skills/product-discovery/SKILL.md` |
| Product Roadmap | `.github/skills/product-roadmap/SKILL.md` |
| Product Requirements | `.github/skills/product-requirements/SKILL.md` |
| Product Metrics | `.github/skills/product-metrics/SKILL.md` |
| Stakeholder Management | `.github/skills/stakeholder-management/SKILL.md` |
| **Design** | |
| UX Design | `.github/skills/ux-design/SKILL.md` |
| UI Design | `.github/skills/ui-design/SKILL.md` |
| Design Systems | `.github/skills/design-systems/SKILL.md` |
| UX Research | `.github/skills/ux-research/SKILL.md` |
| Accessibility Design | `.github/skills/accessibility-design/SKILL.md` |
| Interaction Design | `.github/skills/interaction-design/SKILL.md` |
| **QA / Testing** | |
| QA Strategy | `.github/skills/qa-strategy/SKILL.md` |
| Manual Testing | `.github/skills/manual-testing/SKILL.md` |
| Automation Testing | `.github/skills/automation-testing/SKILL.md` |
| Performance Testing | `.github/skills/performance-testing/SKILL.md` |
| Security Testing | `.github/skills/security-testing/SKILL.md` |
| **Data** | |
| Data Engineering | `.github/skills/data-engineering/SKILL.md` |
| Data Analytics | `.github/skills/data-analytics/SKILL.md` |
| Data Science | `.github/skills/data-science/SKILL.md` |
| Data Governance | `.github/skills/data-governance/SKILL.md` |
| **DevOps / SRE** | |
| DevOps Engineer | `.github/skills/devops-engineer/SKILL.md` |
| Containerization | `.github/skills/containerization/SKILL.md` |
| Monitoring & Observability | `.github/skills/monitoring/SKILL.md` |
| Security Operations | `.github/skills/security-operations/SKILL.md` |
| Deployment Strategies | `.github/skills/deployment-strategies/SKILL.md` |
| **Security** | |
| Security Engineer | `.github/skills/security-engineer/SKILL.md` |
| Application Security | `.github/skills/appsec/SKILL.md` |
| Infrastructure Security | `.github/skills/infrastructure-security/SKILL.md` |
| **Leadership** | |
| Engineering Manager | `.github/skills/engineering-manager/SKILL.md` |
| Tech Lead | `.github/skills/tech-lead/SKILL.md` |
| Architect | `.github/skills/architect/SKILL.md` |
| Project Management | `.github/skills/project-management/SKILL.md` |
| **Marketing / Growth** | |
| SEO / GEO Optimization | `.github/skills/seo-geo/SKILL.md` |

### Memory System
Learnings are captured manually during and after sessions.
- General lessons: `.github/memory/lessons.md`
- Anti-patterns: `.github/memory/anti-patterns.md`
- Architecture decisions: `.github/memory/decisions.md`
- Per-skill learnings: `.github/skills/<name>/LEARNINGS.md`

***




