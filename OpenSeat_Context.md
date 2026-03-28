# OpenSeat — Master Context Document

> **Qué es este documento:** La fuente de verdad del proyecto. Contiene todas las decisiones tomadas, el scope del hackathon, el stack técnico, el esquema de datos, las pantallas, los componentes, la lógica de negocio, y la estructura de la demo. Todo el equipo (Nico, Tomi, Belu, Flor) y cualquier herramienta de IA (Claude Code, Cursor, Copilot) deben leer esto antes de escribir una sola línea de código.

> **Última actualización:** Marzo 2026

---

## 1. Qué es OpenSeat

OpenSeat es una web app responsive (mobile-first) de carpooling exclusiva para comunidades cerradas (universidades, clubes, empresas). Conecta a miembros verificados para compartir viajes con un enfoque central en crear vínculos sociales, no solo ahorrar costos.

**Nombre:** OpenSeat
**Tagline:** "Tu asiento libre te está esperando"
**Concepto:** Un asiento libre en el auto de alguien de tu comunidad → lo abrís para que otro lo use → se conocen.

**Diferencial vs competencia:**
- vs BlaBlaCar: OpenSeat es comunidades cerradas verificadas, no abierto al público
- vs Scoop: OpenSeat tiene foco social (buena onda score, badges, conexiones), no solo transporte
- vs Waze Carpool: OpenSeat tiene verificación institucional y punto de encuentro inteligente
- Ninguna app combina: comunidad cerrada + verificación institucional + foco social + punto de encuentro flexible

---

## 2. Contexto del hackathon

- **Formato:** Hackathon de 1 día (sábado completo + noche)
- **Demo:** Domingo a la mañana, desde un celular mostrando la web app
- **Presentación:** Una persona habla y muestra la app en su celular simultáneamente
- **Equipo:** 4 personas — Nico (backend/infra), Tomi (data/Firestore), Belu (UI/páginas), Flor (diseño/visual)
- **Plataforma:** Web app responsive mobile-first (NO app nativa)
- **Stack:** Next.js 14 + Tailwind CSS + TypeScript + Firebase + Google Maps

---

## 3. Scope del hackathon

### Filosofía: DEMO PERFECTA > muchas features
Un flujo completo que funcione impecable y se vea bien gana hackathons. No la cantidad de features. Todo lo que se buildee tiene que funcionar en la demo sin romperse.

### LO QUE SE BUILDEA (debe funcionar en la demo):

1. **Login simple con validación de dominio** — El usuario ingresa email + password. El frontend valida que el dominio sea el permitido (ej: @utdt.edu). Sin verificación por email real (se agrega post-hackathon). Para la demo, se usan usuarios pre-seedeados.
2. **Perfil de usuario** — Nombre, apellido, foto, carrera/departamento, barrio, intereses (tags), datos del auto (marca, modelo, color, patente) si es conductor
3. **Publicar viaje (conductor)** — Origen y destino con autocompletado, fecha, hora, asientos, pickup (2 opciones: punto fijo / punto flexible), vibe del viaje (música/charla/tranqui)
4. **Buscar viaje (pasajero)** — Búsqueda por destino + hora, resultados con cards mostrando perfil del conductor + hints sociales + ruta en mapa con pin de punto de encuentro
5. **Solicitar viaje** — Cualquier usuario puede solicitar unirse a un viaje publicado por otro. El usuario que publicó el viaje recibe la solicitud y puede aceptar o rechazar. No hay roles fijos: el mismo usuario puede publicar un viaje y también solicitar unirse al viaje de otro.
6. **Post-viaje funcional** — Rating mutuo (1-5 estrellas), "buena onda" score con slider de emoji, opción de "conectar" con el otro, stats (km compartidos, CO2 ahorrado)
7. **Badges visuales** — Se muestran en el perfil. Para el hackathon son hardcodeados en seed data (la lógica automática de desbloqueo se agrega post-hackathon)
8. **Home** — Saludo personalizado, botones "Ofrecer viaje" / "Buscar viaje", próximos viajes cerca, bottom nav
9. **Perfil social** — Stats, badges desbloqueados, conexiones, rating promedio
10. **Eventos de la comunidad** — Sección donde se listan próximos eventos de la organización (ej: partido de básquet, recital, charla). Cada evento tiene fecha, hora y lugar. Al entrar a un evento, el usuario puede ver: (a) viajes publicados que van hacia ese destino en ese horario, y (b) otros miembros interesados en ir. Desde ahí puede unirse a un viaje existente o publicar uno nuevo con el destino del evento precargado.

