Status: Partial
Owner: Frontend
Source of truth: src/app/api/profile, src/features/profile
Last verified: 2026-05-25
Related files: src/app/api/profile, src/features/profile

# Profile Module

Implemented:

- Browser profile calls use local `/api/profile/*` routes through
  `profileApi`.
- `GET /api/profile/me` proxies to backend `/api/v1/profile/me` with auth
  through `backendFetch`.
- `PATCH /api/profile/me` proxies nickname updates to backend
  `/api/v1/profile/me` with auth through `backendFetch`.
- `POST /api/profile/avatar` accepts avatar files through `profileApi`, sets
  the confirmed multipart field name `image`, and proxies the form data to
  backend `/api/v1/profile/avatar` with auth through `backendFetch`.
- Profile BFF routes apply refreshed or cleared auth cookies through shared
  auth cookie helpers.
- `useProfile` owns the `["profile", "me"]` query.
- `useUpdateProfile` updates the profile query cache from the returned profile.
- `useUploadAvatar` updates the profile query cache from the returned profile
  when the backend upload succeeds.

Known types:

- `ProfileResponse.balance` is a string and must remain a string.
- `ProfileResponse.avatarUrl` is `string | null`.
- `UpdateProfileDto` currently contains `nickname`.
- Avatar upload returns the profile shape when backend storage succeeds.

Partial:

- A protected `/profile` route skeleton exists for app-shell navigation.
- No Profile page UI is implemented in this foundation task.
- Avatar upload is transitional plumbing. Actual avatar persistence depends on
  backend avatar storage readiness; the frontend does not add mock storage,
  local persistence, base64 fallback, or frontend-only success behavior.

Unverified:

- Backend storage availability for avatar persistence.
- Backend error body consistency for profile endpoints.
