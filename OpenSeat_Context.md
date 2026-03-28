# OpenSeat — Master Context Document

> **What this document is:** The single source of truth for the project. Contains every decision made, the hackathon scope, tech stack, data schema, screens, components, business logic, and demo structure. The entire team (Nico, Tomi, Belu, Flor) and any AI tool (Claude Code, Cursor, Copilot) must read this before writing a single line of code.

> **Last updated:** March 2026

---

## 1. What is OpenSeat

OpenSeat is a responsive (mobile-first) web app for carpooling exclusive to closed communities (universities, clubs, companies). It connects verified members to share rides with a focus on building social connections — not just saving costs.

**Name:** OpenSeat
**Tagline:** "Your open seat is waiting"
**Concept:** An empty seat in someone's car from your community — you open it for someone else — you meet.

---

## 2. Hackathon context

- **Format:** 1-day hackathon (full Saturday + night)
- **Demo:** Sunday morning, from a phone showing the web app
- **Presentation:** One person talks and shows the app on their phone simultaneously
- **Team:** 4 people — Nico (backend/infra), Tomi (data/Firestore), Belu (UI/pages), Flor (design/visual)
- **Platform:** Responsive mobile-first web app (NOT a native app)
- **Stack:** Next.js 14 + Tailwind CSS + TypeScript + Firebase + Google Maps

---

## 3. Hackathon scope

### Philosophy: PERFECT DEMO > many features
One complete flow that works flawlessly and looks good wins hackathons. Not the number of features. Everything that gets built must work in the demo without breaking.

### WHAT GETS BUILT (must work in the demo):

1. **Simple login with domain validation** — User enters email + password. Frontend validates the domain is allowed (e.g., @unc.edu). No real email verification (added post-hackathon). For the demo, pre-seeded users are used.
2. **User profile** — All fields defined in section 6 (`User` schema). Includes profile info, vibe preference, clubs, and optional car data for drivers.
3. **Publish ride (driver)** — All fields defined in section 6 (`Ride` schema). Origin/destination with autocomplete, departure time range, seats (1-6), event name (optional), pickup model, note.
4. **Search ride (passenger)** — Search by destination + time, results with cards showing driver profile + social hints + route on map with meeting point pin
5. **Request ride** — Any user can request to join a ride published by another. The user who published receives the request and can accept or reject. No fixed roles: the same user can publish a ride and also request to join someone else's ride.
6. **Post-ride** — Mutual rating (1-5 stars), "good vibes" score with emoji slider, option to "connect" with the other person, stats (km shared, CO2 saved)
7. **Visual badges** — Shown on profile. For the hackathon they are hardcoded in seed data (automatic unlock logic added post-hackathon)
8. **Home** — Personalized greeting, "Offer ride" / "Find ride" buttons, nearby upcoming rides, upcoming events section with EventCards, bottom nav
9. **Social profile** — Stats, unlocked badges (BadgeGrid with locked badges in gray), connections list, average rating
10. **Community events** — Section listing upcoming organization events (e.g., basketball game, alumni talk, concert). Each event has date, time, and location. When entering an event, the user can see: (a) published rides heading to that destination at that time, and (b) other members interested in going. From there they can join an existing ride or publish a new one with the event destination pre-loaded.

### WHAT DOES NOT GET BUILT (goes in slides as "next steps"):

- Real email verification with code (post-hackathon)
- In-app chat (coordination happens outside during hackathon)
- Real push notifications
- Automatic meeting point calculation with routing API
- Venmo / Zelle integration (mentioned as future)
- Admin web panel
- Recurring rides
- Community feed
- Real-time location sharing during ride
- Automatic badge logic (post-hackathon, shown hardcoded)
- Multi-tenant organizations collection (post-hackathon)

---

## 4. User model

A user does NOT have a fixed role. The same user can:
- Sometimes be a **driver** (offers ride, has car)
- Sometimes be a **passenger** (searches for ride, not driving that day)

Car data is entered once in the profile and saved. When the user enters the home screen, they see both buttons: "Offer ride" and "Find ride".

