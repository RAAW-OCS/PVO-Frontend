# Poway Veterans Organization — Website Redesign
### Project Handoff & Status Document

> **Status:** 🚧 Early Exploration / In Progress  
> **Last Updated:** May 2026

---

## Overview

This project is an early-stage redesign and digital tooling effort for the **Poway Veterans Organization (PVO)**. The goal is to modernize the organization's web presence and build AI-assisted tools that help veterans navigate eligibility, connect with volunteers, and get quick answers to common questions.

The three components built so far can be found on this website: https://pvo.opencodingsociety.com/

---

## Project Files

### 1. `pvo-chatbot.html` — AI Chatbot
An AI-powered chat interface built with the **Groq API**. Designed to give veterans a conversational way to ask questions about PVO services, eligibility, events, and resources.

- **Tech:** Plain HTML/CSS/JS + Groq API
- **Status:** ✅ Mostly complete — minor refinements may remain
- **Key decisions:** Groq was chosen for its fast inference speeds, which keeps the chat feel responsive and natural
- **To run:** Open `pvo-chatbot.html` directly in a browser. Requires a valid Groq API key set in the file.

---

### 2. `prescreener.md` — Eligibility Prescreener
A prescreener flow to help veterans (or their families) quickly determine whether they may qualify for PVO services or programs before submitting a full application.

- **Status:** 🚧 In Progress — connected to the Flask prediction API and SQLite submission store
- **Purpose:** Reduce friction for new applicants and filter inquiries before they reach staff
- **Current focus:** Integrating the **Gemini API** to extract data from uploaded veteran IDs, improving accuracy of eligibility determination
- **Format:** Markdown file

---

### 3. `volunteer.md` — Volunteer Application Form
A form spec for prospective volunteers to express interest, share availability, and describe relevant skills or military background.

