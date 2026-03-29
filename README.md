# OpenSeat

> "Your open seat is waiting"

Carpooling web app for closed communities (universities, clubs, companies). Mobile-first, built for social connection — not just saving costs.

**Live:** [openseat-app.com](https://openseat-app.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript strict |
| Styling | Tailwind CSS (mobile-first) |
| Auth & DB | Firebase (Auth, Firestore, Storage) |
| Maps | Google Maps (Maps JS API, Places API, Directions API, Geocoding API) |
| Deploy | Vercel |
| Font | Inter (Google Fonts) |

---

## Prerequisites

Install these tools before starting:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | >= 18.x | [nodejs.org](https://nodejs.org/) |
| npm | >= 9.x | Comes with Node.js |
| Git | >= 2.x | [git-scm.com](https://git-scm.com/) |
| Vercel CLI (optional) | Latest | `npm i -g vercel` |

---

## Services & Accounts

### Firebase (Free — Spark plan)

Used for authentication, database, and file storage.

1. Go to [console.firebase.google.com](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** > Sign-in method > **Email/Password**
4. Enable **Cloud Firestore** (start in test mode for development)
5. Enable **Storage** (for profile photos and driver's licenses)
6. Go to Project Settings > General > Your apps > Add web app
7. Copy the Firebase config values

**Cost:** Free (Spark plan). Covers up to 50K reads/day, 20K writes/day, 1GB storage.

### Google Cloud Platform (Free tier with billing required)

Used for maps, directions, address autocomplete, and geocoding.

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a project (or use the same Firebase project)
3. **Enable billing** — required by Google even for free tier. Google gives $200/month free credit, more than enough for development and a hackathon demo
4. Enable these APIs in **APIs & Services > Library**:
   - **Maps JavaScript API** — renders the map
   - **Places API** — address autocomplete suggestions
   - **Directions API** — driving routes on the map
   - **Geocoding API** — converts addresses to coordinates
5. Create an API key in **APIs & Services > Credentials**
6. Recommended: restrict the key by HTTP referrer (`your-domain.com/*`, `localhost:3000/*`) and by API (only the 4 above)

**Cost:** Free within $200/month credit. Typical hackathon usage is under $5.

### Vercel (Free — Hobby plan)

Used for hosting and deployment.

1. Go to [vercel.com](https://vercel.com/) and sign up with GitHub
2. Import the repository
3. Add environment variables in project settings (see below)

**Cost:** Free (Hobby plan). Includes custom domains, SSL, and automatic deploys.

### Domain (Optional — Paid)

A custom domain (e.g., `openseat-app.com`) can be purchased from any registrar (GoDaddy, Namecheap, etc.).

**Cost:** ~$12/year for a `.com` domain.

To connect to Vercel:
1. Add the domain in Vercel project settings
2. Set DNS records at your registrar:
   - `A` record: `@` pointing to `76.76.21.21`
   - `CNAME` record: `www` pointing to `cname.vercel-dns.com`

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/DaleApp/OpenSeat.git
cd OpenSeat

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
```

Fill in `.env.local` with your credentials:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

```bash
# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Mode

Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local` to bypass Firebase auth and use mock data. This enables a floating user-switch button to change between demo users.

---

## Deploy to Vercel

### Option A: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Vercel auto-detects Next.js
3. Add all environment variables from `.env.local` in the project settings
4. Deploy

### Environment Variables on Vercel

Add the same variables from `.env.local` in **Vercel > Project Settings > Environment Variables**. Make sure to add them for the **Production** environment.

---

## Project Structure

```
src/
  app/
    (auth)/           # Login, Register (no nav)
      login/
      register/
    (main)/           # App pages (TopBar + BottomNav)
      home/           # Personalized home with rides and events
      ride/
        search/       # Search rides with filters
        new/          # Publish a ride
        [id]/         # Ride detail + request flow
          rate/       # Post-ride rating
      events/
        [id]/         # Event detail + event rides
      profile/
        [id]/         # Other user's profile
    page.tsx          # Landing page
  components/
    auth/             # LoginForm, RegisterForm, DemoUserSwitch
    events/           # EventCard, EventRideList
    ride/             # RideCard, RideDetail, RideMap, RideForm, SearchFilters, etc.
    social/           # SocialHint, StatsCard, BadgeGrid, RatingForm, etc.
    ui/               # Button, Input, Tag, Avatar, Card, TopBar, BottomNav, etc.
  lib/
    auth.ts           # Firebase auth functions
    auth-context.tsx  # Auth context + provider + useAuth hook
    db.ts             # Firestore functions (mock data for hackathon)
    maps.ts           # Google Maps loader + geo utilities
    mock-data.ts      # Mock users, rides, events
    social.ts         # Social hint computation
    formatters.ts     # Date/time formatters, vibe labels
  types/
    user.ts           # User, Car, Badge, GeoPoint types
    ride.ts           # Ride, RidePassenger, RideFilters types
    event.ts          # CommunityEvent type
```

---

## Features

- **Domain-validated auth** — Only @unc.edu emails allowed (frontend validation, demo mode available)
- **Publish rides** — Origin/destination with Google Places autocomplete, date, time range, seats, vibe, pickup model
- **Search rides** — Filter by destination, date, time, sorted by proximity to user
- **Ride detail & request** — Google Maps route, smart meeting points, pickup compatibility check
- **Community events** — Event listings with linked rides, publish rides for specific events
- **Social hints** — "You both study CS and like basketball" based on shared major, interests, clubs
- **Vibe matching** — Chatty, chill, music lover, study mode, podcast, sing-along
- **Google Maps integration** — Real driving routes, address autocomplete, meeting point calculation
- **Mobile-first design** — Optimized for 375px with bottom navigation

---

## Next Steps (Post-Hackathon)

- Real email verification with code
- In-app chat between riders
- Real push notifications
- Venmo / Zelle payment integration
- Admin web panel
- Recurring rides (e.g., "every Tuesday" schedules)
- Community feed
- Real-time location sharing during ride
- Automatic badge unlock logic (currently hardcoded)
- Multi-tenant organizations (multiple universities/companies)
- Waitlist for full rides
- Advanced meeting point calculation with routing optimization

---

## Team

| Name | Role |
|------|------|
| Nicolas Gonzalez Vedoya | Co-Founder, Finance & Backend/Infra |
| Tomas Latorre | Co-Founder, Data Engineering |
| Belen Franco | Co-Founder, Strategy & Operations |
| Florencia Grimaldi | Co-Founder, Supply Chain & Data |

---

## Design System

| Token | Value |
|-------|-------|
| Brand color | Teal `#0D9488` |
| Font | Inter |
| Border radius | 8px inputs, 12px cards, 20px pills |
| Bottom nav height | 64px |
| Mobile-first breakpoint | 375px |

---

## License

Private project. All rights reserved.
