# Reflection: University Equipment Booking Portal

**Unit:** ICT930 Advanced Web Application Development  
**Assessment:** Assignment 2: Frontend Design Overview  
**Word count:** approximately 1700 words (excluding references)

This reflection discusses the architectural choices in the University Equipment Booking Portal, the main implementation challenges, the industry relevance of a campus booking frontend, and an individual reflection. Permitted use of AI tools is declared at the end.

## Architectural choices

The team selected React with functional components and hooks, bundled with Vite. That combination matches the unit requirement for a modern JavaScript framework and is typical of current frontend job practice (React, n.d.; Vite, n.d.). The product is a single-page application (SPA): the browser loads one HTML shell, and React Router swaps views without a full page reload.

Routes are split by user task. Home explains the service. Catalog lists bookable equipment and rooms. My Bookings shows the student’s reservations. Profile holds account details and recent activity. An unmatched path renders a 404 page. Login is not a public route; `App` checks `AuthContext` and renders the login screen until credentials are accepted. That gate is simple, but it makes the rest of the interface feel like a campus portal rather than an open brochure site.

Components are grouped by responsibility. Layout components (`Navbar`, `Footer`, `Toast`) wrap every authenticated page. Feature components (`EquipmentCard`, `Spinner`, `ErrorBadge`) are reused wherever the same UI appears. Page components compose those pieces and own screen-specific state such as search text. This layout / interface / feature split is what the brief asks for, and it keeps files small enough to change without editing unrelated screens.

Shared state uses the React Context API rather than a dedicated store such as Redux. Authentication (logged-in flag and profile) and the booking list are the only cross-page data. Context plus `useState` is enough for that scale and avoids extra libraries that markers would have to install (React, n.d.). Both contexts write to `localStorage`, so a refresh does not wipe a demo session. Catalog records are not stored in context. They are loaded asynchronously with `fetch` from `public/equipmentData.json`. That keeps “source of truth for stock” separate from “source of truth for this student’s bookings,” which is closer to how a real client would call a REST API even though this assignment allows mock JSON.

Local state still matters. The catalog page holds loading, error, search, and filter values. Each card holds the date the user is considering. The profile page holds edit mode and form drafts. Mixing local and shared state was a deliberate choice: putting the search box into global context would cause extra re-renders and couple unrelated pages together.

Styling uses one stylesheet and CSS custom properties (navy, blue, spacing, radius) instead of the original Vite template and scattered inline styles. Class names such as `.btn`, `.card`, and `.chip` give a consistent visual language. Media queries switch the header to a Menu / Close control below 768px so the same navigation works on a phone.

## Challenges faced and solutions

The first challenge was turning a Vite starter into something that looked like a product rather than a tutorial. The default CSS centred the entire `#root` column and used a purple accent that clashed with later inline styles. The solution was to replace that file with a small design system and move presentation off individual JSX `style` objects. That also reduced duplication when the same button appeared on Home, Catalog, and Profile.

The second challenge was booking rules. Equipment can be available, in use, or in maintenance, but students also pick a calendar date. A card that is “in use” today can still be reserved for next week, while a maintenance item should stay locked. The card derives a status badge from `item.status`, the selected date, and `isBooked(id, date)` in context. Duplicate reservations for the same id and date are rejected, and the user sees a toast instead of a blocking `alert()`. Toasts are easier to screenshot, easier for screen readers via `aria-live`, and closer to production UI feedback.

The third challenge was asynchronous data. `fetch` can fail if the JSON path is wrong after deployment, or if the network is slow. The catalog therefore shows a labelled spinner, then either the grid or an error banner. A short timeout was added only so the loading state is visible during marking; the important part is that success, loading, and failure are all coded paths.

The fourth challenge was accessibility. Early forms used visible `<label>` text that was not associated with inputs, and the date picker had no label at all. Those gaps fail basic accessible-name rules (MDN Web Docs, n.d.). Labels now use `htmlFor` and matching `id` values. The header includes a skip link, the spinner exposes `role="status"`, filter chips use `aria-pressed`, and focus-visible outlines were added for keyboard users. This is not a full WCAG audit, but it addresses the brief’s semantic HTML, labels, and keyboard concerns.

