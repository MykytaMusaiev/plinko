# State Ownership

Status: Accepted

## Context

The frontend has both server-derived data and local interaction state. Current
code uses TanStack Query, Zustand, and local component state. Auth tokens are
owned by httpOnly cookies and must not be stored in browser state.

Manual gameplay depends on backend bet results, including `path`,
`bucketIndex`, and `balanceAfter`.

## Decision

Use TanStack Query for server state and server interactions:

- Game config is loaded with `useQuery`.
- Login, register, and bet placement use `useMutation`.
- Browser mutations call local BFF API wrappers.

Use Zustand for UI/session/client state:

- Auth store owns `user` and hydration state only.
- Game store owns selected mode, playing state, recent results, last result,
  winning bucket, bet amount, risk, and selected rows.
- Auth store must never own `accessToken` or `refreshToken`.

Avoid duplicated derived state where practical. Use backend response fields as
the source of truth for result-driven UI:

- Balance updates use backend `balanceAfter`.
- Ball animation uses backend `path`.
- Winning bucket highlight uses backend `bucketIndex`.

## Alternatives considered

- Store all server data in Zustand.
- Store auth tokens in Zustand.
- Derive balance optimistically from bet amount and multiplier.
- Recompute ball path client-side for normal gameplay.

## Trade-offs

- TanStack Query keeps fetch/mutation lifecycle state close to server
  interactions.
- Zustand keeps UI state simple and accessible across game components.
- Using backend result fields avoids client/backend drift for balance and game
  outcomes.
- Some short-lived animation state remains local to components, which keeps the
  global store smaller.

## Consequences

- New server-derived reads should prefer TanStack Query.
- New cross-component UI state may use Zustand when component state is not
  enough.
- Auth-related browser state must remain token-free.
- Follow-up: keep checking new state additions for duplication with backend
  responses or existing derived values.

## Related files

- `src/app/providers.tsx`
- `src/features/auth/model/auth.store.ts`
- `src/features/auth/model/useLogin.ts`
- `src/features/auth/model/useRegister.ts`
- `src/features/game/model/game.store.ts`
- `src/features/game/model/useGameConfig.ts`
- `src/features/game/model/usePlaceBet.ts`
- `src/features/game/ui/GameBoard.tsx`
- `src/features/game/ui/PegGrid.tsx`

## Validation

Verified from current code on 2026-05-20:

- `QueryClientProvider` is configured in `src/app/providers.tsx`.
- `useGameConfig` uses `useQuery`.
- Auth and bet actions use `useMutation`.
- Auth store contains `user` and `isHydrated`, not tokens.
- `GameBoard` updates displayed balance from `result.balanceAfter`.
- `PegGrid` animates using `lastResult.path`.