### LO QUE NO SE BUILDEA (va en slides como "próximos pasos"):

- Verificación real de email con código (post-hackathon)
- Chat in-app (coordinación se hace por fuera en el hackathon)
- Push notifications reales
- Cálculo automático de punto de encuentro con routing API
- Integración con Mercado Pago (se menciona como futuro)
- Panel admin web
- Viajes recurrentes
- Feed de comunidad
- Compartir ubicación en tiempo real durante el viaje
- Lógica automática de badges (post-hackathon, se muestran hardcodeados)
- Colección de organizations multi-tenant (post-hackathon)

---

## 4. Modelo de usuario

Un usuario NO tiene un rol fijo. El mismo usuario puede:
- A veces ser **conductor** (ofrece viaje, tiene auto)
- A veces ser **pasajero** (busca viaje, no lleva auto ese día)

Los datos del auto se cargan una sola vez en el perfil y quedan guardados. Cuando el usuario entra al home, ve los dos botones: "Ofrecer viaje" y "Buscar viaje".

---

## 5. Stack técnico

| Capa | Tecnología | Para qué |
|------|-----------|----------|
| Framework | Next.js 14 (App Router) | SSR, routing, React |
| Estilos | Tailwind CSS | Utility-first CSS, mobile-first |
| Lenguaje | TypeScript (strict mode) | Tipos en todo, menos bugs |
| Auth | Firebase Authentication | Registro, login (email + password) |
| Base de datos | Cloud Firestore | NoSQL, real-time listeners |
| Storage | Firebase Storage | Fotos de perfil |
| Mapas | Google Maps JavaScript API | Mapas, rutas, pins |
| Geocoding | Google Places API | Autocompletado de direcciones |
| Hosting | Vercel | Deploy automático desde GitHub |
| Repo | GitHub (organización DaleApp) | Control de versiones, PRs |

### Requisito previo: Google Cloud
Google Maps requiere billing habilitado (tarjeta de crédito). El free tier da $200/mes que cubre de sobra el hackathon y desarrollo posterior. Configurar ANTES del hackathon:
1. Crear proyecto en Google Cloud Console
2. Habilitar Maps JavaScript API + Places API
3. Crear API key restringida (por dominio: localhost + dominio de Vercel)
4. Guardar en Bitwarden

### Por qué auth simple en vez de verificación por email
- Firebase email verification puede fallar en la demo (emails que no llegan, spam folder, dominios institucionales bloqueados)
- Para el hackathon: login con email + password, validación de dominio en frontend
- Usuarios pre-seedeados para la demo → el flujo se muestra perfecto siempre
- **Post-hackathon:** Se agrega verificación real con código por email

**Costos del hackathon:** $0 (todo es free tier o gratuito)

---

## 5.1 GitHub — Setup de organización y repositorio

### Por qué una organización
El proyecto vive en una **organización de GitHub** separada de las cuentas personales de cada integrante. Los repos personales de cada uno (otros proyectos, trabajos, etc.) son completamente invisibles para el resto del equipo. Nadie puede ver, tocar, ni saber que existen.

### Setup (lo hace el Owner del repo ANTES del hackathon)

**Paso 1: Crear la organización**
- GitHub > avatar (arriba a la derecha) > Your organizations > New organization
- Plan: **Free**
- Nombre: `DaleApp`
- Email: el del Owner como contacto

**Paso 2: Invitar al equipo**
- Organization > People > Invite member
- Invitar a los otros 3 integrantes con sus usernames o emails de GitHub
- Rol: **Member** (solo el creador queda como Owner)

**Paso 3: Crear el repositorio**
- Ya creado: https://github.com/DaleApp/OpenSeat
- Organización: `DaleApp`
- Repo: `OpenSeat`

**Paso 4: Protección de branch**
- Repo > Settings > Branches > Add branch protection rule
- Branch name pattern: `main`
- Activar: **Require a pull request before merging**
- Activar: **Require approvals** (mínimo 1)
- Esto obliga a que nadie pueda pushear directo a main — todo pasa por PR con review

**Paso 5: GitHub Projects**
- Organization > Projects > New project > Board
- Crear 4 columnas: **Backlog** | **Sprint** | **En Review** | **Done**
- Crear Issues para cada tarea del hackathon y asignar a la persona correspondiente

### Clonar el repo (todos)
```bash
git clone https://github.com/DaleApp/OpenSeat.git
cd OpenSeat
npm install
cp .env.example .env.local
# Completar .env.local con las claves de Firebase (están en Bitwarden)
npm run dev
# Abrir http://localhost:3000
```

