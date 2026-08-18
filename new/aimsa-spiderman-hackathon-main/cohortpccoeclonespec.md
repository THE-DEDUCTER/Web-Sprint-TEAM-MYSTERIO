# Cohort PCCOE — Clone Specification

Source crawled: https://www.cohortpccoe.in/ (public landing page + authenticated `/dashboard/*` app), August 2026.

This document is written so it can be handed directly to an AI coding agent ("Claude Code") as the spec to rebuild the product as closely as possible. It covers: tech stack signals, information architecture, page-by-page UI/UX detail, data model inferred from the UI, and component behavior notes.

---

## 1. Product Summary

**Cohort** is a campus-only social platform built for Pimpri Chinchwad College of Engineering (PCCOE), Pune. Tagline: *"A Social Platform for PCCOE."* It aggregates 30+ student clubs/communities, encrypted 1:1 messaging, an anonymous meme/exchange feed, an interactive 3D-style campus map, an academic calendar, a student profile/portfolio system, a notifications hub, and a mini arcade (Chess/Tic-Tac-Toe/Sudoku), plus an AI chat assistant named "Buddy."

Stated tech stack (from the site's own "About" copy — treat as a strong hint, not gospel): **React** (frontend), **Supabase** (backend/auth/DB/storage), **real-time WebSocket connections** (for chat/feed), **TomTom Maps API** (interactive campus map), **Google OAuth** ("Sign in with Google") as the sole auth method.

Brand identity:
- Logo: a colorful interlocking "atom/knot" ring icon (multi-color gradient: blue, pink, orange, green, purple strands looping in a sphere shape) used as both the browser loading splash and sidebar logo.
- Primary accent: indigo/blue (`#4F46E5`-ish) for headline text and primary buttons; supporting gradient of purple-pink-teal on cards/badges (e.g., "Send Message" button, banners).
- Typography: bold, rounded sans-serif for headlines (large/black weight), clean sans-serif body text.
- Decorative motif: faint grayscale line-art illustrations of a sitting/climbing figure scattered around empty page whitespace (looks hand-drawn, low-opacity) — a recurring background decoration across almost all screens.
- Dark/light theme toggle (moon/sun icon) available on both marketing site and app.

---

## 2. Public Marketing Site (unauthenticated, `/`)

### 2.1 Header (sticky, translucent white)
- Left: logo icon + wordmark "Cohort" + a small greyed-out sub-word after it (appears to be a stylized "PCCOE" mark rendered as a decorative signature/logo, blurred/artsy in the screenshot).
- Right: theme toggle (moon icon) + **"Sign in with Google"** pill button (white bg, border, Google "G" icon) → routes to `/login`.

### 2.2 Hero Section
- Two-column layout.
- Left column:
  - H1 (huge, bold, indigo-blue, 3 lines): **"A Social Platform for PCCOE"**
  - Paragraph (grey): *"Aggregate discussions, campus navigation, and encrypted messaging in real time. Monitor events and track opportunities—all without juggling multiple logins."*
  - Two CTA buttons: **"Get Started"** (solid black/dark pill, white text) and **"Explore platform"** (light grey/white pill, outlined) — both link to `/login`.
- Right column: a floating "browser window" mock card (rounded corners, traffic-light dots top-left) containing a fake analytics widget:
  - Label: "TOTAL PROJECT VIEWS"
  - Big stat: "11,461" with an eye icon, plus a green "+4.2%" pill with an up-trend arrow icon
  - "Updating in realtime" caption
  - A small bar chart (8-10 bars, ascending trend, light blue/indigo bars)
- Background: soft blurred gradient blob (pink/purple/white), faint line-art figure illustrations bottom-left and right margins.

### 2.3 Marquee / Ticker Strip
Two rows of horizontally auto-scrolling content directly under the hero:
1. Row of community/club name chips (logos + text), looping: OWASP, GDGC, ACM, LFDT, IOT Club, Geeks For Geeks, AIMSA, ISR, NSS, Art Circle (repeats).
2. A second marquee strip of repeating text separated by a diamond/sparkle glyph: **"COHORT SOCIAL ✦ CONNECT ✦ DISCOVER ✦ NAVIGATE ✦"** looping continuously.

Implementation note: classic CSS `@keyframes` infinite horizontal scroll (translateX loop), duplicated content for seamless loop.

### 2.4 "Explore Platform Features" Section
- Section intro: H2 "Explore Platform Features" + subtext "From encrypted messaging to real-time campus navigation, discover all the tools designed to empower your social experience."
- Grid of 8 feature cards (icon + title + 1-2 sentence description each):
  1. **Home Feed** — "Stay updated with a personalized feed of posts, announcements, and discussions from your subscribed communities and friends across campus."
  2. **Communities** — "Discover and join 30+ student-run clubs and organizations at PCCOE — from OWASP and GDGC to Art Circle and NSS."
  3. **Friends** — "Build your campus network by adding friends, viewing their activity, and staying connected through shared communities."
  4. **Connect** — "Real-time encrypted messaging with end-to-end privacy. Chat one-on-one or in group conversations with fellow students."
  5. **XD (Exchange)** — "An anonymous exchange board where students share honest thoughts, campus tips, and creative ideas freely."
  6. **Campus Maps** — "Interactive 3D campus navigation powered by TomTom — find classrooms, labs, cafeterias, and event venues instantly."
  7. **Academic Calendar** — "Never miss an exam, holiday, or submission deadline. Sync your academic schedule and get timely reminders."
  8. **Student Profile** — "Showcase your achievements, certifications, and hackathon wins. Build a professional portfolio visible to peers and faculty."

### 2.5 "About Cohort PCCOE" Section
Long-form marketing copy (4 paragraphs) covering: official student platform for PCCOE, 350+ active users, aggregates 30+ communities, Connect (E2E encrypted messaging), XD/Exchange anonymous board, TomTom campus map, academic calendar, achievement profiles, tech stack callout (React/Supabase/WebSockets), and a privacy/security closing statement.

### 2.6 Auth Flow
- Both "Get Started" and "Explore platform" and the header "Sign in with Google" button all route to `/login`.
- `/login` shows only the branded loading spinner (the interlocking-rings logo) while it silently attempts Google OAuth / session restore, then redirects straight into `/dashboard` if a session exists (no visible login form was observed once already authenticated — implement a standard "Sign in with Google" button screen for the logged-out state, since we only saw the authenticated redirect).

---

## 3. Authenticated App Shell (`/dashboard/*`)

### 3.1 Layout
Three-column persistent shell:
1. **Left icon rail** (fixed, ~64px wide, white bg, icons stacked vertically, top-to-bottom):
   - Logo (top, links to `/dashboard`)
   - Home (house icon) → `/dashboard`
   - Network / Friends (people icon, badge showing unread count e.g. "2") → `/dashboard/network`
   - Communities (icon looks like overlapping blob/heart shape) → `/dashboard/communities`
   - Connect / Chat (speech-bubble-with-lines icon) → `/dashboard/connect`
   - XD/Exchange (lightning bolt icon) → `/dashboard/xd`
   - Campus Map (person/pin icon) → `/dashboard/map`
   - Calendar (calendar icon) → `/dashboard/calendar`
   - Arcade (game controller icon) → `/dashboard/arcade`
   - Notifications/Headsup (bell icon, red badge with unread count e.g. "4") → `/dashboard/headsup`
   - Contact (chat/message-square icon) → `/dashboard/contact`
   - Profile (person icon) → `/dashboard/profile`
   - Bottom: theme toggle (moon/sun)
   - Active route: icon gets a filled blue rounded-square background.
2. **Center content column**: page-specific content, header row with page title formatted as `c/<pagename>` (Reddit-style breadcrumb naming, e.g. "c/home", "c/communities", "c/network", "c/connect", "c/maps", "c/calendar", "c/arcade", "c/headsup", "c/contact") + one-line description subtitle. A small decorative line-art figure icon sits next to the title on most pages.
3. **Right sidebar** (persistent widget rail, ~270px):
   - Search bar at top: "Search cohort..." with ⌘K shortcut hint → opens a command-palette modal (see 3.2).
   - **C/COMMUNITIES** widget: top 3 subscribed/suggested communities with icon, name, "→" see-all link.
   - **C/FRIENDS** widget: up to 3 friends with avatar, name, @handle.
   - **C/CONNECT** widget: quick links to start chats with the same friends (name + handle, no avatar).
   - **C/CALENDAR** widget: "No upcoming events" empty state or list.
   - **C/HEADSUP** widget: "Important" labeled banner, e.g. "Full access will soon require PCCOE account login" (site-wide announcement banner reused everywhere).
   - Floating circular "Buddy" AI assistant launcher button, bottom-right of viewport, all pages (colorful ring/avatar icon).

### 3.2 Command Palette (⌘K / click search)
Modal, centered overlay, blurred backdrop. Search input placeholder: "Search pages, communities, projects…". Below it a "PAGES" section listing all nav destinations with icon + title + one-line description:
- Home — "Your feed and posts"
- Communities — "Join discussions and connect"
- Friends — "Alumni & student connections"
- Connect — "Encrypted chats with cohort users"
- Campus Map — "Navigate PCCOE campus"
- Shop — "Buy, sell, and trade" (marketplace feature referenced in posts as "Marketplace" — route not live yet at crawl time, returns 404 directly; treat as planned/upcoming feature, gate behind a "coming soon" state)
- Calendar — "Academic events & schedule"
- (list continues, likely also XD/Arcade/Headsup/Contact/Profile)
Footer hints: "↑↓ navigate", "↵ select", "esc close".

### 3.3 Buddy AI Assistant (chat widget)
Floating action button bottom-right → opens a chat popover:
- Header: "Buddy" with an icon avatar.
- Greeting message: *"Hey, I'm Buddy — your campus assistant for Cohort. I can search users, communities, and features live. 👀"* (also appeared as a "seed" post from user @cohortbuddy on the home feed introducing itself in first person with the same "no promises about being nice" personality line).
- Input box at bottom: "Ask Buddy anything…"
- Implementation: likely an LLM-backed assistant with tool access to the app's own search/index (users, communities, pages) — build as a simple RAG/tool-calling chat backed by your own site index; personality is a bit sassy/deadpan per the sample copy.

---

## 4. Page-by-Page Detail

### 4.1 Home Feed — `/dashboard` (title: "c/home")
- Composer card at top: avatar (colored circle with user initial) + textarea placeholder "What's on your mind? Type @ to tag users or communities" + "Attach" (image icon) + "Cancel"/"Post" buttons (Post is disabled/light-blue until text entered).
- Below: reverse-chronological list of posts (community-wide feed), each post card:
  - Avatar, display name (bold), @handle, "· <date>" (e.g. "· 6 May")
  - Post body text (supports emoji, line breaks, @mentions rendered as blue links, plain URLs auto-rendered as a rich "link preview" chip showing favicon/icon + shortened URL + domain, e.g. Google Drive links)
  - Heart/like button with count, top-right of card
  - "N Reply/Replies" expandable thread — clicking reveals nested replies (avatar, name, handle, text, date) and a reply input box ("Write a reply… Type @ to tag someone") with a send icon button
  - Posts can mention multiple users with `@handle` and communities with `@handle`
- Feed content is realistic seed/demo data: club announcements (exam solutions via Drive links), feature-launch announcements ("Messaging has arrived on Cohort", "Profile pictures are now customizable", "New on Cohort: Arcade", "You can now sync your LinkedIn certifications into your Flex"), casual greetings, and welcome messages from founding "admin" users.
- Empty state (new/unseeded account): centered text "No posts yet. Be the first to share something!"

**Data model inferred:** `posts(id, author_id, body, created_at, attachments[], mentions[])`, `post_likes(post_id, user_id)`, `replies(id, post_id, author_id, body, created_at)`.

### 4.2 Communities — `/dashboard/communities` (title: "c/communities")
- Subtitle: "Join discussions and connect with your peers."
- Filter control top-right: "Department:" dropdown — options: All Departments, Student Development and Welfare (SDW), COHORT Special, AIML Department, CIVIL Department, Computer Department, Computer Regional Department, ENTC Department, IT Department, Mechanical Department.
- Content grouped into department sections, each with a header (department name) + "Subscribe All" bulk-action button (except "COHORT Special" which shows "Subscribed" badge state), then a grid/list of community cards:
  - Circular logo/avatar
  - Name (bold)
  - `@handle`
  - 1-2 sentence description
  - Member count ("N members")
  - Optional "NEW" badge tag on some cards
- Loading state shows a spinner + "Loading communities…" text before data resolves (client-side fetch from Supabase presumably).
- **Departments & sample communities observed** (use as realistic seed data, ~30 orgs total):
  - SDW: Institution's Innovation Council (@iicpccoe), Institutional Social Responsibility (@isrpccoe), International Relations Cell (@ircpccoe), National Service Scheme (@nsspccoe), PCCOE Art Circle (@artcirclepccoe), PCCOE Sports Cell (@sportscellpccoe), Student Development and Welfare (@sdwpccoe), Students Welfare Grievance Handling Cell (@swadcellpccoe)
  - COHORT Special: COHORT — A Social Platform for PCCOE (@cohort, 410 members, subscribed), PCCOE Study Groups (@studygrouppccoe, NEW), PCCOE Tech Club (@pccoetechclub), Photography Club (@photography, NEW), Placement Preparation Club (@pccoeplacements)
  - AIML: AAAI Student Chapter (@aaai), Abhyudaya E-Cell (@abhyudayapccoe), AIML Student Association (@aimsapccoe), Geeks For Geeks (@gfgpccoe), Higher Studies Club CAT/GMAT (@higherstudies), Higher Studies Club UPSC/MPSC (@higherstudiespccoe), IEEE Computer Society (@ieeecs), International Neural Networks Society (@innspccoe), PCCOE IEEE Computational Intelligence Society (@ieeepccoe)
  - CIVIL: Civil Engineering Student's Association (@ciesapccoe)
  - Computer: CodeChef (@codechefpccoe), Computer Engineering Student Association (@cesapccoe), Google Developer Groups PCCoE (@gdgcpccoe), IOT Club (@iotclubpccoe), LFDT Student Chapter (@lfdtpccoe), OWASP (@owasppccoe), PCCOE ACM Student Chapter (@acmpccoe), PCCOE ACMW Student Chapter (@acmwpccoe)
  - Computer Regional: Computer Regional Student Association (@cresapccoe)
  - ENTC: ENTC Student Association (@etsapccoe)
  - IT: IEEE Student Branch (@itsapccoe), Microsoft Learn Student Chapter (@mlscpccoe)
  - Mechanical: ISHRAE Student Chapter, Mechanical Engg Students Association, Team Ambush, Team Automatons, Team Kratos Racing, Team Maverick, Team Red Baron, Team Solarium India, The Institution of Engineers PCCOE

#### Community Detail — `/dashboard/communities/@<handle>`
- Full-width banner image (club-specific graphic).
- Below banner: circular logo, community name (H1), `@handle` with small Instagram + LinkedIn icon links (if the club has social links), a share icon button, and a **Subscribe** button (gradient blue pill, "+person" icon).
- Description paragraph, member count with people-icon.
- "Are you a club lead?" info callout box (light blue bg, info icon): *"If you are the official lead for this club, you can get admin access to manage this page. Contact the developers via the contact form to get started."* — "the contact form" is a link to `/dashboard/contact`.
- "Recent activity" section header, then either community-specific posts or an empty state: sparkle icon + "Community posts starting soon!" + "Stay tuned for upcoming discussions, events, and announcements from this community."
- Back arrow (top-left) returns to `/dashboard/communities`.

**Data model:** `communities(id, handle, name, description, department, logo_url, banner_url, instagram_url, linkedin_url, member_count)`, `community_subscriptions(community_id, user_id)`.

### 4.3 Network / Friends — `/dashboard/network` (title: "c/network")
- Subtitle: "Discover, connect, and build your campus network."
- 4 action tiles in a row, each an icon illustration + label: **Alumni Connect**, **Discover Students**, **Build Connections**, **View Profiles** (likely link to filtered views of the same directory or open modals).
- "Students" section header with a search/magnifier icon (top-right of section).
- Grid of student cards: circular avatar (colored initial or photo), `@handle` below, blue **Follow** button beneath each.

**Data model:** `users(id, handle, display_name, avatar_url, department)`, `follows(follower_id, followee_id)`.

### 4.4 Connect (Encrypted DMs) — `/dashboard/connect` (title: "c/connect")
- Subtitle: "Encrypted chats for cohort users."
- Two-pane layout:
  - Left pane: search box ("Search") + list of conversation threads (avatar, name preview) — empty state while loading.
  - Right pane empty state: shield-with-checkmark icon, "Start a secure conversation" heading, body: *"Pick any cohort user from the left to open an encrypted chat. Messages auto-disappear 30 seconds after read."*
- Route supports deep link `?user=<handle>` to preselect a conversation (e.g. `/dashboard/connect?user=shravan24`), triggered from sidebar "C/CONNECT" widget quick links.
- **Feature spec implied by copy**: end-to-end encrypted 1:1 (and per the marketing copy, group) messaging; messages are ephemeral — auto-delete/disappear 30 seconds after being read (Snapchat-style). Should be implemented with a real-time channel (WebSocket/Supabase Realtime) and a client-side timer that removes the message from view/store after read-receipt + 30s.

**Data model:** `conversations(id, user_a, user_b)`, `messages(id, conversation_id, sender_id, body_ciphertext, sent_at, read_at, expires_at)`.

### 4.5 XD / Exchange — `/dashboard/xd` (no visible title text captured, uses full-bleed layout)
- Full-viewport vertical swipe feed (TikTok/Reels-style), one meme/content card at a time.
- Top-left: category/tag pill, e.g. "# Programming" with a hash icon.
- Top-right: two icon buttons — share icon and a refresh/shuffle icon (loads next set / re-rolls category).
- Main content area: large meme image/video (sourced from external meme sites, e.g. imgflip.com content mixed with YouTube video sources — "Source" button opens original link).
- Right-edge vertical action rail (like an Instagram Reels UI): **Like** (heart icon + label), **Source** (external-link icon + label, opens original post/video), **Share** (share icon + label).
- Bottom-center: a down-chevron button to advance to the next card (swipe-down equivalent).
- This is the "anonymous exchange board" feature per marketing copy, but the implementation observed behaves like a curated meme/content swipe feed filtered by topic tag rather than user-generated anonymous posts — implement both: (a) an anonymous text/image posting board (per marketing description) AND/OR (b) this swipeable tagged-content feed. Recommend building the swipe-feed UI since that's what's actually live, backed by a `xd_items` table seeded with meme/content URLs grouped by tag, with per-user like state.

**Data model:** `xd_items(id, tag, media_url, source_url, media_type)`, `xd_likes(item_id, user_id)`.

### 4.6 Campus Map — `/dashboard/map` (title: "c/maps")
- Subtitle: "Interactive internal campus map for PCCOE."
- Full-width embedded interactive map, attribution "©TomTom" bottom-right — confirms **TomTom Maps SDK (JS)** is the mapping provider.
- Custom colored circular pin markers of varying colors (blue, purple, green, orange/red, grey) scattered across campus, representing different POI categories (likely: buildings/classrooms, food stalls, ATM, sports facilities, hostels, bus stops — labels visible on base map include "Sangeeta Medical", "Axis Bank", "Cafe Lifeline", "R R Tea Corner", "Badminton Court", "Pimpri Chinchwad College of Engineering", "Western Union", bus stops, apartment names).
- Pins are clickable (implied) to show POI info (name, category, maybe photo) — build as a marker + popup pattern.
- Zoom/pan native TomTom controls (small "-/+" and geolocate control implied bottom-right corner cropped in capture).

**Implementation note:** Use TomTom Maps SDK for Web (`tt.map`), custom marker icons colored by POI category, a POI dataset (`map_pois(id, name, category, lat, lng, icon_color)`) seeded with real campus locations (classrooms, labs, cafeteria, ATM, medical, sports courts, hostel/bus stops).

### 4.7 Academic Calendar — `/dashboard/calendar` (title: "c/calendar")
- Subtitle: "Academic events and important dates."
- Classic month-grid calendar component:
  - Header: "<Month Year>" (e.g. "August 2026") with prev/next chevron arrow buttons.
  - 7-column week grid (Sun–Sat), 6 rows, leading/trailing days from adjacent months rendered greyed-out/muted.
  - Today's date cell highlighted (blue circle around date number, cell has blue border box).
  - Cells appear otherwise empty in seed data (no events) — "No upcoming events" also shown in the sidebar widget elsewhere.
- Should support event dots/badges per day when academic events exist, and a click-to-expand day detail (exam, holiday, deadline) per the marketing copy ("exam schedules, holidays, and submission deadlines" with reminders).

**Data model:** `academic_events(id, title, date, type[exam|holiday|deadline], description)`.

### 4.8 Arcade — `/dashboard/arcade` (title: "c/arcade")
- Subtitle: "Quick browser games you can play inside cohort."
- Game selector cards: **Chess** ("You vs Buddy AI"), **Tic-Tac-Toe** ("Play against Buddy AI"), **Sudoku** ("Fill the 9x9 grid"), plus a "More games coming soon!" placeholder card.
- Chess view (default/selected): standard 8x8 board rendered with Unicode chess glyphs, "You are White. Buddy AI is Black." caption, controls: "Play White" / "Play Black" toggle buttons, "Reset board" button, turn indicator ("Your turn"), and a caption: *"Current chess mode supports castling, core movement, captures, and pawn promotion to queen."* (no en passant / underpromotion — good scoping note for the clone).
- Implementation: client-side chess engine + simple AI opponent ("Buddy AI" — could be a basic minimax/random-legal-move bot, doesn't need to be strong); Tic-Tac-Toe vs simple AI; Sudoku puzzle generator/validator with a 9x9 fillable grid.

### 4.9 Notifications ("Headsup") — `/dashboard/headsup` (title: "c/headsup", shows "N unread" badge next to title)
- Subtitle: "Your personalized notifications, recommendations, and updates."
- Top-right: "Mark all read" button (checkmark icon).
- List of notification cards, each: icon (category-specific, e.g. people icon for "People" type), category pill ("People"), relative timestamp ("7h ago", "18h ago") with an unread blue dot, bold headline ("You may know @<handle>"), body text (e.g. "<Full Name> is active on Cohort. Follow to stay updated."), and two actions: **"View profile"** (blue button, external-link icon) and **"Mark read"** (outline button).
- Observed notification type in seed data: "People you may know" suggestions only — architecture should support additional types (community activity, mentions, likes, replies, event reminders) all sharing this card layout with a `type` discriminator driving icon/pill/copy.

**Data model:** `notifications(id, user_id, type, ref_id, title, body, created_at, read_at)`.

### 4.10 Contact — `/dashboard/contact` (title: "c/contact")
- Subtitle: "Have a question, suggestion, or just want to say hello? We'd love to hear from you."
- Form card: NAME field (prefilled from profile, e.g. "Veerbhadra Mahant"), EMAIL field (prefilled, e.g. "veerbhadra.mahant24@pccoepune.org" — note: college email domain pattern `<name>.<name><year>@pccoepune.org`), MESSAGE textarea with a live character counter ("0/1000"), gradient **"Send Message"** button (blue-to-teal gradient, paper-plane icon).
- Below form: "MEET THE TEAM" section header (content not fully loaded in crawl — implement as a small team-credits grid, e.g. avatar + name + role for the 2-3 founders mentioned in posts: Chirag Ferwani, Vrushabh Hirap, Anushka Shinde).

**Data model:** `contact_messages(id, user_id, name, email, message, created_at)`.

### 4.11 Profile — `/dashboard/profile` (own profile) and `/dashboard/profile/<handle>` (public view)
- Banner image (full-width gradient/photo cover), top-right badge chip showing role, e.g. **"COHORT USER"** or **"COHORT ADMIN"** (with a checkmark/verified icon) — role-based badge styling (different icon/color per role).
- On admin/notable profiles, a decorative rotating circular "seal" badge appears near the banner (text going around in a circle reading "COHORT SOCIAL •" repeated) plus a department tag chip (e.g. "CSE(AIML)") — a nice-to-have flourish.
- Avatar: large rounded-square, colored background with a single-letter initial (if no photo), small camera-icon button overlay bottom-right of avatar (own profile only) for changing photo.
- Name (H1, bold) + `@handle` beneath.
- Action row (own profile): pencil "Edit profile" icon button, LinkedIn icon, message/chat icon, mail icon, and a red-text **"Sign out"** button.
- Action row (other user's profile): LinkedIn icon, WhatsApp icon, chat icon, mail icon, and a **Follow / Following** toggle button (pill, state changes color+label).
- Stats row: 4 equal cards, each an illustrated icon + big number + caption label: **COMMUNITIES**, **FOLLOWERS**, **FOLLOWING**, **FLEX** ("Flex" = achievements/certifications/portfolio items count per marketing copy).
- **Activity** section: tab switcher "Posts (N)" / "Replies (N)", below it the user's own posts/replies rendered in the same post-card style as the home feed (including nested reply threads). Empty state: "No posts yet."
- Edit Profile modal (pencil icon, own profile only): modal titled "Edit Profile" with fields — NAME (text), USERNAME (text, `@` prefixed), DEPARTMENT (select dropdown, placeholder "Select Dept"), WHATSAPP (tel input, placeholder "91XXXXXXXXXX"), LINKEDIN USERNAME (text input with prefixed label "linkedin.com/in/", placeholder "your-linkedin-username"). Footer buttons: "Cancel" (grey) and "Save Changes" (blue, save icon).

**Data model:** `users(id, handle, display_name, avatar_url, banner_url, department, role[user|admin], whatsapp, linkedin_username, communities_count, followers_count, following_count, flex_count)`.

---

## 5. Cross-Cutting UI/UX Patterns

- **Loading states:** every route shows a full-page branded spinner (the interlocking-rings logo, ~150px, centered in a soft grey rounded card) on hard navigation/reload, and inline spinners ("Loading communities…", "Loading community details…") for async data within a route when navigated via client-side routing.
- **Empty states:** consistently friendly, italic/muted grey text with a short encouraging phrase (e.g. "No posts yet. Be the first to share something!", "No upcoming events", "No communities yet", "No users yet").
- **Decorative line-art figures:** small greyscale illustrated human figures (climbing/sitting poses) scattered at low opacity in empty corners of nearly every screen — purely decorative, consistent brand texture element. Implement as a small set of SVG assets absolutely positioned in layout containers.
- **Badges/pills:** consistent pill component used for: role badges (COHORT USER/ADMIN), "NEW" tags on communities, category tags (Programming), notification type tags (People), announcement labels (Important).
- **Buttons:** primary = solid blue or blue-teal gradient with rounded-full/pill shape; secondary = outline/light grey pill; destructive/sign-out = red text, no fill.
- **Right sidebar persists across all dashboard routes** with the same widgets (Communities/Friends/Connect/Calendar/Headsup), reinforcing quick access — should be a shared layout component, not per-page.
- **Site-wide announcement banner** ("Full access will soon require PCCOE account login" under an "Important" label) appears inside the Headsup sidebar widget on every page — implement as a global/admin-configurable banner message.
- **Routing convention:** `/dashboard/<section>` for top-level pages, `/dashboard/<section>/<sub-id>` for detail views (e.g. community detail, other users' profiles), `?query` params for deep-linking within a section (e.g. connect?user=).
- **Auth:** Google OAuth only ("Sign in with Google"), college email domain enforcement implied (`@pccoepune.org` addresses seen), redirect target `/dashboard` post-auth.

---

## 6. Suggested Build Order (for an AI coding agent)

1. Scaffold: React (Vite) + Supabase project (auth: Google provider only, Postgres tables per section data models above, Realtime enabled for messages/feed) + Tailwind CSS for styling to match the rounded, pill-heavy, soft-shadow aesthetic.
2. Shared shell: left icon rail, right widget sidebar, top page-header pattern (`c/<name>` + subtitle), command palette (⌘K), theme toggle, decorative SVG figures, global loading spinner/splash.
3. Marketing/landing page (`/`) with hero, marquee, feature grid, about section, Google sign-in.
4. Auth + `/dashboard` home feed (composer, post cards, likes, threaded replies).
5. Communities list (department-grouped, filter dropdown, subscribe) + community detail page.
6. Network/Friends directory + follow system.
7. Connect (DM list/thread UI + Supabase Realtime channel + 30s disappearing-message timer logic).
8. XD swipe-feed (tag pill, like/source/share rail, next-card control).
9. Campus Map (TomTom SDK integration, seeded POIs, colored markers).
10. Calendar (month grid, event model, today highlight).
11. Arcade (Chess with simple AI, Tic-Tac-Toe, Sudoku).
12. Headsup notifications (card list, mark read/mark all read).
13. Contact form (prefilled from profile, character counter, team section).
14. Profile (own + public view, edit modal, stats, activity tabs, role badges).
15. Buddy AI assistant widget (chat UI + backend endpoint that can query your own users/communities tables and answer basic app questions).
16. Polish pass: empty states, loading states, responsive breakpoints, dark mode.

---

## 7. Open Questions / Things Not Fully Observable From Crawl

- Exact color hex values, font family, and spacing scale would need to be sampled directly from computed styles (dev tools) for pixel-perfect matching — this doc captures structure and behavior, not a design token file.
- "Shop"/Marketplace feature is referenced in the command palette and in a seed post ("Check out the Marketplace 🛒") but has no live route — scope it as a stretch feature or omit.
- XD's actual data source/moderation model for user-submitted anonymous content wasn't observable (only a pre-seeded meme swipe feed was live) — decide whether to build true anonymous UGC posting or keep the curated swipe feed.
- "Meet the team" section on Contact page didn't finish loading during the crawl — reconstruct using the three names that recur as platform admins/founders in seed posts: Chirag Ferwani, Vrushabh Hirap, Anushka Shinde.
