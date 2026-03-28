# Plan: OpenSeat — Implementación completa para hackathon

## Contexto
OpenSeat es una web app de carpooling para comunidades cerradas (UTDT). El proyecto tiene la base lista (tipos, Firebase, auth, mock data, Tailwind config) pero faltan todos los componentes UI (~30) y páginas (~15). El objetivo es tener una demo funcional en celular.

---

## Fase 1: `feat/ui-primitives-and-layout` — Fundación
**Bloquea todo lo demás**

Archivos a crear:
- `src/components/ui/icons.tsx` — ~10 iconos SVG (home, search, plus, user, arrow-left, star, car, clock)
- `src/components/ui/Button.tsx` — variant (primary/secondary), size, loading, href opcional
- `src/components/ui/Input.tsx` — label, error, icon
- `src/components/ui/Tag.tsx` — variant (default/success/warning)
- `src/components/ui/Avatar.tsx` — imagen circular con fallback a iniciales
- `src/components/ui/Card.tsx` — wrapper sobre .card
- `src/components/ui/EmptyState.tsx` — titulo + subtitulo + CTA
- `src/components/ui/BottomNav.tsx` — 4 tabs fijos (Home, Buscar, Publicar, Perfil), usePathname()
- `src/components/ui/TopBar.tsx` — back arrow + titulo + acción derecha
- `src/app/(auth)/layout.tsx` — centrado, sin nav, max-w-sm
- `src/app/(main)/layout.tsx` — TopBar + BottomNav + padding bottom

---

## Fase 2: `feat/auth-flow` — Login funcional
**Depende de:** Fase 1

Archivos a crear:
- `src/lib/auth-context.tsx` — Context + Provider + useAuth() hook, demo mode con MOCK_USERS[0]
- `src/components/auth/LoginForm.tsx` — email + password, validación dominio
- `src/components/auth/RegisterForm.tsx` — email + password + confirm
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`

Modificar:
- `src/app/(main)/layout.tsx` — wrappear con AuthProvider, redirect a /login si no auth

---

## Fase 3: `feat/home-page` — Pantalla principal
**Depende de:** Fase 1, 2

Archivos a crear:
- `src/components/ride/RideCard.tsx` — driver, origen→destino, hora, asientos, vibe
- `src/app/(main)/home/page.tsx` — saludo, botones acción, viajes próximos, mini stats

---

## Fase 4: `feat/ride-search` — Buscar viajes
**Depende de:** Fase 1, 3 (usa RideCard)

Archivos a crear:
- `src/components/ride/SearchFilters.tsx` — destino, fecha, rango horario
- `src/app/(main)/ride/search/page.tsx` — filtros + lista de RideCards

Modificar:
- `src/lib/db.ts` — mejorar filtros de searchRides()

---

## Fase 5: `feat/ride-detail-and-request` — Detalle y solicitud
**Depende de:** Fase 1, 3

Archivos a crear:
- `src/components/ride/RideDetail.tsx` — info completa del viaje
- `src/components/ride/RideMap.tsx` — Google Maps con markers (fallback si no hay API key)
- `src/components/ride/PassengerList.tsx` — pasajeros + accept/reject para driver
- `src/components/ride/RideRequest.tsx` — modal para pedir viaje
- `src/app/(main)/ride/[id]/page.tsx`

Modificar:
- `src/lib/db.ts` — agregar requestRide() y respondToRequest()

---

## Fase 6: `feat/publish-ride` — Publicar viaje
**Depende de:** Fase 1, 5 (usa RideMap)

Archivos a crear:
- `src/components/ride/RideForm.tsx` — origen/destino, fecha, hora, asientos, vibe, nota
- `src/lib/places.ts` — hook usePlacesAutocomplete() con fallback
- `src/app/(main)/ride/new/page.tsx`

Modificar:
- `src/lib/db.ts` — agregar createRide()

---

## Fase 7: `feat/profile-and-rating` — Perfil y social
**Depende de:** Fase 1, 2

Archivos a crear:
- `src/components/auth/ProfileForm.tsx` — editar nombre, depto, barrio, intereses
- `src/components/auth/CarForm.tsx` — marca, modelo, color, patente
- `src/components/social/StatsCard.tsx` — rides, km, CO2, rating
- `src/components/social/BadgeCard.tsx` — emoji + nombre + descripción
- `src/components/social/RatingForm.tsx` — estrellas 1-5, buena onda slider, conectar toggle
- `src/components/social/BuenaOndaSlider.tsx` — slider 1-5 con emojis
- `src/components/social/ConnectionCard.tsx` — avatar + nombre + depto
- `src/app/(main)/profile/page.tsx` — perfil propio con edit
- `src/app/(main)/profile/[id]/page.tsx` — perfil de otro usuario
- `src/app/(main)/ride/[id]/rate/page.tsx` — rating post-viaje

Modificar:
- `src/lib/db.ts` — agregar updateUser(), addRating()

---

## Trabajo en paralelo (4 personas)

```
Fase 1 ──────► Fase 2 ──────► Fase 3 ──────► Fase 4
                  │                              │
                  └──► Fase 7                    └──► Fase 5 ──► Fase 6
```

- **Hora 0-4:** Todos en Fase 1
- **Hora 4-7:** Nico → Fase 2 | Belu+Flor → Fase 7
- **Hora 7-9:** Belu → Fase 3 | Tomi → Fase 4
- **Hora 9-13:** Nico+Tomi → Fase 5 | Belu+Flor → terminan Fase 7
- **Hora 13-17:** Belu+Flor → Fase 6 | Nico+Tomi → pulir y bugs

---

## Decisiones clave
- **Demo mode:** env var `NEXT_PUBLIC_DEMO_MODE=true` bypasea Firebase auth y usa mock data
- **Sin librería de iconos:** un archivo icons.tsx con SVGs inline
- **Mock data mutable en memoria:** cambios persisten hasta reload (suficiente para demo)
- **Google Maps graceful:** si no hay API key, mostrar placeholder estático
- **Mobile-first:** todo diseñado para 375px, padding horizontal px-4

## Verificación
- `npm run dev` y probar en viewport mobile (375px)
- Flujo completo: login → home → buscar viaje → ver detalle → pedir asiento → rating
- Flujo conductor: login → home → publicar viaje → ver solicitudes → aceptar
- Verificar que funciona sin Firebase ni Google Maps API key (demo mode)
