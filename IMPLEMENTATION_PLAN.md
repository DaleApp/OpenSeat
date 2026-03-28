# Plan: OpenSeat — Full Implementation for Hackathon

## Context
OpenSeat is a carpooling web app for closed communities (UNC Chapel Hill). The project has the base ready (types, Firebase, auth, mock data, Tailwind config) but all UI components (~35) and pages (~15) are missing. The goal is a functional demo on a phone.

**Folder structure:** All files use `src/app/` prefix (Next.js App Router with src directory).

---

## Phase 1: `feat/ui-primitives-and-layout` — Foundation
**Blocks everything else. Assigned to: Flor**

Files to create:
- `src/components/ui/icons.tsx` — ~12 inline SVG icons (home, search, plus, user, arrow-left, star, car, clock, calendar, map-pin, lock, check)
- `src/components/ui/Button.tsx` — variant (primary/secondary), size, loading state, optional href
- `src/components/ui/Input.tsx` — label, error message, optional icon
- `src/components/ui/Tag.tsx` — variant (default/success/warning), selectable/deselectable
- `src/components/ui/Avatar.tsx` — circular image with initials fallback
- `src/components/ui/Card.tsx` — wrapper with border and padding
- `src/components/ui/EmptyState.tsx` — title + subtitle + CTA button
- `src/components/ui/BottomNav.tsx` — 4 fixed tabs: **Home, Search, My Rides, Profile** (NOT "Publish"), usePathname() for active state, 64px height
- `src/components/ui/TopBar.tsx` — back arrow + title + optional right action
- `src/app/(auth)/layout.tsx` — centered, no nav, max-w-sm
- `src/app/(main)/layout.tsx` — TopBar + BottomNav + bottom padding

---

## Phase 2: `feat/auth-flow` — Working login
**Depends on:** Phase 1 | **Assigned to: Nico**