### Git workflow durante el hackathon
```bash
# Crear branch para tu feature
git checkout -b feature/nombre-de-la-feature

# Trabajar, commitear frecuentemente
git add .
git commit -m "feat: descripción corta de lo que hiciste"

# Pushear tu branch
git push origin feature/nombre-de-la-feature

# Crear Pull Request en GitHub → pedir review → merge
```

**Prefijos de commits:** `feat:` (nueva feature), `fix:` (bug), `style:` (visual), `refactor:` (reestructura), `docs:` (documentación)

**Regla de hackathon:** Reviews rápidos. Cuando alguien abre un PR, otro del equipo lo mira en máximo 10 minutos y aprueba o comenta. No bloquear al equipo.

### Accesos por persona

| Herramienta | Nico (admin) | Tomi | Belu | Flor |
|-------------|-------------|------|------|------|
| GitHub repo | Owner | Collaborator | Collaborator | Collaborator |
| GitHub Projects | Admin | Write | Write | Write |
| Firebase console | Admin | — | — | — |
| Vercel | Admin | — | — | — |
| Slack | Admin | Member | Member | Member |
| Bitwarden vault | Admin | Member | Member | Member |

### Gestión de secretos
Las API keys y credenciales se comparten via **Bitwarden** (password manager, gratis). NUNCA por WhatsApp, email, ni Slack. Nico crea el vault "OpenSeat - Dev" e invita al equipo. Cada uno copia las claves a su `.env.local`.

---

## 6. Esquema de Firestore

### Estrategia: empezar simple, crecer después
Para el hackathon se usa un schema simplificado. No hay colección `organizations` (UTDT está hardcodeada). Los ratings se embeben en el ride. Los badges son datos estáticos en el seed. Post-hackathon se escala al schema completo.

### Colección: `users`
```typescript
interface User {
  id: string;                    // Firebase Auth UID
  email: string;
  name: string;
  photoUrl?: string;
  department: string;            // "MBA", "Economía", "Derecho"
  neighborhood: string;          // "Núñez", "Belgrano", "V. López"
  bio?: string;
  interests: string[];           // ["fútbol", "fintech", "música"]

  // Datos del auto (opcionales, se cargan si alguna vez es conductor)
  car?: {
    brand: string;               // "Toyota"
    model: string;               // "Corolla"
    color: string;               // "Gris"
    licensePlate: string;        // "AB 123 CD"
  };

  // Stats
  stats: {
    totalRides: number;
    totalKm: number;
    co2Saved: number;            // en kg
    peopleConnected: number;
    averageRating: number;       // 1-5
    averageBuenaOnda: number;    // 1-5
    totalRatings: number;
  };

  // Badges desbloqueados (hardcodeados en seed para el hackathon)
  badges: Badge[];

  // Conexiones (user IDs de personas con las que eligió "conectar")
  connections: string[];

  createdAt: Timestamp;
}

interface Badge {
  id: string;                    // "rompehielo", "puntual", "eco-hero"
  name: string;                  // "Rompehielo"
  description: string;           // "Primer viaje con alguien nuevo"
  icon: string;                  // emoji o ícono
  unlockedAt: Timestamp;
}
```

### Colección: `rides`
```typescript
interface Ride {
  id: string;
  driverId: string;
  driverName: string;            // denormalized
  driverPhotoUrl?: string;       // denormalized
  driverDepartment: string;      // denormalized
  driverRating: number;          // denormalized
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

  date: string;                  // "2026-04-05" (YYYY-MM-DD)
  departureTime: string;         // "08:30"

  totalSeats: number;            // 1-4
  availableSeats: number;

  pickupFlexibility: 'fixed' | 'flexible';
  flexibleRadiusKm?: number;

  meetingPoint?: {
    address: string;
    lat: number;
    lng: number;
  };

  vibe: {
    music: boolean;
    chat: boolean;
    quiet: boolean;
  };

  note?: string;

  status: 'active' | 'full' | 'in_progress' | 'completed' | 'cancelled';

  passengers: RidePassenger[];

  // Ratings embebidos (simplificado para hackathon)
  ratings: EmbeddedRating[];

  createdAt: Timestamp;
}

interface RidePassenger {
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  userDepartment: string;
  status: 'pending' | 'accepted' | 'rejected';
  pickupPreference: 'pickup_me' | 'i_go_to_you' | 'flexible';
  requestedAt: Timestamp;
  respondedAt?: Timestamp;
}

interface EmbeddedRating {
  fromUserId: string;
  toUserId: string;
  stars: number;                 // 1-5
  buenaOnda: number;             // 1-5
  wantsToConnect: boolean;
  createdAt: Timestamp;
}
```

