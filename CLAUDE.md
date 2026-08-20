# CNC Academy

An interactive course taking a complete beginner from "what is CNC?" to
designing a custom CNC milling machine.

**Read `SPEC.md` before making any architectural or content decision.** It is
the single source of truth for the stack, the design system, the content model
and the phase plan.

**Current phase:** Phases 0–10 complete, every item in SPEC section 15
verified, and SPEC section 16 item 1 (the G-code simulator) built. Next work
comes from the rest of section 16 — the remaining thirteen levels of lesson
content are the largest item.

```bash
npm run dev        # http://localhost:3000
npm run build      # must pass before any phase is considered done
npm run typecheck  # tsc --noEmit, must be clean
npm run verify     # typecheck + check:content + build
npm run sweep      # browser sweep; needs the site running, reads BASE
```

Both `check:content` and `sweep` are part of the definition of done, and they
catch different things: the first checks facts about the content data, the
second checks facts about the rendered page. Run both before calling work
finished.

## Hosting

The canonical site is an **Azure Static Web App** (`.github/workflows/azure.yml`),
served from a static export. GitHub Pages still publishes an **archived copy**
that carries a notice bar and a canonical link pointing at Azure; it is the same
export built with `SITE_DEPRECATED` and `PRIMARY_SITE_URL` set. The switch lives
in `src/lib/site.ts`, alongside the `STATIC_EXPORT` / `PAGES_BASE_PATH` switches
in `next.config.mjs`.

Setup and cost: `docs/azure-deployment.md`. The site must stay fully
prerenderable — adding a route handler, a server action or request-time data
breaks the static export and with it the free hosting.