The fifth challenge is deployment of an SPA. React Router’s `BrowserRouter` expects the host to return `index.html` for deep links such as `/catalog`. Without a rewrite, a refresh on that URL returns 404 from the static server. `vercel.json` and `netlify.toml` (plus `public/_redirects`) encode that rule so the deployed app can match the local build.

A remaining limitation is authentication: any non-empty student ID and password succeed. That is acceptable for a frontend-only mock, but it should be described honestly in the README so markers do not treat it as a security implementation.

## Industry relevance

Universities already run portals for room booking, laptop loans, and lab access. Those products are rarely built as one giant page. They are component-based frontends that read from inventory APIs, keep a session, and show the student a personal activity list. This assignment frontend is a reduced version of that pattern: browse inventory, apply constraints (date, maintenance), persist the basket of bookings, and edit a profile.

The same pattern appears outside education. Gym class booking, tool libraries, and municipal facility hire all need search, availability, and a “my reservations” view. Building that in React demonstrates skills listed in graduate frontend roles: routing, client state, form validation, responsive layout, and consuming data asynchronously (React, n.d.).

Using mock JSON is also industry-realistic during parallel development. Frontend teams often work against fixtures while the backend contract is still changing. Loading and error states are what distinguish a demo from a maintainable client.

The UI also had to look trustworthy. Campus services compete with email and paper forms; students will abandon a booking tool that feels like a student project. Consistent navy and blue, card layout, and immediate toast feedback after a booking or cancellation are small signals that the system registered the action. Those details sit under the rubric for information hierarchy, visual language, and meaningful feedback, not only under “it works.” In a workplace this would be followed by usability testing with a small student sample; for this assignment, desktop and mobile screenshots and keyboard tabbing were the practical checks.

## Individual reflection

### Aarju Pradhan

Working on this project changed how I think about React structure. Early on it was tempting to keep everything in one page file. Once bookings had to appear on both My Bookings and Profile, shared context became necessary. I also learned that “responsive” is not only CSS grid `auto-fit`. The desktop nav looked fine until the links overflowed on a narrow viewport; a dedicated menu button was the fix.

I am more confident with accessibility than at the start of the unit. Associating labels, giving the spinner an accessible name, and replacing `alert()` with on-page feedback are small changes that make the UI usable with a keyboard and with assistive technology. I would still add automated axe checks and unit tests if this were a workplace project.

If I continued the work, I would extract a custom `useCatalog` hook, add a confirm dialog before cancellation, and replace mock login with a real identity provider. Those were out of scope for the time available, but they are the next professional steps.

### [Member 2 — write in first person, 150–250 words]

Describe what you personally built or tested, what you found difficult, and what you would do differently. Do not copy another member’s paragraph.

### [Member 3 — write in first person, 150–250 words]

Describe what you personally built or tested, what you found difficult, and what you would do differently. Do not copy another member’s paragraph.

## AI use acknowledgement

Cursor (AI coding assistant) was used to implement and refactor frontend code, CSS, the README, screenshot capture support, and to draft this reflection and the team contribution template. AI was not used as a substitute for understanding the architecture: the team reviewed the generated code against the ICT930 brief, ran the application locally, and is responsible for the final submission. Grammar and structure suggestions from the assistant are also declared here, as required by the unit’s AI use policy.

Team members must edit the placeholder individual sections above in their own words before submission.

## References

MDN Web Docs. (n.d.). *Accessibility*. Mozilla. https://developer.mozilla.org/en-US/docs/Web/Accessibility

React. (n.d.). *Thinking in React*. Meta. https://react.dev/learn/thinking-in-react

React. (n.d.). *Passing data deeply with context*. Meta. https://react.dev/learn/passing-data-deeply-with-context

Vite. (n.d.). *Getting started*. https://vite.dev/guide/