### Profile fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full name | Open text | Yes | |
| Photo | Image upload | Yes | Profile picture (uploaded to Firebase Storage) |
| Email | Email input | Yes | Must be @unc.edu or @email.unc.edu |
| Address | Google Maps autocomplete | Yes | Home address for proximity matching |
| Major | Dropdown | Yes | All UNC majors + "Other" |
| Status | Dropdown | Yes | Student, Professor, Staff, Other |
| Interests | Tags (multi-select) | No | Free-form tags |
| Vibe | Radio button | No | Music lover, Chatty, Chill, Study mode, Podcast listener, Sing-along |
| Clubs | Tags (multi-select) | No | Pre-defined UNC clubs |

#### UNC Majors (dropdown options)
Biology, Business Administration, Chemistry, Communications, Computer Science, Economics, English, Environmental Sciences, Exercise and Sport Science, History, Information Science, Journalism, Mathematics, Nursing, Philosophy, Physics, Political Science, Psychology, Public Policy, Sociology, Statistics, Other

#### UNC Clubs (tag options)
Tar Heel Esports, Carolina Club Running, UNC Surf Club, Debate Society, Entrepreneurship Club, Photography Club, Carolina for the Kids, UNC Club Soccer, Habitat for Humanity, Carolina Outdoors, Film Club, Women in CS, Club Swimming, Intramural Sports, Music Makers, Volunteer Corps

#### Vibe options (radio button)
- Music lover — "I've got the playlist ready"
- Chatty — "Let's talk about anything"
- Chill — "Relaxed vibes, no pressure"
- Study mode — "Quiet ride, I need to focus"
- Podcast listener — "Let's discover something new"
- Sing-along — "Carpool karaoke, let's go"

### Driver setup fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Driver's license | Photo upload | Yes | Image of valid license |
| Brand | Open text | Yes | e.g., "Toyota" |
| Model | Open text | Yes | e.g., "Corolla" |
| Color | Open text | Yes | e.g., "Gray" |
| License plate | Open text | Yes | e.g., "ABC-1234" |

---

## 5. Tech stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSR, routing, React |
| Styles | Tailwind CSS | Utility-first CSS, mobile-first |
| Language | TypeScript (strict mode) | Types everywhere, fewer bugs |
| Auth | Firebase Authentication | Registration, login (email + password) |
| Database | Cloud Firestore | NoSQL, real-time listeners |
| Storage | Firebase Storage | Profile photos, driver's license photos |
| Maps | Google Maps JavaScript API | Maps, routes, pins |
| Geocoding | Google Places API | Address autocomplete |
| Hosting | Vercel | Automatic deploy from GitHub |
| Repo | GitHub (DaleApp org) | Version control, PRs |

### Google Cloud prerequisite
Google Maps requires billing enabled (credit card). The free tier gives $200/month which more than covers the hackathon and later development. Configure BEFORE the hackathon:
1. Create project in Google Cloud Console
2. Enable Maps JavaScript API + Places API
3. Create restricted API key (by domain: localhost + Vercel domain)
4. Store in Bitwarden

### Why simple auth instead of email verification
- Firebase email verification can fail during demo (emails not arriving, spam folder, institutional domains blocking)
- For the hackathon: login with email + password, domain validation on frontend
- Pre-seeded users for the demo — the flow always looks perfect
- **Post-hackathon:** Add real verification with email code

**Hackathon costs:** $0 (everything is free tier or free)

---

## 5.1 GitHub — Organization and repository setup

> Full setup instructions (org creation, branch protection, git workflow, access table, secrets) are in **[GITHUB_SETUP.md](GITHUB_SETUP.md)**.
>
> **Key facts:** Org `DaleApp`, repo `OpenSeat`, branch protection on `main` (1 approval required), secrets via Bitwarden.

---

## 6. Firestore schema

### Strategy: start simple, grow later
For the hackathon a simplified schema is used. No `organizations` collection (UNC is hardcoded). Ratings are embedded in the ride. Badges are static seed data. Post-hackathon it scales to the full schema.