### Post-hackathon: schema expandido
- Agregar colección `organizations` con `allowedDomains`, `verificationMethod`, etc.
- Mover ratings a colección separada `ratings` con dimensiones (puntualidad, conducción)
- Agregar lógica automática de badges
- Agregar campo `organizationId` a users

---

## 7. Páginas y rutas (Next.js App Router)

```
app/
├── (auth)/
│   ├── login/page.tsx              → Login con email + password
│   └── register/page.tsx           → Registro: email (valida dominio) → password → perfil
│
├── (main)/
│   ├── home/page.tsx               → Home: saludo, 2 botones, viajes cercanos
│   ├── ride/
│   │   ├── new/page.tsx            → Ofrecer viaje (formulario completo)
│   │   ├── search/page.tsx         → Buscar viaje (búsqueda + resultados)
│   │   └── [id]/page.tsx           → Detalle del viaje (mapa, conductor, solicitar)
│   ├── ride/[id]/rate/page.tsx     → Post-viaje: rating + buena onda + conectar
│   ├── profile/page.tsx            → Mi perfil: stats, badges, conexiones, datos auto
│   └── profile/[id]/page.tsx       → Perfil de otro usuario
│
├── layout.tsx                      → Layout principal con bottom nav
└── globals.css                     → Tailwind imports + CSS custom
```

Nota: Se eliminó `register/car/page.tsx` como página separada. Los datos del auto se cargan desde el perfil o cuando el usuario intenta ofrecer su primer viaje.

---

## 8. Componentes principales

### Layout
- `BottomNav` — Navegación inferior mobile: Home, Buscar, Mis viajes, Perfil
- `TopBar` — Barra superior con logo OpenSeat + avatar usuario

### Auth
- `ProfileForm` — Formulario de perfil (nombre, foto, carrera, barrio, intereses)
- `CarForm` — Formulario de datos del auto (marca, modelo, color, patente)

### Ride
- `RideForm` — Formulario para ofrecer viaje (origen, destino, hora, asientos, pickup, vibe)
- `RideCard` — Card de resultado de búsqueda (foto conductor, carrera, rating, hora, asientos, vibe, hints sociales)
- `RideDetail` — Vista completa del viaje con mapa, info del conductor, botón solicitar
- `RideMap` — Mapa Google Maps con pins de origen, destino y punto de encuentro
- `PickupSelector` — Selector de 2 opciones: punto fijo / punto flexible
- `VibeSelector` — Selector de vibe: música / charla / tranqui (toggle pills)
- `SeatSelector` — Selector de 1-4 asientos
- `PassengerRequest` — Card de solicitud pendiente (para el conductor: aceptar/rechazar)
- `AddressInput` — Input con autocompletado via Google Places API

### Social
- `RatingForm` — Estrellas + slider buena onda + botón conectar
- `BuenaOndaSlider` — Slider con emojis (😐 → 🤩)
- `BadgeCard` — Badge individual con ícono, nombre, descripción
- `BadgeGrid` — Grid de todos los badges (desbloqueados + bloqueados)
- `StatsCard` — Card con stat individual (km, CO2, personas, viajes)
- `ConnectionsList` — Lista de personas con las que conectaste
- `SocialHint` — "Ambos estudian MBA y les gusta el fútbol" (en los resultados de búsqueda)

### UI (reutilizables)
- `Button` — Botón primario (teal) y secundario (outline)
- `Input` — Input con label y error
- `Tag` — Pill de interés (seleccionable/deseleccionable)
- `Avatar` — Foto de perfil circular con fallback de iniciales
- `Card` — Container con borde y padding
- `EmptyState` — Mensaje cuando no hay resultados

---

## 9. Lógica de negocio

### Auth (simplificado para hackathon)
```
1. Usuario ingresa email + password
2. Frontend extrae dominio del email (ej: "utdt.edu" o "mail.utdt.edu")
3. Chequea si dominio está en lista hardcodeada: ["utdt.edu", "mail.utdt.edu"]
4. Si sí → crea cuenta en Firebase Auth (email + password)
5. Si no → muestra error "Este email no pertenece a UTDT"
6. Redirige a completar perfil
7. Para la demo: usuarios ya seedeados, se loguean directo
```

