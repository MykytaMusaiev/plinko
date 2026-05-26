---
name: ui-qa
description: Perform qualitative UI QA for Plinko visible UI changes. Use after implementation and before pre-commit when a task changes visible UI, layout, navigation, responsive behavior, animation, or high-frequency interaction.
---

# UI QA

## Goal

Record practical evidence that visible UI changes render correctly, remain
usable across expected viewports, and do not introduce obvious interaction or
render/performance risks.

## When to use

- A task creates or changes visible UI.
- A task changes layout, navigation, shell/header/footer behavior, responsive
  behavior, animation, gameplay interaction, or high-frequency interaction.
- Implementation marks UI QA as required in the active task artifact.

## When not to use

- The change is docs-only, workflow-only, server-only, or type-only with no
  visible UI impact.
- The user explicitly limits the work to a different read-only review.
- The task requires automated browser tooling that is not already approved.

## Required context

- User scope and expected UI behavior.
- Active task artifact and UI QA requirement.
- Changed UI files and relevant surrounding components.
- Known routes or screens affected by the change.
- Available manual or screenshot evidence.

## Restrictions

- Do not edit files unless the user explicitly asks for fixes.
- Do not add Playwright, dependencies, automation scripts, MCP/tools, hooks, or
  CI gates.
- Do not create a hard rerender-count quality gate.
- Do not require exact render counts.
- Do not add React Profiler automation.
- Do not optimize preemptively without evidence.
- Do not treat unavailable in-agent browser/auth access as automatic failure
  when approved manual evidence can cover the UI risk.

## Workflow

1. Confirm affected routes, components, viewports, and interaction states.
2. Check layout and screenshot/manual evidence:
   - primary viewport renders the intended UI;
   - changed content is visible and not clipped unintentionally;
   - text fits its containers;
   - controls and states do not overlap.
3. Check responsive sanity:
   - narrow and wide layouts remain usable;
   - fixed-format elements keep stable dimensions;
   - wrapping, scrolling, and density are intentional.
4. Check navigation and shell overlap sanity:
   - route transitions, headers, footers, bottom navigation, dialogs, and
     sticky/fixed areas do not cover primary actions or content unexpectedly;
   - focus and click targets remain reachable.
5. Check basic UX sanity:
   - labels, affordances, loading/empty/error states, disabled states, and
     feedback match the task scope;
   - common workflows remain direct and understandable;
   - destructive or irreversible actions have appropriate friction when in
     scope.
6. Check qualitative render/performance sanity:
   - no visible lag during normal UI interaction;
   - no obvious unnecessary rerender risk from broad Zustand or TanStack Query
     subscriptions in visual components;
   - no duplicated derived state where existing state or query data can be
     rendered directly;
   - no suspicious `useEffect` plus `setState` synchronization patterns;
   - no expensive calculations directly in render without a local reason;
   - no premature `memo`, `useMemo`, or `useCallback` added without evidence.
7. Recommend React Profiler only when there is visible lag, high-frequency UI,
   animation/gameplay, Auto mode, or suspicious state/update architecture.
8. Record evidence, gaps, and residual risks in the active task artifact.

## Evidence guidance

- Manual browser QA is valid evidence when in-agent browser, auth, or sandbox
  access is blocked, as long as the checked routes, viewport sizes, actions,
  and observations are recorded.
- Screenshot evidence is useful for layout, responsive, and shell overlap
  checks, but it is not required when manual evidence directly covers the risk.
- Render/performance evidence should be qualitative unless the user explicitly
  approves deeper profiling.

## Output format

- Pass / Needs changes
- Routes or screens checked
- Viewports checked
- Interaction states checked
- Layout and responsive findings
- Navigation/shell overlap findings
- UX findings
- Render/performance findings
- Evidence recorded in task artifact
- Residual risks

## Common mistakes

- Treating UI QA as automated test creation.
- Blocking completion on exact render counts.
- Adding profiler or browser automation without approval.
- Optimizing with memoization before a real risk is observed.
- Ignoring broad store/query subscriptions in visual components.
- Accepting screenshots that do not cover the changed state.