### Collection: `users`
```typescript
interface User {
  id: string;                    // Firebase Auth UID
  email: string;                 // must be @unc.edu or @email.unc.edu
  name: string;                  // full name
  photoUrl?: string;
  address: {                     // home address, Google Maps validated (required)
    address: string;
    lat: number;
    lng: number;
  };
  major: string;                 // "Computer Science", "Business Administration", etc.
  status: 'student' | 'professor' | 'staff' | 'other';
  interests: string[];           // ["basketball", "fintech", "music"]
  vibe: string;                  // "music_lover", "chatty", "chill", "study_mode", "podcast_listener", "sing_along"
  clubs: string[];               // ["Tar Heel Esports", "UNC Club Soccer"]

  // Car data (optional, loaded if they ever drive)
  car?: {
    driversLicenseUrl: string;   // photo of driver's license (Firebase Storage)
    brand: string;               // "Toyota"
    model: string;               // "Corolla"
    color: string;               // "Gray"
    licensePlate: string;        // "ABC-1234"
  };

  // Stats (stored in metric internally; UI converts to miles for display)
  stats: {
    totalRides: number;
    totalKm: number;             // stored in km, displayed as miles (km * 0.621)
    co2Saved: number;            // in kg
    peopleConnected: number;
    averageRating: number;       // 1-5
    averageGoodVibes: number;    // 1-5
    totalRatings: number;
  };

  // Unlocked badges (hardcoded in seed for hackathon)
  badges: Badge[];

  // Connections (user IDs of people they chose to "connect" with)
  connections: string[];

  createdAt: Timestamp;
}

interface Badge {
  id: string;                    // "icebreaker", "punctual", "eco-hero"
  name: string;                  // "Icebreaker"
  description: string;           // "First ride with someone new"
  icon: string;                  // emoji or icon
  unlockedAt: Timestamp;
}
```

### Collection: `rides`
```typescript
interface Ride {
  id: string;
  driverId: string;
  driverName: string;            // denormalized
  driverPhotoUrl?: string;       // denormalized
  driverMajor: string;           // denormalized
  driverRating: number;          // denormalized
  driverVibe: string;            // denormalized from user profile
  driverCar: {                   // denormalized
    brand: string;
    model: string;
    color: string;
    licensePlate: string;
  };

  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };

  departureTimeStart: string;    // "2026-04-05T08:00" (ISO datetime)
  departureTimeEnd: string;      // "2026-04-05T08:30" (ISO datetime, end of range)

  totalSeats: number;            // 1-6
  availableSeats: number;

  pickupFlexibility: 'fixed' | 'flexible';
  flexibleRadiusMi?: number;     // 1, 2, 5, or 10 (in miles, displayed as miles)

  meetingPoint?: {
    address: string;
    lat: number;
    lng: number;
  };

  eventId?: string;              // links to CommunityEvent.id (set when ride is created from event page)
  eventName?: string;            // denormalized event name, or custom text if typed manually

  note?: string;

  status: 'active' | 'full' | 'in_progress' | 'completed' | 'cancelled';

  passengers: RidePassenger[];

  // Embedded ratings (simplified for hackathon)
  ratings: EmbeddedRating[];

  createdAt: Timestamp;
}

interface RidePassenger {
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  userMajor: string;
  status: 'pending' | 'accepted' | 'rejected';
  pickupPreference: 'pickup_me' | 'i_go_to_you' | 'flexible';
  requestedAt: Timestamp;
  respondedAt?: Timestamp;
}

interface EmbeddedRating {
  fromUserId: string;
  toUserId: string;
  stars: number;                 // 1-5
  goodVibes: number;             // 1-5
  wantsToConnect: boolean;
  createdAt: Timestamp;
}
```

### Collection: `events`
```typescript
interface CommunityEvent {
  id: string;
  name: string;                  // "UNC vs Duke Basketball"
  description?: string;
  date: string;                  // "2026-04-05"
  time: string;                  // "19:00"
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  interestedUsers: string[];     // user IDs
  imageUrl?: string;
  createdAt: Timestamp;
}
```

### Post-hackathon: expanded schema
- Add `organizations` collection with `allowedDomains`, `verificationMethod`, etc.
- Move ratings to separate `ratings` collection with dimensions (punctuality, driving)
- Add automatic badge logic
- Add `organizationId` field to users

---

## 7. Pages and routes (Next.js App Router)