**Post-hackathon:** Agregar verificación real con código por email, colección `organizations` con dominios configurables por org.

### Publicar viaje
```
1. Conductor ingresa origen (AddressInput con autocompletado Google Places)
2. Ingresa destino (AddressInput con autocompletado Google Places)
3. Selecciona fecha y hora
4. Selecciona asientos (1-4)
5. Selecciona pickup: punto fijo o punto flexible (+ radio si flexible)
6. Selecciona vibe: música / charla / tranqui
7. Nota opcional
8. Publica → se crea doc en Firestore con status "active"
9. Si no tiene datos del auto cargados → redirige a cargar auto primero
```

### Buscar viaje
```
1. Pasajero ingresa destino + fecha + hora aproximada
2. Query a Firestore: rides donde date coincide, status = "active", availableSeats > 0
3. Filtrar/ordenar en frontend por cercanía geográfica (cálculo simple de distancia)
4. Mostrar resultados como cards con:
   - Foto, nombre, carrera, rating del conductor
   - Hora, asientos disponibles
   - Pickup flexibility (badge: "Punto fijo" o "Flexible")
   - Vibe tags
   - Social hint (intereses en común)
5. Al tocar una card → detalle del viaje con mapa
```

### Solicitar viaje
```
1. Pasajero ve detalle del viaje con mapa y ruta
2. Selecciona su preferencia de pickup: "que me busquen" / "voy yo" / "flexible"
3. Toca "Solicitar viaje"
4. Se agrega como passenger en el doc del ride con status "pending"
5. Conductor ve la solicitud en su pantalla
6. Conductor acepta → status cambia a "accepted", availableSeats se decrementa
7. Conductor rechaza → status cambia a "rejected"
```

### Post-viaje (rating)
```
1. Cuando el conductor marca el viaje como "completed"
2. Cada participante ve pantalla de rating:
   a. Estrellas (1-5)
   b. "¿Qué tan buena onda fue?" → slider de emoji (😐😊😄🤩) = 1-5
   c. "¿Conectar con [nombre]?" → Sí / Ahora no
3. Se guarda embebido en el ride (array ratings)
4. Se actualiza stats del usuario rated (averageRating, averageBuenaOnda)
5. Si ambos eligieron "conectar" → se agregan mutuamente a connections
```

### Badges (hardcodeados para hackathon)
```
Para la demo, los badges se cargan en el seed data de los usuarios.
Badges disponibles:
- "Rompehielo": Primer viaje con alguien nuevo
- "Puntual": Siempre a tiempo
- "Eco-hero": Ahorró más de 50 kg CO2
- "Explorador/a": Viajó con gente de 5 departamentos distintos
- "Comunidad": Conectado con 20+ personas

Post-hackathon: lógica automática que chequea después de cada viaje completado.
```

### Cálculo de CO2 ahorrado
```
Fórmula simplificada:
co2Saved = distanciaKm * 0.21 (kg CO2 por km promedio de un auto)

Si 2 personas comparten un viaje de 15km:
- Sin carpooling: 2 autos × 15km × 0.21 = 6.3 kg CO2
- Con carpooling: 1 auto × 15km × 0.21 = 3.15 kg CO2
- Ahorro por persona: 3.15 / 2 = 1.575 kg CO2
```

### Social hints (intereses en común)
```
Al mostrar resultados de búsqueda:
1. Comparar interests[] del pasajero con interests[] del conductor
2. Comparar department del pasajero con department del conductor
3. Si hay match → mostrar "Ambos estudian [dept] y les gusta [interés]"
4. Si no hay match de intereses → mostrar solo info básica
```

---

## 10. Design system (para Flor y todo el equipo)

### Colores
```css
--brand-primary: #0D9488;        /* Teal - color principal */
--brand-primary-light: #E1F5EE;  /* Teal claro - backgrounds */
--brand-primary-dark: #085041;   /* Teal oscuro - texto sobre teal claro */

--text-primary: #1E293B;         /* Texto principal */
--text-secondary: #64748B;       /* Texto secundario */
--text-tertiary: #94A3B8;        /* Texto hint/placeholder */

--bg-primary: #FFFFFF;           /* Fondo principal */
--bg-secondary: #F1F5F9;         /* Fondo cards/sections */

--border: #E2E8F0;               /* Bordes */
--border-focus: #0D9488;         /* Bordes en focus */

--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
```

### Tipografía
```
Font: Inter (Google Fonts) o system fonts
Títulos: 18-24px, font-weight: 600
Subtítulos: 14-16px, font-weight: 500
Body: 14px, font-weight: 400
Caption: 12px, font-weight: 400
Tags/badges: 10-11px, font-weight: 500
```

