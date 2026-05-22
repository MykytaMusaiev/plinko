# Refactor BetTable

## Scope

Refactor `src/features/history/ui/BetTable.tsx` into a small container for the
history bets list/table area while preserving existing behavior.

## Planned split

- Keep query wiring, local filters, filter coordination, view-model preparation,
  callbacks, and render-state branching in `BetTable.tsx`.
- Move history-specific constants, parsers, formatting, filtering, payout tone,
  and row view-model construction to `src/features/history/model`.
- Move filter controls, mobile list/card rendering, desktop table rendering,
  risk badge markup, and simple render states to feature-local UI files.

## Docs not needed rationale

This refactor changes internal history feature ownership and component
structure only. Documented history behavior remains unchanged: rows filtering
stays backend-backed, risk filtering stays client-side, pagination remains
unimplemented, and no drawer or API behavior is added.

## Final split

- `BetTable.tsx` owns query wiring, local filter state, parsing callbacks,
  risk-filter coordination, row view-model preparation, retry wiring, and
  high-level render-state branching.
- `model/betHistory.model.ts` owns history-specific constants, filter types,
  formatting helpers, risk filtering, select value parsing, payout tone logic,
  and the bet row view model.
- `ui/BetHistoryFilters.tsx` owns the filter panel markup.
- `ui/BetHistoryViews.tsx` owns mobile list/card and desktop table rendering.
- `ui/BetHistoryStates.tsx` owns loading, error, and empty states.

## Validation

- `pnpm lint`: passed.
- `pnpm build`: passed.
- `C:\Program Files\Git\usr\bin\bash.exe -lc './scripts/check-docs-freshness.sh'`:
  passed with docs-not-needed rationale.
- `git diff --check`: passed.