```
src/app/
├── (auth)/
│   ├── layout.tsx                  → Centered, no nav, max-w-sm
│   ├── login/page.tsx              → Login with email + password
│   └── register/page.tsx           → Register: email (validate domain) → password → profile
│
├── (main)/
│   ├── layout.tsx                  → TopBar + BottomNav + padding bottom
│   ├── home/page.tsx               → Home: greeting, 2 buttons, nearby rides, upcoming events
│   ├── ride/
│   │   ├── new/page.tsx            → Offer ride (full form, pre-loads destination if from event)
│   │   ├── search/page.tsx         → Search ride (search + results with SocialHints)
│   │   └── [id]/page.tsx           → Ride detail (map, driver info, request button)
│   ├── ride/[id]/rate/page.tsx     → Post-ride: rating + good vibes + connect
│   ├── events/page.tsx             → List of upcoming community events
│   ├── events/[id]/page.tsx        → Event detail: rides available + publish ride for event
│   ├── profile/page.tsx            → My profile: stats, badges, connections, car data
│   └── profile/[id]/page.tsx       → Other user's profile
│
├── layout.tsx                      → Root layout
└── globals.css                     → Tailwind imports + custom CSS
```

---

## 8. Main components

### Layout
- `BottomNav` — Bottom mobile navigation: Home, Search, Publish, Profile (4 tabs, 64px height)
- `TopBar` — Top bar with OpenSeat logo + user avatar

### Auth
- `ProfileForm` — Profile form with all `User` fields from section 6 schema
- `VibeSelector` — Radio buttons for vibe preference: music lover / chatty / chill / study mode / podcast / sing-along (used in ProfileForm)
- `CarForm` — Car data form with all `User.car` fields from section 6 schema