### Componentes clave
```
Border radius: 8px (inputs), 12px (cards), 20px (botones pill), 50% (avatars)
Padding cards: 12-16px
Gap entre elementos: 8-12px
Bottom nav height: 64px
Safe area bottom: 16px (para iPhones con notch)
```

### Mobile-first breakpoints
```css
/* Default: mobile (< 640px) — DISEÑAR PRIMERO PARA ESTO */
/* sm: 640px+ (tablet) */
/* md: 768px+ (tablet landscape) */
/* lg: 1024px+ (desktop) — nice to have, no prioridad */
```

---

## 11. Estrategia de mock data

### Por qué mock data desde el minuto 1
Para que Belu y Flor puedan trabajar en UI sin esperar a que Firestore esté conectado, Tomi arranca creando `lib/mock-data.ts` con toda la data de demo. Las funciones en `lib/db.ts` arrancan devolviendo mock data y después adentro se cambian por queries reales. Misma interfaz, distinta implementación.

### `lib/mock-data.ts`
```typescript
// Usuarios de ejemplo
export const MOCK_USERS: User[] = [
  {
    id: "user1",
    email: "nico@utdt.edu",
    name: "Nico García",
    photoUrl: "/avatars/nico.jpg",
    department: "MBA",
    neighborhood: "Núñez",
    interests: ["fintech", "fútbol", "emprendimiento"],
    car: { brand: "Toyota", model: "Corolla", color: "Gris", licensePlate: "AB 123 CD" },
    stats: { totalRides: 24, totalKm: 312, co2Saved: 65.5, peopleConnected: 8, averageRating: 4.8, averageBuenaOnda: 4.6, totalRatings: 18 },
    badges: [
      { id: "rompehielo", name: "Rompehielo", description: "Primer viaje con alguien nuevo", icon: "🧊", unlockedAt: ... },
      { id: "eco-hero", name: "Eco-hero", description: "Ahorraste más de 50 kg CO2", icon: "🌱", unlockedAt: ... },
    ],
    connections: ["user2", "user3"],
    createdAt: ...
  },
  // ... Tomi, Belu, Flor, Usuario demo, Usuario demo 2
];

// Viajes de ejemplo
export const MOCK_RIDES: Ride[] = [
  // Nico: Núñez → UTDT, Lun 8:30, 3 asientos, flexible, música + charla
  // Tomi: Belgrano → UTDT, Lun 9:00, 2 asientos, punto fijo, charla
  // Demo2: San Isidro → UTDT, Lun 8:00, 3 asientos, flexible, tranqui
];
```

### `lib/db.ts` — patrón de migración
```typescript
// Fase 1 (hackathon): devuelve mock data
export async function getRides(filters: RideFilters): Promise<Ride[]> {
  return MOCK_RIDES.filter(/* filtros básicos */);
}

// Fase 2 (post-hackathon): misma firma, query real
export async function getRides(filters: RideFilters): Promise<Ride[]> {
  const q = query(collection(db, 'rides'), where(...), orderBy(...));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
}
```

Esto desbloquea a todo el equipo desde la hora 1.

---

## 12. Asignación de tareas por persona

### Nico (backend / infra / integrations)
- Setup del proyecto: Next.js + Tailwind + Firebase + GitHub
- Firebase Auth: registro y login con email + password, validación de dominio
- Google Maps: componente de mapa con pins, autocompletado Places
- Home page: saludo, botones, viajes cercanos
- Seed data / mock data para la demo
- Deploy en Vercel
- CLAUDE.md en el repo para herramientas de IA

### Tomi (data / Firestore / lógica)
- `lib/mock-data.ts` — data completa de demo (PRIMERA TAREA, desbloquea a Belu y Flor)
- `lib/db.ts` — funciones con interfaz final pero implementación mock primero
- Conectar a Firestore real cuando esté listo (swap de implementación)
- Lógica de stats: actualizar km, CO2, rating promedio
- Social hints: comparar intereses entre usuarios

### Belu (UI / páginas / formularios)
- Página de registro/login: email + password + perfil
- Página de ofrecer viaje: formulario completo
- Página de buscar viaje: búsqueda + resultados con RideCards
- Página de detalle del viaje: info + mapa + botón solicitar
- Página de post-viaje: rating + buena onda + conectar
- Slides de la presentación del domingo

