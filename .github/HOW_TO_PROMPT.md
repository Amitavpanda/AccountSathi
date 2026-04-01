# How to Prompt Copilot in AccountSaathi

A practical cheat sheet for the team. Copy-paste these patterns and adapt them to your task.

---

## The Golden Formula

```
[Role/Skill] + [Context file(s)] + [Specific task] + [What NOT to change]
```

The more explicit you are about role, scope, and output, the better the result.

---

## Prompt Templates by Role

### Frontend — Build a New Component

```
Use the frontend-engineer and ui-design skills.
Read .github/architecture.md and .github/design.md first.

Build a [component name] component in apps/retailerShop/app/components/.
- It receives [props] and renders [behaviour]
- Follow the existing Tailwind patterns from the design system
- Add TypeScript types — no `any`
- Do NOT touch unrelated components
```

**Example:**
```
Use the frontend-engineer and accessibility-design skills.
Read .github/design.md first.

Build a SalesSummaryCard component in apps/retailerShop/app/components/.
It takes { totalSales, period, trend } props and renders a card with trend indicator.
Use the existing Tailwind color tokens. Add ARIA labels for the trend icon.
Do NOT modify layout.tsx or globals.css.
```

---

### Backend — Add an API Endpoint

```
Use the backend-engineer and api-design skills.
Read .github/architecture.md first.

Add a [METHOD] /[route] endpoint in apps/api/src/.
- It should [describe what it does]
- Validate input with [zod / existing schema pattern]
- Use the existing middleware for auth
- Return [describe response shape]
- Do NOT change unrelated routes or middleware
```

**Example:**
```
Use the backend-engineer skill.
Read .github/architecture.md first.

Add a GET /sales/summary endpoint in apps/api/src/routes.ts.
It should return total sales grouped by day for the authenticated user.
Validate the date range query param (max 90 days).
Use the existing Supabase client from packages/db.
Do NOT change the purchase routes.
```

---

### Database — Schema or Query Change

```
Use the backend-engineer skill.
Read packages/db/prisma/schema.prisma first.

[Describe the schema change or query needed].
- Add RLS policy for [table] if creating a new table
- Write the migration file
- Do NOT alter existing tables unless explicitly required
```

**Example:**
```
Use the backend-engineer skill.
Read packages/db/prisma/schema.prisma first.

Add a `reports` table with fields: id, userId, type, createdAt, fileUrl.
Add a Supabase RLS policy that restricts rows to the owning userId.
Write the Prisma migration. Do NOT modify the `sales` or `purchases` tables.
```

---

### QA — Write Tests for a Feature

```
Use the frontend-testing [or backend-testing] skill.

Write tests for [component/function/route] in [file path].
Cover: [list the key scenarios — happy path, edge case, error case]
Use the existing test setup (jest / Playwright).
Do NOT add tests for unrelated code.
```

**Example:**
```
Use the backend-testing skill.

Write integration tests for the POST /purchase endpoint in apps/api/src/.
Cover: valid payload creates a record, missing required fields returns 400,
unauthenticated request returns 401, duplicate entry returns 409.
Use the existing Jest + Supabase test setup.
```

---

### Architecture Review

```
Use the architect and tech-lead skills.
Read .github/architecture.md first.

Review [description of the change or feature plan].
Identify: coupling risks, scalability concerns, security gaps, migration complexity.
Propose alternatives if the current approach has a significant issue.
Do NOT generate implementation code — analysis and ADR only.
```

**Example:**
```
Use the architect skill.
Read .github/architecture.md first.

Review this plan: we want to move PDF generation from client-side to a server-side
queue using Bull + Redis. The reports will be stored in Supabase Storage.
Identify risks, suggest event flow, and draft an ADR for this decision.
```

---

### Security Review

```
Use the security-engineer and appsec skills.
Read .github/architecture.md first.

Review [file path or feature] for OWASP Top 10 issues, auth gaps, and input validation.
Flag any: unvalidated inputs, missing auth checks, secrets exposure, SQL injection risks.
Suggest fixes for each finding — ranked by severity.
```