### Ride
- `RideForm` — Form to offer a ride with all `Ride` fields from section 6 schema
- `RideCard` — Search result card (driver photo, major, rating, time, seats, driver's vibe from profile, social hints)
- `RideDetail` — Full ride view with map, driver info, request button
- `RideMap` — Google Maps with pins for origin, destination, and meeting point
- `AddressInput` — Input with Google Places API autocomplete
- `PickupSelector` — 2 options: fixed point / flexible point. If "flexible", shows radius selector: 1, 2, 5, 10 miles
- `SeatSelector` — Selector for 1-6 seats
- `PassengerRequest` — Pending request card (for driver: accept/reject)

### Events
- `EventCard` — Event card (name, date, location, interested count)
- `EventRideList` — List of available rides for a specific event

### Social
- `RatingForm` — Stars + good vibes slider + connect button
- `GoodVibesSlider` — Slider with emojis (😐 → 🤩)
- `BadgeCard` — Individual badge with icon, name, description
- `BadgeGrid` — Grid of all badges (unlocked + locked in gray)
- `StatsCard` — Individual stat card (miles, CO2, people, rides)
- `ConnectionsList` — List of people you've connected with
- `SocialHint` — "You both study CS and like basketball" (in search results)

### UI (reusable)
- `Button` — Primary (teal) and secondary (outline) button
- `Input` — Input with label and error
- `Tag` — Interest pill (selectable/deselectable)
- `Avatar` — Circular profile photo with initials fallback
- `Card` — Container with border and padding
- `EmptyState` — Message when no results

---

## 9. Business logic

### Auth (simplified for hackathon)
```
1. User enters email + password
2. Frontend extracts email domain (e.g., "unc.edu" or "email.unc.edu")
3. Checks if domain is in hardcoded list: ["unc.edu", "email.unc.edu"]
4. If yes → creates account in Firebase Auth (email + password)
5. If no → shows error "This email doesn't belong to UNC"
6. Redirects to complete profile
7. For the demo: pre-seeded users, they log in directly
```

**Post-hackathon:** Add real verification with email code, `organizations` collection with configurable domains per org.

### Publish ride
```
1. If no car data loaded → redirects to CarForm first (check BEFORE showing form)
2. Driver enters origin (AddressInput with Google Places autocomplete)
3. Enters destination (AddressInput with Google Places autocomplete)
4. Selects departure time range (start and end time)
5. Selects available seats (1-6) via SeatSelector
6. Optionally enters event name (pre-loaded if coming from event page)
7. Selects pickup model:
   - "Fixed point" → no further input
   - "Flexible point" → radius selector appears: 1, 2, 5, 10 miles
     (saved in flexibleRadiusMi)
8. Optional note
9. Publishes → creates doc in Firestore with status "active"
```

### Search ride
```
1. Passenger enters destination + date + approximate time
2. Query Firestore: rides where date matches, status = "active", availableSeats > 0
3. Filter/sort on frontend by geographic proximity (simple distance calculation)
4. Show results as cards with:
   - Photo, name, major, rating of driver
   - Time, available seats
   - Pickup flexibility (badge: "Fixed" or "Flexible")
   - Vibe tag
   - Social hint (shared interests, same major, same club)
5. Tapping a card → ride detail with map
```

### Request ride
```
1. Passenger sees ride detail with map and route
2. Selects pickup preference: "pick me up" / "I'll go to you" / "flexible"
3. System checks pickup compatibility between driver and passenger preferences
4. If compatible → taps "Request ride"
5. If not compatible → shows message explaining why
6. Gets added as passenger in the ride doc with status "pending"
7. Driver sees the request on their screen
8. Driver accepts → status changes to "accepted", availableSeats decrements
9. Driver rejects → status changes to "rejected"
```

### Post-ride (rating)
```
1. When the driver marks the ride as "completed"
2. Each participant sees rating screen:
   a. Stars (1-5)
   b. "How were the vibes?" → emoji slider (😐😊😄🤩) = 1-5
   c. "Connect with [name]?" → Yes / Not now
3. Saved embedded in the ride (ratings array)
4. Updates the rated user's stats (averageRating, averageGoodVibes)
5. If both chose "connect" → they are mutually added to connections
6. If badge "Icebreaker" conditions met → show badge unlock animation
```

### Badges (hardcoded for hackathon)
```
For the demo, badges are loaded in the seed data.
Available badges:
- "Icebreaker": First ride with someone new
- "Punctual": Always on time
- "Eco-hero": Saved more than 50 kg CO2
- "Explorer": Rode with people from 5 different majors
- "Community": Connected with 20+ people

Post-hackathon: automatic logic that checks after each completed ride.

Display: BadgeGrid shows ALL badges. Unlocked ones are full color.
Locked ones appear grayed out with a lock icon — visually impressive.
```

### CO2 saved calculation
```
Simplified formula (internal calculation in km):
co2Saved = distanceKm * 0.21 (kg CO2 per km average for a car)

If 2 people share a 10-mile (16 km) ride:
- Without carpooling: 2 cars × 16km × 0.21 = 6.72 kg CO2
- With carpooling: 1 car × 16km × 0.21 = 3.36 kg CO2
- Savings per person: 3.36 / 2 = 1.68 kg CO2

Note: Users input/see distances in miles. Convert to km internally
(miles * 1.609 = km). Display distances back in miles.
```

### Social hints (shared interests)
```
When showing search results:
1. Compare interests[] of passenger with interests[] of driver
2. Compare major of passenger with major of driver
3. Compare clubs[] of passenger with clubs[] of driver
4. If match → show "You both study [major] and like [interest]"
   or "You're both in [club]"
5. If no match → show only basic info
```

### Events
```
1. Home page shows "Upcoming Events" section with 1-2 EventCards
2. Events page lists all upcoming community events
3. Event detail page shows:
   a. Event info (name, date, time, location)
   b. Rides heading to that destination around that time
   c. Other members interested in going
   d. "Publish ride for this event" button (pre-loads destination + event name)
4. When publishing a ride from an event page, destination and eventName are pre-filled
```

---

## 10. Design system

### Colors
```css
--brand-primary: #0D9488;        /* Teal - main color */
--brand-primary-light: #E1F5EE;  /* Light teal - backgrounds */
--brand-primary-dark: #085041;   /* Dark teal - text on light teal */

--text-primary: #1E293B;         /* Primary text */
--text-secondary: #64748B;       /* Secondary text */
--text-tertiary: #94A3B8;        /* Hint/placeholder text */

--bg-primary: #FFFFFF;           /* Main background */
--bg-secondary: #F1F5F9;         /* Cards/sections background */

--border: #E2E8F0;               /* Borders */
--border-focus: #0D9488;         /* Focus borders */

--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
```

### Typography
```
Font: Inter (Google Fonts) or system fonts
Titles: 18-24px, font-weight: 600
Subtitles: 14-16px, font-weight: 500
Body: 14px, font-weight: 400
Caption: 12px, font-weight: 400
Tags/badges: 10-11px, font-weight: 500
```

### Key components
```
Border radius: 8px (inputs), 12px (cards), 20px (pill buttons), 50% (avatars)
Card padding: 12-16px
Element gap: 8-12px
Bottom nav height: 64px
Safe area bottom: 16px (for iPhones with notch)
```

### Mobile-first breakpoints
```css
/* Default: mobile (< 640px) — DESIGN FOR THIS FIRST */
/* sm: 640px+ (tablet) */
/* md: 768px+ (tablet landscape) */
/* lg: 1024px+ (desktop) — nice to have, not priority */
```

---

## 11. Mock data strategy

### Why mock data from minute 1
So that Belu and Flor can work on UI without waiting for Firestore to be connected, Tomi starts by creating `src/lib/mock-data.ts` with all the demo data. Functions in `src/lib/db.ts` start by returning mock data and later switch to real queries internally. Same interface, different implementation.

### `src/lib/mock-data.ts`
```typescript
// Example users
export const MOCK_USERS: User[] = [
  {
    id: "user1",
    email: "nico@unc.edu",
    name: "Nico Garcia",
    photoUrl: "/avatars/nico.jpg",
    major: "Business Administration",
    status: "student",
    address: { address: "123 Franklin St, Chapel Hill, NC", lat: 35.9132, lng: -79.0558 },
    interests: ["fintech", "basketball", "entrepreneurship"],
    vibe: "chatty",
    clubs: ["Entrepreneurship Club", "Intramural Sports"],
    car: { driversLicenseUrl: "/licenses/nico.jpg", brand: "Toyota", model: "Corolla", color: "Gray", licensePlate: "ABC-1234" },
    stats: { totalRides: 24, totalKm: 312, co2Saved: 65.5, peopleConnected: 8, averageRating: 4.8, averageGoodVibes: 4.6, totalRatings: 18 },
    badges: [
      { id: "icebreaker", name: "Icebreaker", description: "First ride with someone new", icon: "🧊", unlockedAt: new Date() },
      { id: "eco-hero", name: "Eco-hero", description: "Saved more than 50 kg CO2", icon: "🌱", unlockedAt: new Date() },
    ],
    connections: ["user2", "user3"],
    createdAt: new Date()
  },
  // ... Tomi, Belu, Flor, Demo user, Demo user 2
];

// Example rides
export const MOCK_RIDES: Ride[] = [
  // Nico: Franklin St → UNC Campus, Mon 8:00-8:30, 3 seats, flexible, chatty
  // Tomi: Carrboro → UNC Campus, Mon 9:00-9:15, 2 seats, fixed, chill
  // Demo2: Durham → UNC Campus, Mon 8:00-8:30, 3 seats, flexible, study mode
];

// Example events
export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: "event1",
    name: "UNC vs Duke Basketball",
    description: "The rivalry game of the year",
    date: "2026-04-10",
    time: "19:00",
    location: { address: "Dean E. Smith Center, Chapel Hill, NC", lat: 35.9100, lng: -79.0478 },
    interestedUsers: ["user1", "user2", "user3"],
    createdAt: new Date()
  },
  {
    id: "event2",
    name: "CS Alumni Networking Night",
    description: "Meet alumni working in tech",
    date: "2026-04-12",
    time: "18:00",
    location: { address: "Sitterson Hall, UNC Campus", lat: 35.9105, lng: -79.0530 },
    interestedUsers: ["user1", "user4"],
    createdAt: new Date()
  },
  {
    id: "event3",
    name: "Spring Concert — Campus Green",
    description: "Live music on the quad",
    date: "2026-04-15",
    time: "16:00",
    location: { address: "Polk Place, UNC Campus", lat: 35.9119, lng: -79.0510 },
    interestedUsers: ["user2", "user3", "user5"],
    createdAt: new Date()
  }
];
```

### `src/lib/db.ts` — migration pattern
```typescript
// Phase 1 (hackathon): returns mock data
export async function getRides(filters: RideFilters): Promise<Ride[]> {
  return MOCK_RIDES.filter(/* basic filters */);
}

// Phase 2 (post-hackathon): same signature, real query
export async function getRides(filters: RideFilters): Promise<Ride[]> {
  const q = query(collection(db, 'rides'), where(...), orderBy(...));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
}
```

### Required `db.ts` functions
```typescript
// Users
getUserById(id: string): Promise<User | null>
updateUser(id: string, data: Partial<User>): Promise<void>
getConnections(userId: string): Promise<User[]>

// Rides
getRides(filters: RideFilters): Promise<Ride[]>
getRideById(id: string): Promise<Ride | null>
createRide(data: Omit<Ride, 'id' | 'createdAt'>): Promise<string>
requestRide(rideId: string, passenger: RidePassenger): Promise<void>
respondToRequest(rideId: string, passengerId: string, accept: boolean): Promise<void>
completeRide(rideId: string): Promise<void>
addRating(rideId: string, rating: EmbeddedRating): Promise<void>

// Events
getEvents(): Promise<CommunityEvent[]>
getEventById(id: string): Promise<CommunityEvent | null>
getRidesForEvent(eventId: string): Promise<Ride[]>  // queries rides where eventId matches
```

This unblocks the entire team from hour 1.

---

---

## 12. Demo structure (Sunday)

### Flow shown from the phone:
```
1. Open OpenSeat on Vercel from phone
2. Welcome screen with OpenSeat logo
3. Log in with seeded user (email @unc.edu + password)
4. See complete profile: name, photo, major, address, interests, vibe, clubs
5. Home: see available rides nearby + upcoming events
6. Offer ride: complete form with map
7. Switch to another user (pre-seeded) who is looking for a ride
8. Search ride: see results with cards and social hints
9. See ride detail with map and route
10. Request ride
11. Simulate completed ride → show rating + good vibes screen
12. Show "Icebreaker" badge unlocked (visual animation)
13. Show profile with stats (CO2 saved highlighted), BadgeGrid, and connections
```

### User switch mechanism for demo
A simple dropdown or button in dev/demo mode that lets you switch between pre-seeded users without logging out. Only visible when `NEXT_PUBLIC_DEMO_MODE=true`.

---

## 13. Code rules

### TypeScript strict mode
Everything has types. Never use `any`. Interfaces for all data models.

### File structure
- One component per file
- Components in PascalCase: `RideCard.tsx`
- Utilities in camelCase: `formatDate.ts`
- Folders in kebab-case: `ride-search/`
- All data logic in `src/lib/db.ts`
- All auth logic in `src/lib/auth.ts`
- All map logic in `src/lib/maps.ts`
- Mock data in `src/lib/mock-data.ts`
- Firebase config in `src/lib/firebase.ts`
- Types in `src/types/` (user.ts, ride.ts, event.ts, index.ts)
- Components in `src/components/`

### Git workflow
- Branch per feature: `feature/auth`, `feature/ride-form`, etc.
- Commits with prefix: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`
- Pull Request required to merge to main
- Minimum 1 approval before merge
- During hackathon: fast reviews, don't block the team

---

## 14. Seed data for the demo

### Example users:
```
1. Nico — Business Administration, Chapel Hill, interests: fintech, basketball, entrepreneurship
   Vibe: Chatty | Clubs: Entrepreneurship Club, Intramural Sports
   Car: Toyota Corolla, Gray, ABC-1234
   Badges: Icebreaker, Eco-hero, Punctual

2. Tomi — Computer Science, Carrboro, interests: tech, running, movies
   Vibe: Podcast listener | Clubs: Tar Heel Esports, Carolina Club Running
   Car: Chevrolet Malibu, White, EFG-5678
   Badges: Icebreaker

3. Belu — Economics, Durham, interests: yoga, travel, reading
   Vibe: Chill | Clubs: Carolina Outdoors, Volunteer Corps
   Badges: Icebreaker, Explorer

4. Flor — Communications, Hillsborough, interests: art, music, photography
   Vibe: Music lover | Clubs: Photography Club, Music Makers

5. Demo user — Political Science, Chapel Hill, interests: basketball, politics
   Vibe: Chatty | Clubs: Debate Society, UNC Club Soccer

6. Demo user 2 — Business Administration, Durham, interests: fintech, startups
   Vibe: Study mode | Clubs: Entrepreneurship Club, Women in CS
   Car: VW Golf, Black, HIJ-9012
   Badges: Icebreaker, Eco-hero
```

### Example rides:
```
1. Nico: Franklin St → UNC Campus, Mon 8:00-8:30, 3 seats, flexible (2 mi), chatty
2. Tomi: Carrboro → UNC Campus, Mon 9:00-9:15, 2 seats, fixed point, podcast listener
3. Demo user 2: Durham → UNC Campus, Mon 7:45-8:15, 3 seats, flexible (5 mi), study mode
```

### Example events:
```
1. UNC vs Duke Basketball — Apr 10, 7:00 PM, Dean E. Smith Center — 15 interested
2. CS Alumni Networking Night — Apr 12, 6:00 PM, Sitterson Hall — 8 interested
3. Spring Concert — Campus Green — Apr 15, 4:00 PM, Polk Place — 22 interested
```

