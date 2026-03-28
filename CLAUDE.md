# OpenSeat — Guía para herramientas de IA

## Qué es
Web app de carpooling para comunidades cerradas (universidades). Mobile-first, Next.js 14 App Router.

## Stack
- Next.js 14 (App Router) + TypeScript strict + Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Google Maps (Maps JS API + Places API)
- Deploy en Vercel

## Convenciones de código
- TypeScript strict, no usar `any`
- Un componente por archivo, PascalCase: `RideCard.tsx`
- Utilidades en camelCase: `formatDate.ts`
- Carpetas en kebab-case
- Lógica de datos en `lib/db.ts`, auth en `lib/auth.ts`, mapas en `lib/maps.ts`
- Tipos en `src/types/`
- Componentes en `src/components/`
- Tailwind para estilos, NO CSS modules ni styled-components
- Mobile-first: diseñar para < 640px primero

## Design system
- Color principal: teal (#0D9488)
- Font: Inter
- Border radius: 8px inputs, 12px cards, 20px pills
- Bottom nav: 64px height

## Estado actual (hackathon)
- Auth simplificado: login email+password, validación de dominio en frontend
- Mock data en `lib/mock-data.ts` — funciones en db.ts devuelven mock data
- Badges hardcodeados en seed data
- UTDT hardcodeada como organización

## Commits
Prefijos: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`