Files to create:
- `src/lib/firebase.ts` — Firebase config and initialization
- `src/lib/auth.ts` — auth functions (login, register, logout, domain validation)
- `src/lib/auth-context.tsx` — Context + Provider + useAuth() hook. Demo mode uses MOCK_USERS[0]
- `src/components/auth/LoginForm.tsx` — email + password, domain validation (@unc.edu / @email.unc.edu)
- `src/components/auth/RegisterForm.tsx` — email + password + confirm password
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/page.tsx` — **Welcome/splash screen** with OpenSeat logo, tagline, and "Get Started" button → redirects to login. Required for demo step 2.

Modify:
- `src/app/(main)/layout.tsx` — wrap with AuthProvider, redirect to /login if not authenticated

---

## Phase 3: `feat/home-page` — Main screen
**Depends on:** Phase 1, 2 | **Assigned to: Belu**

Files to create:
- `src/components/ride/RideCard.tsx` — driver photo, name, major, rating, origin→destination, time, seats, vibe tag, social hint
- `src/components/events/EventCard.tsx` — event name, date, time, location, interested count
- `src/app/(main)/home/page.tsx` — personalized greeting, "Offer ride" + "Find ride" buttons (NOT in BottomNav), nearby upcoming rides section, "Upcoming Events" section with 1-2 EventCards

---

## Phase 4: `feat/events` — Community events
**Depends on:** Phase 1, 3 | **Assigned to: Tomi**

Files to create:
- `src/components/events/EventRideList.tsx` — list of available rides for a specific event
- `src/app/(main)/events/page.tsx` — list of upcoming community events using EventCard
- `src/app/(main)/events/[id]/page.tsx` — event detail: event info + EventRideList + "Publish ride for this event" button (passes destination + eventName as URL params to /ride/new)

Modify:
- `src/lib/db.ts` — add `getEvents()` and `getEventById()` and `getRidesForEvent()`
- `src/lib/mock-data.ts` — add 3 hardcoded events (UNC vs Duke Basketball, CS Alumni Networking Night, Spring Concert)

---

## Phase 5: `feat/ride-search` — Search rides
**Depends on:** Phase 1, 3 (uses RideCard) | **Assigned to: Belu**

Files to create:
- `src/components/ride/SearchFilters.tsx` — destination input, date, time range, vibe filter
- `src/components/social/SocialHint.tsx` — "You both study CS and like basketball" shown inside RideCard in results
- `src/app/(main)/ride/search/page.tsx` — filters + list of RideCards with SocialHint embedded

Modify:
- `src/lib/db.ts` — improve filters in `searchRides()`, add proximity sorting (simple lat/lng distance formula, NOT Directions API)

---

## Phase 6: `feat/ride-detail-and-request` — Detail and request
**Depends on:** Phase 1, 3 | **Assigned to: Nico + Tomi**

Files to create:
- `src/components/ride/RideDetail.tsx` — full ride info (driver card, time, seats, vibe, pickup model, note)
- `src/lib/maps.ts` — Google Maps functions: map initialization, address autocomplete, meeting point pin calculation (simple: midpoint between passenger address and driver origin). All map logic lives here (NOT in lib/places.ts).
- `src/components/ride/RideMap.tsx` — Google Maps with 3 pins: origin, destination, suggested meeting point. Fallback to static placeholder if no API key.
- `src/components/ride/PickupSelector.tsx` — **Reusable in both ride request and publish forms.** Shows 2 options: "Fixed point" / "Flexible point". When flexible is selected, shows radius selector: 1, 2, 5, 10 miles.
- `src/components/ride/PassengerList.tsx` — passenger cards with accept/reject for driver
- `src/components/ride/RideRequest.tsx` — modal/screen to request ride. Includes passenger pickup preference selector ("Pick me up" / "I'll go to you" / "Flexible"). Checks pickup compatibility before showing "Request" button. If incompatible, shows explanation message.
- `src/app/(main)/ride/[id]/page.tsx`

Modify:
- `src/lib/db.ts` — add `requestRide()` and `respondToRequest()` and `completeRide()`

---

## Phase 7: `feat/publish-ride` — Publish ride
**Depends on:** Phase 1, 6 (uses RideMap, PickupSelector, AddressInput) | **Assigned to: Belu + Flor**

Files to create:
- `src/components/ride/AddressInput.tsx` — input with Google Places API autocomplete. Reusable component used in both RideForm and ProfileForm. Uses lib/maps.ts internally.
- `src/components/ride/VibeSelector.tsx` — toggle pills for vibe: music lover / chatty / chill / study mode / podcast / sing-along. Used in both RideForm and ProfileForm.
- `src/components/ride/SeatSelector.tsx` — selector for 1-6 seats (stepper or pill buttons)
- `src/components/ride/RideForm.tsx` — full ride form using all components above. Fields:
  - Origin (AddressInput, required)
  - Destination (AddressInput, required)
  - Departure time range: start time + end time (required)
  - Seats: 1-6 via SeatSelector (required)
  - Event name (optional text input, pre-filled if coming from event page)
  - Pickup model via PickupSelector (fixed/flexible + radius if flexible)
  - Note (optional)
- `src/app/(main)/ride/new/page.tsx` — checks if user has car data first (redirect to CarForm if not). Reads URL params `?destination=...&eventName=...` to pre-fill fields when coming from event page.

Modify:
- `src/lib/db.ts` — add `createRide()`

---

## Phase 8: `feat/profile-and-social` — Profile and rating
**Depends on:** Phase 1, 2 | **Assigned to: Flor**

Files to create:
- `src/components/auth/ProfileForm.tsx` — full profile form with all User fields:
  - Full name (open text, required)
  - Photo (image upload to Firebase Storage, required)
  - Email (email input, required, read-only after register)
  - Address (AddressInput with Google Maps validation, required)
  - Major (dropdown with all UNC majors + Other, required)
  - Status (dropdown: Student / Professor / Staff / Other, required)
  - Interests (Tag multi-select, optional)
  - Vibe (VibeSelector radio buttons, optional)
  - Clubs (Tag multi-select with UNC club options, optional)
- `src/components/auth/CarForm.tsx` — driver setup form with all User.car fields:
  - Driver's license (photo upload to Firebase Storage, required)
  - Brand (open text, required)
  - Model (open text, required)
  - Color (open text, required)
  - License plate (open text, required)
- `src/components/social/StatsCard.tsx` — individual stat (miles driven, CO2 saved in kg, people connected, total rides). CO2 must be visually highlighted.
- `src/components/social/BadgeCard.tsx` — badge with icon, name, description. Locked state: grayed out with lock icon overlay.
- `src/components/social/BadgeGrid.tsx` — grid of ALL badges. Unlocked = full color. Locked = gray with lock icon. Visually shows progress.
- `src/components/social/RatingForm.tsx` — stars 1-5 + GoodVibesSlider + "Connect with [name]?" toggle
- `src/components/social/GoodVibesSlider.tsx` — emoji slider 😐😊😄🤩 mapping to 1-5
- `src/components/social/ConnectionCard.tsx` — avatar + name + major
- `src/components/social/ConnectionsList.tsx` — list of ConnectionCards for all connections
- `src/app/(main)/profile/page.tsx` — my profile: StatsCard row (CO2 highlighted), BadgeGrid, ConnectionsList, edit button, car data section
- `src/app/(main)/profile/[id]/page.tsx` — other user's profile (read-only)
- `src/app/(main)/ride/[id]/rate/page.tsx` — post-ride: RatingForm. After submit, if badge "Icebreaker" conditions met → show badge unlock animation before redirecting to profile.

Modify:
- `src/lib/db.ts` — add `updateUser()`, `addRating()`, `getConnections()`

---

## Demo-specific features

These must work for the Sunday demo flow (13 steps):

- **Welcome/splash screen** → handled in Phase 2 (`src/app/page.tsx`)
- **User switch in demo mode** → A floating button visible only when `NEXT_PUBLIC_DEMO_MODE=true`. Shows a dropdown to switch between MOCK_USERS without logging out. Add to `src/app/(main)/layout.tsx`.
- **Badge unlock animation** → After rating screen, if "Icebreaker" badge conditions met, show a full-screen animation (simple CSS transition with the badge icon + "Badge Unlocked!" text) before redirecting. Add to the rate page.

---

## Parallel work (4 people)

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 5
(Flor)      (Nico)      (Belu)      (Belu)
               │            │
               │            └──► Phase 4 (Tomi)
               │
               └──► Phase 8 (Flor)
                         │
Phase 6 (Nico+Tomi) ◄───┘
     │
     └──► Phase 7 (Belu+Flor)
```