### Flor (diseño / visual / UX)
- Tailwind config: colores, fonts, tema
- Componentes UI base: Button, Input, Tag, Avatar, Card
- Bottom nav + top bar + layout general mobile
- Perfil social: stats, badges, conexiones
- Pantalla de bienvenida / landing con branding OpenSeat
- Pulido visual final en todas las pantallas
- Car form (datos del auto)

### Regla anti-bloqueo
Nadie espera a nadie. Mock data desde el minuto 1. Si alguien necesita algo que otro no terminó, usa datos hardcodeados y sigue. Al final se conecta todo.

---

## 13. Plan del hackathon (sábado)

| Hora | Sprint | Qué se hace |
|------|--------|-------------|
| 8:00-9:00 | Sprint 0 | Setup: clonar repo, npm install, verificar que todos ven localhost:3000. Tomi crea mock-data.ts |
| 9:00-12:00 | Sprint 1 | Auth (login/registro simple) + perfil + componentes UI base + layout |
| 12:00-13:00 | Almuerzo | Merge todo a main, verificar deploy en Vercel |
| 13:00-17:00 | Sprint 2 | Viajes: publicar, buscar, mapa Google Maps, solicitar. Conectar Firestore real |
| 17:00-18:00 | Sprint 3 | Home + navegación + flujo completo end-to-end |
| 18:00-19:00 | Cena | Merge final, testeo en celular real |
| 19:00-22:00 | Sprint 4 | Post-viaje (rating + buena onda), perfil social, seed data final, demo prep, slides |
| 22:00-23:00 | Ensayo | Practicar la presentación 3 veces con timer |

**Regla de las 18:00:** A las 18:00 se para de agregar features nuevas. De ahí en adelante solo se pulé lo que hay, se prepara la demo, y se practica.

---

## 14. Estructura de la demo (domingo)

### Flujo que se muestra desde el celular:
```
1. Abrir openseat en Vercel desde el celular
2. Pantalla de bienvenida con logo OpenSeat
3. Loguearse con usuario seedeado (email @utdt.edu + password)
4. Ver perfil completo: nombre, foto, carrera, barrio, intereses
5. Home: ver viajes disponibles cerca
6. Ofrecer viaje: completar formulario con mapa
7. Cambiar a otro usuario (ya seedeado) que busca viaje
8. Buscar viaje: ver resultados con cards y hints sociales
9. Ver detalle del viaje con mapa y ruta
10. Solicitar viaje
11. Simular viaje completado → mostrar pantalla de rating + buena onda
12. Mostrar badge "Rompehielo" desbloqueado
13. Mostrar perfil con stats y conexiones
```

### Estructura del pitch (adaptable a 5-15 min):
```
1. GANCHO (30s): "¿Cuántos vinieron solos en auto hoy? ¿Y cuántos viven
   cerca de alguien de acá y no lo saben?"
2. PROBLEMA (1min): Miembros de una misma comunidad viajan solos sin saberlo.
   Las apps abiertas generan desconfianza. El commute es tiempo muerto.
3. SOLUCIÓN (1min): OpenSeat — carpooling para comunidades cerradas con
   verificación institucional y foco social.
4. DEMO EN VIVO (3-5min): [flujo de arriba desde el celular]
5. DIFERENCIAL (1min): Verificación configurable + pickup inteligente +
   buena onda score + badges + conexiones
6. MERCADO (1min): Mercado global de carpooling $7.2B (2025), creciendo 14%
   anual. Foco inicial: universidades argentinas.
7. MODELO (30s): B2B SaaS — la organización paga, el usuario usa gratis.
   Gratuito para el piloto. Futuro: integración Mercado Pago para compartir nafta.
8. EQUIPO (30s): Nico, Tomi, Belu, Flor + backgrounds relevantes
```

### Plan B:
- **Si WiFi falla:** Slides con screenshots de cada pantalla
- **Si la app crashea:** Video grabado de backup (grabar sábado a la noche)
- **Si algo no se llegó a buildear:** Data hardcodeada que se vea real

---

## 15. Decisiones técnicas importantes

### Pickup simplificado (2 opciones, no 3)
Por feedback de Belu: en vez de 3 opciones para el conductor (punto fijo / paso a buscar / intermedio), simplificamos a 2:
- **Punto fijo:** "Salgo de acá, el pasajero viene a mi punto de partida"
- **Punto flexible:** "Me puedo desviar hasta X cuadras" (el conductor define el radio)

El pasajero elige: "que me busquen" / "voy yo" / "flexible". El matching cruza las preferencias.

