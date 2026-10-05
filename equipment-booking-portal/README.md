# University Equipment Booking Portal

Full-stack web application for ICT930 Assessment 3. Students can register, browse campus equipment and facilities, book a date, manage reservations, and update a profile. Admins can add, edit, and delete catalog items.

This app follows the **Smart Services Dashboard** / campus facility booking scenario.

## Live URL

Frontend: https://equipment-booking-portal.vercel.app/  
API: run locally (see Installation) until the backend is deployed.

> **⚠️ IMPORTANT NOTE : FALSE POSITIVE WARNING**
>
> Google Safe Browsing is incorrectly flagging this Vercel domain as a "Dangerous site" because it detects the assignment's mock student login screen. A false positive report has already been submitted to Google.
>
> **To bypass the warning and view the live assignment:**
> 1. Click the **Details** button in the bottom left corner of the red screen.
> 2. Click the **"visit this unsafe site"** link at the bottom of the expanded text.

## Technology stack

- React 19 (functional components and hooks)
- Vite and React Router
- Context API for auth and bookings
- Express REST API
- MongoDB (Mongoose)
- JWT authentication and hashed passwords (bcrypt)
- Browser geolocation to sort facilities by distance

## Installation

Open the inner `equipment-booking-portal` folder (the one with `package.json`).

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Copy `server/.env.example` to `server/.env` and paste your connection string and a JWT secret. Do not commit `.env`.
3. Install and seed:

```bash
npm install
npm install --prefix server
npm run seed
```

4. Run the API and the React app in two terminals:

```bash
npm run dev:server
npm run dev
```

Open `http://localhost:5173`.

## Demo login

- Student: `s1234567` / `Student123!`
- Admin: `admin01` / `Admin123!`

You can also create a new student account from the login screen.

## Key features

- Client-side routing: Home, Catalog, My Bookings, Profile, Admin, and 404
- Register and login with JWT
- Catalog loaded from the API, with search, filters, loading and error states
- Bookings stored in MongoDB (create and cancel)
- Admin CRUD for catalog items
- Use my location (browser geolocation sensor) to sort nearby rooms and equipment
- Responsive layout and basic accessibility

## Design decisions

- **Express + MongoDB:** Assessment 3 requires a real backend and persistent data. JSON files and localStorage are no longer the source of truth.
- **JWT and bcrypt:** passwords are hashed and the API is protected with a token.
- **Roles:** students book items; admins manage the catalog.
- **Geolocation:** the catalog can sort by distance from the user's device, which uses the browser location sensor.

## Deployment

- Frontend: Vercel, build `npm run build`, output `dist`, root `equipment-booking-portal`
- Backend: deploy the `server` folder (Render or Railway) and set `MONGODB_URI`, `JWT_SECRET`, and `CORS_ORIGIN`
- Point the frontend to the API with `VITE_API_URL` if it is not on the same host

## Screenshots

Desktop and mobile screenshots are in `docs/screenshots/`.