- **Status:** ✅ Complete
- **Purpose:** Streamline volunteer intake and give coordinators structured data to work with
- **Format:** Markdown file

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Plain HTML, CSS, JavaScript |
| AI / Chat | [Groq API](https://groq.com) |
| AI / ID Extraction | [Gemini API](https://ai.google.dev) |
| Backend | Python / Flask |
| Database | SQLite |

---

## Local Teacher Demo

The eligibility flow is served by Jekyll and calls the Flask `/api/veteran/predict` endpoint. The API validates the answers, predicts a routing estimate, and saves a submission to SQLite. The result is only a prescreening aid; PVO must confirm eligibility.

1. In `PVO-Backend`, create/activate a Python virtual environment and install `requirements.txt` if needed.
2. Start the Flask backend:
   ```bash
   cd PVO-Backend
   python main.py
   ```
   The API listens at `http://localhost:8426`; startup creates the prescreener tables in `instance/pvo.db`.
3. In a second terminal, start the frontend:
   ```bash
   cd PVO-Frontend
   bundle install
   bundle exec jekyll serve --host 127.0.0.1 --port 4000
   ```
4. Open `http://127.0.0.1:4000/prescreener`. Complete the questions and confirm the result says it was saved as a live submission.
5. Check `http://localhost:8426/api/veteran/submissions?limit=1` to verify the saved response.

When deployed, the prescreener calls the PVO backend at `https://pvoteam-api.opencodingsociety.com`. If the live service is unavailable, the page labels the browser-only estimate and asks users to confirm with PVO.

### Capstone Requirements

The capstone goal—helping veterans and their families navigate PVO services—drives these requirements:

- Keep the eligibility flow short, mobile-friendly, and understandable without technical knowledge.
- Accept only the supported service-area, need, and household answers; explain next steps rather than promise eligibility.
- Send the completed answers to the Flask API, show a clear service/error state, and persist successful submissions for PVO follow-up.
- Minimize collection of sensitive information in the prescreener and have PVO staff validate the routing recommendations before relying on them.

## How to Run

Follow the **Local Teacher Demo** steps above to run the Jekyll frontend and Flask backend together. The chatbot also requires its configured Groq API key.

**Which `.env`:** the one that matters is the backend's (`PVO-Backend/.env`, set up as its README describes). It holds the login secret, the admin accounts (`PVO_ADMINS`) and the Groq key. This repo's `.env` is read only by the OCS helper scripts in `scripts/` (GitHub and Kasm settings, same names as the backend README); the website never reads it. git ignores both, and any `.env.*` backups.

---

## What's Been Done

- [x] Volunteer form — complete
- [x] AI chatbot — mostly complete
- [x] Flask backend set up
- [x] SQLite database set up
- [x] Eligibility prescreener — connected to Flask prediction and SQLite persistence
- [x] Homepage hub with member login + survey at the top, member login page (with guest sessions), profile survey, admin tools, and community calendar
- [x] UI polish and mobile responsiveness for the PVO pages, built on the OCS design system
- [ ] Gemini API ID extraction and full end-to-end application submission
- [ ] Connect and validate all remaining forms against Flask routes and SQLite
- [ ] User testing with veterans

---

## Next Steps

### 🎨 UI Polish & Mobile Responsiveness
The current chatbot prototype is functional but unstyled for production. All three components need a cohesive visual design pass and should be fully responsive on mobile — many veterans access services from phones.

### 🗄️ Backend & Database Integration
A Flask backend and SQLite database are in place. The next milestone is wiring the volunteer form and prescreener up to it so that submissions are actually saved and accessible to staff.

### 👥 User Testing with Veterans
Before any wider rollout, the tools — especially the chatbot and prescreener — should be tested with real veterans and PVO staff to validate that the language, flow, and outputs actually serve their needs.

---

## PVO Site Structure

| Page | URL | Who can use it |
|---|---|---|
| Homepage: member login + survey bar, branches, hub, calendar | `/` | Everyone |
| Member Login: log in, create an account, continue as guest | `/member-login/` | Everyone |
| My Profile: the veteran profile survey (`#survey`), then the volunteer survey (`#volunteer-survey`) at the bottom | `/member-profile/` | Members and guests |
| Admin Tools: Events tab, and People & Roles (administrators only) | `/admin/` | Administrators and event organizers |
| Resource Hub (with the Veterans Crisis Line) | `/resources/` | Everyone |
| Employment Board | `/jobs/` | Everyone |
| Photos & Videos (pictures and clips from past events) | `/gallery/` | Everyone |
| Accessibility: the OCS Preferences (themes, text size, read-aloud voice and speed, translation) | `/accessibility/` | Everyone |
| PVO Assistant (full-page chat) | `/pvo-chatbot/` | Everyone |
| Request assistance (prescreener), Volunteer, Application Assist | `/prescreener`, `/volunteer`, `/pvo-application-assist` | Everyone |

- **Built only from Open Coding Society pieces.** Every PVO page uses the OCS design system; there is no PVO Sass and no `<style>` block or `style="..."` in any PVO page.
  - **Layout:** `layout: pvo` (`_layouts/pvo.html`) is a thin child of the OCS **Aesthetihawk** layout (`_layouts/aesthetihawk.html`): the OCS top bar, the OCS left sidebar menu, and the OCS Preferences script on every page. At 768px wide and below (phones and portrait tablets, where OCS `lesson-player.scss` switches to the full-width layout) the sidebar opens from the **Menu** button. If the menu is missing (for example a `jekyll serve` started before `_config.yml` changed), the layout leaves the sidebar and its space out.
  - **Components:** OCS buttons (`small` / `medium` / `large` + `primary`, `secondary`, `filledTinted`), OCS card panels (`p-4 rounded-lg bg-neutral-800 border border-neutral-700`, recoloured by the OCS themes), `.glowOnHover` tiles, `.login-container` / `.login-card` / `.signup-card`, `.form-group` fields, `.switch` toggles, `.overall-status` messages (`error`, `success`, `partial`), the OCS calendar (FullCalendar 5.11 styled by `calendar.scss`, as on the OCS Calendar page), the OCS chat window (`.msger`, `.msg`) and the OCS modal (`.modal`, `.modal-content`, `.close`).
  - **Arrangement:** Tailwind utility classes, as OCS pages use them (the Aesthetihawk layout loads Tailwind).
  - **Contrast rules for OCS buttons** (measured against WCAG AA): on a `<button>`, use `primary` (main actions) or `secondary`; on a link, use `filledTinted primary` (main actions) or `primary`. OCS forces link text to its link blue, so `filledHighlight` (any element), `filledTinted` on a `<button>`, and `secondary` on a link are too faint to read.
  - **Two OCS quirks handled with Tailwind:** OCS `calendar.scss` hides every `h1` site-wide, so PVO headings carry `!block`; Tailwind resets paragraph margins, so paragraphs carry `my-3` / `mb-6`. Links inside sentences are underlined (the wrapper in `_layouts/pvo.html`), because OCS removes link underlines.
  - **OCS themes flatten grey backgrounds.** Once a visitor picks any theme, OCS `user-preferences.scss` paints every element whose class contains `bg-neutral` the panel colour, with `!important`, including state classes such as `[&.active]:bg-indigo-500` on that element. Anything that must stand out from its card, such as a progress track, step dots or a chat bubble, gets an outline (`border border-neutral-700`, which the themes recolour to their border shade) and no `bg-neutral` class on the part that changes colour. Progress bars are `<progress>` elements whose value the script sets, not widths in a `style` attribute.
  - **Colours:** the highlight colour is the Aesthetihawk sidebar's `indigo-500`; greys are the Tailwind `neutral` shades the OCS themes recolour. The only hex colours in PVO files are the PVO emblem drawing, the OCS default accent as a fallback in `reader.js`, and the white background painted behind photos when the admin page shrinks them to JPEG.
- **Menu:** the sidebar comes from `pvo_menu` in `_config.yml`: sections of items with an `id`, `title`, `url`, `icon` (a name from `_data/aesthetihawk_icons.yml`) and optional `show` (`signed-in`, `signed-out`, `staff`). A page with `active_tab: <id>` highlights its item. After editing `_config.yml`, restart the site with `make stop`, `rm -f .jekyll-metadata`, `make`. `make` runs the server in the background, so Ctrl+C does not stop it. `--incremental` skips pages whose files did not change, so it keeps the old menu unless `.jekyll-metadata` is removed. The top bar shows **Accessibility**, **Member Login** (signed out) or **Welcome, name**, **Admin** (administrators and event organizers) and **Log out** (signed in), from `_includes/pvo/header-links.html`.
- **Branches:** the seven branches at the top of the homepage come from `_data/pvo_branches.yml` (name, colour, motto, link). Their emblems are original drawings, not official seals. If PVO gets permission to use official insignia, add an `image:` path to each entry.
- **Scripts:** `assets/js/pvo/` (`site.js` runs on every PVO page; each page loads its own script through `pvo_script` in its front matter).
- **Resource Hub and Employment Board content:** edit `_data/pvo_resources.yml` and `_data/pvo_jobs.yml`. Only post real job openings, with the employer's permission. The board shows a note when there are none.
- **Photos & Videos:** once an event's date has passed, if it has a picture (uploaded, or a YouTube or `.mp4` link in the picture field) it appears on `/gallery/` and in "From recent events" on the homepage. Upcoming events stay on the calendar only.
- **Adding events:** sign in as an administrator or event organizer, open **Admin**, and use **Post an event** (title, date, start/end time, place, description, optional picture or video). Published events appear on the homepage calendar right away. The calendar's **Coming up** list (the first view on phones) leaves out events that already ended earlier today; the **Month** view still shows them.
- **Surveys:** the veteran profile survey (service, interests, how they like to meet up, about me, accessibility needs, and a consent switch for introductions) helps PVO connect veterans with shared interests. The volunteer survey (kinds of help, availability) is separate and optional. Each form saves only its own answers.
- **Log in:** members sign in with their **username** (any capitalisation) or the **email** on their account, not their display name. The backend refuses a login that matches more than one account.

### Accessibility

Accessibility comes from the **Open Coding Society Preferences** (`assets/js/user-preferences.js`, `window.SitePreferences`), the same system as the OCS Dashboard. There are two ways in, and both save the same OCS settings in the visitor's browser, so they always agree and apply on every page.

**Accessibility toolbar:** the **Accessibility** button in the top bar, or the round button at the bottom left that stays on screen. Files: `_includes/pvo/a11y-panel.html` (OCS buttons, `.switch` toggles and `.form-group`), `assets/js/pvo/a11y.js`, `reader.js` and `a11y-boot.js`.

| Feature | What it does |
|---|---|
| Text size | 100%, 115%, 130%, 150%. This is the OCS text-size preference, so OCS buttons grow with the text too (`user-preferences.scss`). |
| Colour theme | Dark, Light, Warm, Navy, High contrast. These are the OCS presets Site Default, Light, Sepia, Midnight and High Contrast (white on black with yellow links). |
| Read aloud | **Read this page** starts at the part on screen and outlines each paragraph as it reads. **Read selected text** reads only what you highlighted. A player has **Pause / Resume** and **Stop**. Speed is Slower, Normal or Faster; this is the OCS speech speed, so a speed set on the Accessibility page shows here too. It uses the OCS speech engine. |
| Reading aids | **Underline all links**, **Extra line spacing**, **Reduce motion**. These are Tailwind classes on `<body>` that are applied before the page shows. |
| Reset all | Clears the OCS preferences and the reading aids. |

Settings saved by the earlier PVO toolbar are moved over the first time someone visits.

**Accessibility page** (`/accessibility/`): the full OCS Preferences panel, shared with the Dashboard through `_includes/aesthetihawk/preferences.html`. On PVO it keeps choices on the device and leaves out the Ask AI panel. It has:
- voice, pitch and volume;
- fonts and custom colours;
- your own saved themes;
- button style;
- page translation (Google Translate).

**Keyboard and screen readers:**
- skip link;
- labelled menu and main areas;
- calendar events open with Enter or Space;
- the modal and the toolbar move focus in, and return it when closed (Escape closes both);
- every form field has a label;
- the chosen size and theme are marked with a check, not only with colour.

**Contrast:** the default look and all five toolbar themes pass an automated WCAG 2.1 AA check (axe-core) on every PVO page. That includes the event modal, the assistant, the toolbar, the read-aloud player and the admin views. Getting the themes there took changes to OCS itself:
- The OCS theme Sass (`_sass/open-coding/user-preferences.scss`) now gives buttons, the top bar, tables and the glow tiles the theme's own colours. They used to keep fixed dark-mode greys, which made dark text unreadable on light themes.
- Buttons on strong colours keep white text.
- The Light, Sepia and Midnight presets have link and text colours that pass, and the grey for muted text on light themes is darker.

**Login buttons** (the homepage bar and the Member Login page) stay disabled until the page's script is ready. Without this, an early click did nothing, and an early **Log in** put the password in the address bar.

The Veterans Crisis Line (988, then press 1; text 838255) is in the footer of every PVO page and at the top of the Resource Hub.

### Roles

The stored role name (backend `users._role`) is on the left; the site shows the label in brackets.

| Role | Who | Can do |
|---|---|---|
| `Admin` (Administrator) | PVO administrators | Post, edit, and delete events (with a picture or video), and give anyone a role on **Admin → People & Roles**. Cannot change their own role. |
| `Organizer` (Event organizer) | People who run events | Post, edit, and delete events. Sees only the Events tab; cannot change roles. |
| `Veteran` (Veteran) | Veterans and service members | Member account: profile and surveys. |
| `Family` (Family member) | Family of a veteran | Member account. |
| `Volunteer` (Volunteer) | Volunteers and supporters | Member account. |
| `User` (Member) | Everyone else (the default) | Member account. |
| `Guest` (Guest) | "Continue as guest" | Temporary session; can fill out the survey. Removed after 7 days. Cannot be given a role. |

How people get a role:
- **Member types** (Veteran, Family member, Volunteer, Member) are chosen by the person: on the sign-up form ("I am joining as"), and again whenever they answer "Your connection to the military" in the profile survey (Veteran, Active duty, or Guard or Reserve → Veteran; Family member → Family member; Volunteer or supporter → Volunteer). The survey never changes an Administrator's, Event organizer's, or Guest's role.
- **Administrator and Event organizer** are only given by an administrator, on **Admin → People & Roles**. Sign-up refuses them.
- To make the first administrator, set `ADMIN_UID` / `ADMIN_PASSWORD` in the backend `.env` and run `flask custom generate_data`, or update `_role` to `Admin` for that user in the database.

The role names and labels the pages use are in `assets/js/pvo/api.js` (`roleLabel`, `MEMBER_TYPES`, `ASSIGNABLE_ROLES`). The backend must use the same names.

### Backend endpoints used by these pages

| Endpoint | Purpose |
|---|---|
| `POST /api/authenticate`, `DELETE /api/authenticate` | Sign in / sign out (JWT cookie) |
| `GET /api/id` | Current user and role |
| `POST /api/user/guest` | Create a member account (optional `role`: a member type) |
| `POST /api/guest/session` | Start a guest session |
| `GET`/`PUT /api/profile/survey` | Read / save the veteran profile and volunteer answers (new columns are added on startup). Saving `affiliation` also sets a member's member type. |
| `GET /api/events` | Public calendar |
| `POST /api/events`, `PUT`/`DELETE /api/events/<id>` | Admin or Organizer: manage events |
| `POST /api/events/image` | Admin or Organizer: upload an event picture |
| `GET /api/admin/users`, `PUT /api/admin/users/<uid>/role` | Admin: list people, change roles |

Backend tests for these live in `PVO-Backend/testing/test_pvo_community.py` (`venv/bin/python testing/test_pvo_community.py`).

---

## Notes for the Next Person

- The backend is **Flask (Python)** — keep dependencies minimal and documented in a `requirements.txt` so the next person can get up and running with `pip install -r requirements.txt`.
- The chatbot uses **Groq** (not OpenAI or Anthropic) — the API interface is similar but the base URL and model names differ. Check [Groq's docs](https://console.groq.com/docs) if you need to swap models. The Groq API key should be stored as an environment variable, never hardcoded.
- The [member login page](./navigation/member-login.md) creates username-based accounts through `/api/user/guest` and authenticates against the Flask backend's `/api/authenticate` endpoint. The backend sets the login cookie; PVO pages check `/api/id` for the signed-in user and role. Hiding admin links in the browser is only for convenience. The backend enforces who can post events and change roles.
- This is a volunteer/community project — keep solutions simple and maintainable by non-engineers where possible.

---

## Contact / Contributors

> *Alice Li @alicewrli009
> Brandon Cheah @BrandonCheah153*

---

*Poway Veterans Organization — Serving those who served.*