### Sin pagos por ahora
El hackathon es 100% gratuito. No hay integración de pagos. Si el proyecto continúa, se agrega Mercado Pago para compartir gastos de nafta.

### Usuario dual (conductor + pasajero)
No hay roles fijos. El mismo usuario puede ofrecer viajes (si tiene auto) y buscar viajes. Los datos del auto se cargan una vez y quedan en el perfil. El home muestra ambas opciones siempre.

### Data denormalizada en rides
Los datos del conductor (nombre, foto, departamento, rating, auto) se copian al documento del ride para evitar queries extra al mostrar resultados de búsqueda. Si el conductor actualiza su perfil, los rides viejos mantienen la data de cuando se crearon (aceptable para el MVP).

### Mock-first development
Las funciones de `lib/db.ts` se diseñan con la interfaz final pero devuelven mock data inicialmente. Esto permite que todo el equipo trabaje en paralelo sin dependencias. Cuando Firestore está listo, se cambia la implementación interna sin tocar las páginas.

---

## 16. Reglas de código

### TypeScript strict mode
Todo tiene tipos. No usar `any`. Interfaces para todos los modelos de datos.

### Estructura de archivos
- Un componente por archivo
- Componentes en PascalCase: `RideCard.tsx`
- Utilidades en camelCase: `formatDate.ts`
- Carpetas en kebab-case: `ride-search/`
- Toda la lógica de datos va en `lib/db.ts`
- Toda la lógica de auth va en `lib/auth.ts`
- Toda la lógica de mapas va en `lib/maps.ts`
- Mock data en `lib/mock-data.ts`
- Tipos en `types/` (user.ts, ride.ts)

### Git workflow
- Branch por feature: `feature/auth`, `feature/ride-form`, etc.
- Commits con prefijo: `feat:`, `fix:`, `style:`, `refactor:`
- Pull Request obligatorio para mergear a main
- Mínimo 1 aprobación antes de merge
- En hackathon: reviews rápidos, no bloquear al equipo

---

## 17. Seed data para la demo

### Usuarios de ejemplo:
```
1. Nico — MBA, Núñez, intereses: fintech, fútbol, emprendimiento
   Auto: Toyota Corolla, Gris, AB 123 CD
   Badges: Rompehielo, Eco-hero, Puntual

2. Tomi — Negocios Digitales, Belgrano, intereses: tecnología, running, cine
   Auto: Chevrolet Onix, Blanco, EF 456 GH
   Badges: Rompehielo

3. Belu — Economía, Vicente López, intereses: yoga, viajes, lectura
   Badges: Rompehielo, Explorador/a

4. Flor — Diseño, Palermo, intereses: arte, música, fotografía

5. Usuario demo — Derecho, Recoleta, intereses: fútbol, política

6. Usuario demo 2 — MBA, San Isidro, intereses: fintech, startups
   Auto: VW Golf, Negro, IJ 789 KL
   Badges: Rompehielo, Eco-hero
```

### Viajes de ejemplo:
```
1. Nico: Núñez → UTDT, Lun 8:30, 3 asientos, flexible (10 cuadras), música + charla
2. Tomi: Belgrano → UTDT, Lun 9:00, 2 asientos, punto fijo, charla
3. Usuario demo 2: San Isidro → UTDT, Lun 8:00, 3 asientos, flexible (15 cuadras), tranqui
```

---

## 18. Roadmap post-hackathon

Mejoras a implementar sobre la base del hackathon (en orden de prioridad):

### Semana 1-2: Completar lo simplificado
1. Verificación real de email con código (Firebase Auth email verification)
2. Colección `organizations` con dominios configurables (multi-tenant)
3. Lógica automática de badges post-viaje
4. Colección `ratings` separada con dimensiones (puntualidad, conducción)
5. Agregar Directions API para cálculo de rutas y punto de encuentro automático

### Semana 3-4: Features nuevas
6. Chat in-app con Firebase Realtime DB
7. Push notifications reales (FCM + service worker)
8. Viajes recurrentes (L-V misma hora)
9. Matching por afinidad social (no solo geográfico)

### Mes 2+: Escalar
10. Integración Mercado Pago para compartir nafta
11. Panel admin web para la universidad
12. SAML/OAuth institucional (login directo con credenciales de la uni)
13. Feed de la comunidad
14. Compartir ubicación en tiempo real durante el viaje
15. Certificado de antecedentes penales + seguro del vehículo
16. Feature de Eventos (partidos, recitales, etc.)
17. Expansión a otras universidades (UNC, UBA, San Andrés)