**Example:**
```
Use the appsec skill.

Review apps/api/src/contollers/sales for OWASP Top 10 issues.
Flag any missing input validation, auth bypass risks, or data exposure.
Rank findings by severity and suggest a fix for each.
Do NOT refactor unrelated code.
```

---

### SEO / GEO Audit or Optimization

```
Use the seo-geo skill.
Target: [page path or component]

[Choose one]:
- Audit this page for technical SEO and AI crawlability
- Add JSON-LD schema markup for [page type]
- Optimize this content to be cited by AI search engines
- Review meta tags against best practices
```

**Example:**
```
Use the seo-geo skill.

Audit the pages in apps/retailerShop/app/ for:
- Missing or weak meta title / description
- Missing JSON-LD schema (add Article or WebPage schema where appropriate)
- Robots.txt: ensure GPTBot, PerplexityBot, ClaudeBot are not blocked
- Content structure: add FAQ sections to improve GEO citation rate

Apply the 9 Princeton GEO methods to the landing page content.
```

---

### Performance Optimization

```
Use the frontend-performance skill.
Read .github/architecture.md first.

Analyse [component or page] for Core Web Vitals issues.
Look for: render-blocking, large bundle sizes, missing lazy loading, N+1 API calls.
Propose fixes — prioritise by impact on LCP, FID, CLS.
Do NOT change business logic.
```

**Example:**
```
Use the frontend-performance skill.

Analyse apps/retailerShop/app/salesOverview/ for LCP and bundle size issues.
Check for: missing dynamic imports, blocking data fetches, oversized images.
Show the changes needed. Do NOT change form validation or API contracts.
```

---

### Product — Write a User Story or Acceptance Criteria

```
Use the product-requirements skill.

Write a user story and acceptance criteria for: [describe the feature].
Format: As a [user], I can [action], so that [benefit].
Include: happy path, error states, edge cases.
Output as a ticket-ready markdown block.
```

**Example:**
```
Use the product-requirements skill.

Write a user story and acceptance criteria for:
"A retailer can download their monthly purchase report as a PDF."
Include edge cases: no data for the month, PDF generation timeout, mobile download.
```

---

### Full-Stack Feature — End to End

```
Use the fullstack-engineer skill.
Read .github/architecture.md and .github/design.md first.

Build the complete [feature name] feature:
- Backend: [describe API / DB changes]
- Frontend: [describe UI / component]
- Tests: cover the critical path
- Do NOT modify unrelated routes, components, or tables
```

**Example:**
```
Use the fullstack-engineer skill.
Read .github/architecture.md first.

Build the "active sales dashboard" feature:
- Backend: GET /sales/active endpoint returning active sales for today
- Frontend: ActiveSalesTable component in apps/retailerShop/app/activeSales/
- Add row-level Supabase policy so users only see their own sales
- Include a loading and empty state
- Write one integration test for the API and one component test for the table
```

---

## Tips for Better Results

| Do | Don't |
|----|-------|
| Name the skill explicitly | Rely on implicit skill discovery for complex tasks |
| Say what NOT to change | Leave scope open-ended |
| Reference the relevant file paths | Say "the usual place" |
| Combine skills when spanning domains | Use just one skill for cross-cutting work |
| Ask for one output type (code OR ADR OR plan) | Ask for everything at once |
| Specify test coverage expectations | Assume tests will be written unless asked |

---

## Quick Skill Reference

| Task | Skills to Load |
|------|---------------|
| Build UI component | `frontend-engineer` + `ui-design` |
| Accessible UI | `frontend-engineer` + `accessibility-design` |
| REST API endpoint | `backend-engineer` + `api-design` |
| Full feature (UI + API + DB) | `fullstack-engineer` |
| Write tests | `frontend-testing` OR `backend-testing` |
| Architecture decision | `architect` + `tech-lead` |
| Security review | `appsec` + `security-engineer` |
| SEO / GEO optimization | `seo-geo` |
| Performance audit | `frontend-performance` |
| Sprint planning | `project-management` |
| Product story | `product-requirements` |
| Design review | `ui-design` + `ux-design` |
| Infra / DevOps | `devops-engineer` + `containerization` |
