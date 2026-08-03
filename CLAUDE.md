# CNC Academy

An interactive course taking a complete beginner from "what is CNC?" to
designing a custom CNC milling machine.

**Read `SPEC.md` before making any architectural or content decision.** It is
the single source of truth for the stack, the design system, the content model
and the phase plan.

**Current phase:** Phases 0–10 complete. Every item in SPEC section 15 is
verified. Next work comes from SPEC section 16 (roadmap), starting with the
G-code simulator — `/simulator` is currently an honest "in development" stub.

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
