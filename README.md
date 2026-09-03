# University Equipment Booking Portal

Frontend web application for ICT930 Assignment 2. Students can browse campus equipment and facilities, reserve a date, manage bookings, and update a profile.

This app follows the **Smart Services Dashboard** scenario (bookings and service tracking).

## Live URL

https://equipment-booking-portal.vercel.app/

## Technology stack

- React 19 (functional components and hooks)
- Vite
- React Router
- Context API for authentication and bookings
- Mock JSON data (`public/equipmentData.json`)
- CSS custom properties for a consistent visual language

## Installation

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Demo login

The portal is gated behind a login screen. Any non-empty student ID and password will sign you in. This is mock authentication for the assignment, not a real identity service.

## Key features

- Client-side routing: Home, Catalog, My Bookings, Profile, and a 404 page
- Reusable layout, feature, and page components
- Shared state for auth and bookings, persisted in `localStorage`
- Asynchronous catalog loading with loading and error states
- Search, type filters, date selection, booking, and cancellation
- Validated profile form with on-page feedback
- Responsive layout, including a mobile navigation menu
- Accessibility: semantic landmarks, labelled form fields, skip link, keyboard focus styles

## Design decisions

- **Context instead of Redux:** booking and auth state is small and local to the frontend, so React Context keeps the architecture simple and maintainable.
- **Mock JSON over a live API:** the assignment allows mock data; `fetch` still demonstrates async loading, loading UI, and error handling.
- **CSS classes over inline styles:** a shared stylesheet keeps spacing, colour, and typography consistent across pages.
- **SPA hosting rewrites:** `netlify.toml` and `vercel.json` send unknown routes to `index.html` so React Router works after refresh.

## Deployment

1. Push the project to GitHub.
2. Import the repository into [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).
3. Build command: `npm run build`
4. Publish directory: `dist`
5. After deploy, paste the public URL at the top of this README and test login, catalog loading, booking, and direct URLs such as `/catalog`.

## Screenshots

Store at least six captures in `docs/screenshots/` (desktop and mobile). Suggested set: login, home, catalog, bookings, profile, and mobile navigation.

## ZIP contents

Include source code (not `node_modules`), this README, `docs/Reflection.md`, `docs/Team-Contribution-Statement.md`, and `docs/screenshots/`. Complete the teammate name placeholders before submission.
