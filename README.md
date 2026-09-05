# University Equipment Booking Portal

Frontend web application for ICT930 Assignment 2. Students can browse campus equipment and facilities, reserve a date, manage bookings, and update their profile.

This app follows the **Smart Services Dashboard** scenario (bookings and service tracking).

## Live URL

https://equipment-booking-portal.vercel.app/

> **⚠️ IMPORTANT NOTE : FALSE POSITIVE WARNING**
>
> Google Safe Browsing is incorrectly flagging this Vercel domain as a "Dangerous site" because it detects the assignment's mock student login screen. A false positive report has already been submitted to Google.
> 
> **To bypass the warning and view the live assignment:**
> 1. Click the **Details** button in the bottom left corner of the red screen.
> 2. Click the **"visit this unsafe site"** link at the bottom of the expanded text.

## Technology stack

- React 19 (functional components and hooks)
- Vite
- React Router
- Context API for authentication and bookings
- Mock JSON data (`public/equipmentData.json`)
- CSS custom properties for a consistent visual language

## Installation

Open the folder that contains package.json first (the inner equipment-booking-portal folder)

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

Deployed on Vercel. Build: `npm run build`. Output: `dist`.


## Screenshots

Desktop and mobile screenshots are in `docs/screenshots/`.