| Hour | Who | What |
|------|-----|-------|
| 0–2 | Flor | Phase 1: all UI primitives + BottomNav + layout |
| 0–2 | Nico | Phase 2: Firebase setup, auth, welcome screen |
| 0–2 | Tomi | lib/mock-data.ts with full data (FIRST TASK — unblocks Belu and Flor) |
| 0–2 | Belu | Review CONTEXT.md, set up branches, prepare page structure |
| 2–5 | Belu | Phase 3: RideCard + EventCard + home page |
| 2–5 | Tomi | Phase 4: events pages + db functions for events |
| 2–5 | Flor | Phase 8: ProfileForm + CarForm + BadgeGrid + social components |
| 5–8 | Belu | Phase 5: SearchFilters + SocialHint + search page |
| 5–8 | Nico + Tomi | Phase 6: RideMap + PickupSelector + RideRequest + ride detail page |
| 8–12 | Belu + Flor | Phase 7: AddressInput + VibeSelector + SeatSelector + RideForm + publish page |
| 8–12 | Nico + Tomi | Connect Firestore real data, fix bugs, end-to-end flow |
| 12–16 | All | Polish, demo prep, slides, seed data final verification |
| 16+ | All | Practice demo 3 times with timer. No new features after this point. |

---

## Key decisions

- **Demo mode:** env var `NEXT_PUBLIC_DEMO_MODE=true` bypasses Firebase auth and uses mock data. Also shows user switch dropdown.
- **No icon library:** one `icons.tsx` file with inline SVGs only.
- **Mutable mock data in memory:** changes persist until reload (enough for demo).
- **Google Maps graceful fallback:** if no API key, show static placeholder map in RideMap.
- **Mobile-first:** all designed for 375px, horizontal padding `px-4`.
- **lib/maps.ts is the single source for map logic:** do NOT create lib/places.ts. AddressInput uses lib/maps.ts internally.
- **Distances in miles:** users input and see miles. Internal calculation uses km (miles × 1.609). CO2 formula uses km.
- **PickupSelector is reusable:** same component used in RideForm (driver) and RideRequest (passenger). Driver mode shows radius selector when flexible. Passenger mode shows pickup preference (pick me up / I'll go to you / flexible).
- **src/ prefix:** all files use src/app/ and src/components/ — consistent with Next.js src directory setup.

---

## Verification checklist

- [ ] `npm run dev` — app loads at localhost:3000
- [ ] Welcome screen shows with OpenSeat logo
- [ ] Login with @unc.edu email works (demo mode or Firebase)
- [ ] Profile shows all fields: name, photo, major, address, vibe, clubs, interests
- [ ] Home shows "Offer ride" + "Find ride" buttons + upcoming events
- [ ] Search returns rides with SocialHints
- [ ] Ride detail shows map with 3 pins (origin, destination, meeting point)
- [ ] Pickup compatibility check works before showing Request button
- [ ] Publish ride form pre-fills destination when coming from event page
- [ ] Post-ride rating shows badge unlock animation
- [ ] Profile shows BadgeGrid (unlocked + locked badges), CO2 highlighted, ConnectionsList
- [ ] User switch works in demo mode
- [ ] Full demo flow (13 steps) runs without errors on mobile viewport (375px)
- [ ] App works without Firebase or Google Maps API key (demo mode)
