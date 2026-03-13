# Seattle Tour De Pints — Setup Guide

## File Structure

```
index.html        ← Homepage (events list, about, donate)
event.html        ← Event detail + registration form
admin.html        ← Admin panel: add/edit/delete events (login required)
css/style.css     ← All shared styles
js/config.js      ← Supabase credentials + global site settings
SETUP.md          ← This file
```

---

## Step 1 — Create your Supabase project (free)

1. Go to [https://supabase.com](https://supabase.com) and sign up for a free account.
2. Click **New Project** and give it a name (e.g. `tour-de-pints`).
3. Choose a region close to Seattle (US West).
4. Wait ~1 minute for the project to spin up.

---

## Step 2 — Create the database tables

1. In your project dashboard, click **SQL Editor** in the left sidebar.
2. Paste ALL of the SQL below and click **Run**:

```sql
-- ── Events table ──────────────────────────────────────────────────────────
create table events (
  id               uuid        default gen_random_uuid() primary key,
  created_at       timestamptz default now(),
  slug             text        not null unique,
  title            text        not null,
  event_date       date        not null,
  time_of_day      text        not null default '10:00 AM',
  location         text        not null,
  distance         text,
  difficulty       text,
  description      text,
  long_description text,
  stops            text[]      default '{}',
  tags             text[]      default '{}',
  waiver_url       text,
  donate_links     jsonb       default '[]',
  published        boolean     not null default true
);

-- ── Registrations table ───────────────────────────────────────────────────
create table registrations (
  id          uuid        default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  event_slug  text        not null,
  first_name  text        not null,
  last_name   text        not null,
  email       text        not null,
  unique (event_slug, email)   -- prevents duplicate sign-ups
);

-- ── Row Level Security ────────────────────────────────────────────────────
alter table events        enable row level security;
alter table registrations enable row level security;

-- Public: read published events only
create policy "Public can view published events"
  on events for select
  using (published = true);

-- Authenticated (admin): full access to events
create policy "Admins can manage events"
  on events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Public: submit registrations (insert only)
create policy "Public can insert registrations"
  on registrations for insert
  with check (true);

-- Authenticated (admin): read all registrations
create policy "Admins can read registrations"
  on registrations for select
  using (auth.role() = 'authenticated');
```

---

## Step 3 — Get your API credentials

1. In the left sidebar go to **Project Settings → API**.
2. Copy:
   - **Project URL** (e.g. `https://abcxyz.supabase.co`)
   - **anon / public** key (long string starting with `eyJ...`)
3. Open `js/config.js` and paste them in:

```js
const SUPABASE_URL      = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGci...YOUR_ANON_KEY...";
```

---

## Step 4 — Create your admin account

The admin panel (`admin.html`) requires a Supabase login.

1. In your Supabase dashboard, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter your email and a strong password.
4. Open `admin.html` in your browser and sign in with those credentials.

> **Only create accounts for people you trust.** Admins can create, edit,
> publish, and delete events.

---

## Step 5 — Add your first event

1. Open `admin.html` in your browser and sign in.
2. Click **"+ Add New Event"**.
3. Fill in the form and click **Save Event**.
4. The event will immediately appear on the public homepage.

**Field guide:**

| Field | Notes |
|-------|-------|
| **Slug** | Auto-generated from title. Used in the URL: `event.html?id=your-slug`. Must be unique. |
| **Short Description** | 1–2 sentences shown on the homepage event card. |
| **Full Description** | Shown on the event detail page. Use blank lines to separate paragraphs. |
| **Brewery Stops** | One stop per line. |
| **Tags** | Comma-separated labels shown on the event card (e.g. `18 mi, All levels, Free`). |
| **Waiver URL** | Link to your waiver form. Free options: [Google Forms](https://forms.google.com), [DocuSign](https://docusign.com). Leave blank to hide waiver button. |
| **Donate URLs** | Optional PayPal, Venmo, or GoFundMe links shown on the event page. |
| **Publish** | Checked = visible on public site. Uncheck to save as a draft. |

---

## Step 6 — View registrations

**In the admin panel:** The events table shows a registration count per event.

**In Supabase directly:**
1. Click **Table Editor** → **registrations**.
2. All sign-ups appear here in real time.
3. Click **Export → CSV** to download for spreadsheets or email tools.

---

## Step 7 — Global donate links (homepage)

The homepage `/index.html` shows a general donate section pulled from `js/config.js`.
To add donation links to the homepage, edit the `donateLinks` array in `SITE`:

```js
donateLinks: [
  { label: "PayPal",   icon: "💳", url: "https://paypal.me/YourName" },
  { label: "Venmo",    icon: "📱", url: "https://venmo.com/YourName" },
  { label: "GoFundMe", icon: "🚀", url: "https://gofundme.com/f/your-campaign" },
],
```

Per-event donate links are managed in the admin panel.

---

## Step 8 — Set up the Sticker Wall (Supabase Storage)

The sticker wall on the homepage pulls images from a Supabase Storage bucket.
Visitors can also upload their own stickers via the "Upload Your Sticker" button.

### 8a — Create the bucket

1. In your Supabase dashboard, go to **Storage** in the left sidebar.
2. Click **New bucket**.
3. Name it exactly: `stickers`
4. Toggle **Public bucket** ON (this makes images publicly readable without auth).
5. Click **Save**.

### 8b — Set Storage access policies

Go to **Storage → Policies** and add these two policies for the `stickers` bucket:

```sql
-- Allow anyone to view sticker images
CREATE POLICY "Public sticker read"
ON storage.objects FOR SELECT
USING (bucket_id = 'stickers');

-- Allow anonymous (unauthenticated) visitors to upload stickers
CREATE POLICY "Anon sticker upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'stickers');
```

You can run these in **SQL Editor**, or use the Storage Policies UI to create them
(set the target table to `storage.objects`, the operation to SELECT / INSERT, and
the `using` / `with check` expression as shown above).

### 8c — Seed your first stickers

1. Go to **Storage → stickers**.
2. Click **Upload files** and drop in your PNG/JPG sticker files.
3. Reload the homepage — the stickers will appear scattered on the hero wall.

### Managing stickers

- **Add** a sticker at any time by uploading to the `stickers` bucket — it appears
  on the next page load. No code changes needed.
- **Remove** a sticker by deleting it from the Supabase Storage dashboard.
- Visitor-uploaded stickers land in the same bucket and appear immediately on reload.
  Review and delete anything unwanted from the Storage dashboard.

---

## Step 9 — Host the site (optional)

Plain HTML/CSS/JS — no build step required. Just upload the files.

| Service | How to deploy |
|---------|--------------|
| **GitHub Pages** | Push files to GitHub → Settings → Pages → Deploy from branch |
| **Netlify** | Drag-and-drop your project folder at [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | Connect a GitHub repo or use the Vercel CLI |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Homepage says "Setup needed" | Add Supabase URL + key to `js/config.js` |
| Events not showing | Check that `published = true` in the admin panel |
| Form says generic error | Open browser DevTools (F12 → Console) to see the Supabase error |
| "Slug already exists" on save | Pick a different slug — each must be unique |
| Admin login fails | Make sure you created a user in Supabase → Authentication → Users |
| CORS error in console | Make sure your `SUPABASE_URL` has no trailing slash |
| Stickers don't appear | Check that the `stickers` bucket exists and is set to **Public** |
| Upload gives "row level security" error | Run the two Storage policies from Step 8b |
| Upload gives "Bucket not found" error | Double-check the bucket is named exactly `stickers` |
