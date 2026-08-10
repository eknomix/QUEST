# Eknomix ERP Lite

A single-file, offline-first ERP (accounting, inventory, sales, purchases, payroll) that runs
entirely in the browser. All data is stored locally via IndexedDB — nothing is sent anywhere
unless you turn on the optional Firebase cloud sync (see below).

## ⚠️ Before you enable GitHub Pages — read this

This repo, once "Pages" is switched on, will be reachable by **anyone who has the URL** —
GitHub Pages sites are public by default and can be found by search engines and URL scanners.
This app can hold real invoices, customer data, payroll, and QID numbers. Treat the Pages URL
like an unlocked door, not a password.

**Recommended before going live:**
1. Change the default login (`admin` / `admin123`) immediately — Settings → Users & Roles.
2. Ideally, configure Firebase (see below) so the app requires real sign-in rather than the
   basic on-device check it uses by default.
3. If you just want to test this safely, use a **private** repo + GitHub Pages on a paid GitHub
   plan (Enterprise supports private Pages), or skip GitHub entirely and run it locally instead
   (see "Local alternative" below) — that never exposes anything to the internet.

## Why GitHub Pages fixes the "data disappears on refresh" problem

The app needs to load from a real `http://` or `https://` address for the browser to allow
persistent local storage (IndexedDB). Opening the file directly (double-clicking it, or a
`file://` address) blocks that storage in most browsers, so everything you type vanishes on
refresh. GitHub Pages serves the file over `https://`, which resolves this — **as long as you
always use the exact same URL**. Every visit to that same address shares the same stored data.

## Setup — GitHub Pages

1. Create a new repository on GitHub (public, or private if your plan supports private Pages).
2. Upload `index.html` from this folder to the root of that repository.
   (Optionally also add this `README.md`.)
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**. Save.
5. GitHub will publish it at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
6. Open that URL, log in with `admin` / `admin123`, and change the password immediately.

## Updating later

Whenever you get a new version of `index.html` from me, upload it to the **same repo, same
filename, same path** — this keeps the URL identical, so your existing browser data keeps
working. Uploading it under a different filename or a new repo creates a fresh, empty database.

## Local alternative (no hosting, fully private)

If you'd rather not put this on the internet at all:
```
cd folder-with-index.html
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser. Same fix for the storage issue, zero exposure.

## Enabling real cloud sync (optional, recommended for production use)

The app already has a Firebase-based sync layer built in but unconfigured (`firebaseConfig` near
the top of the `<script>` in `index.html`). Configuring this gives you:
- Real user accounts (not just a device-local password check)
- Data synced live across every device/browser you log into
- A genuine off-device backup, independent of any single browser's storage

This requires creating a free Firebase project and pasting ~5 config values into the file. Ask
and I can walk through this step by step.

## Backups regardless of hosting choice

Use **Settings → Backup & Restore → Download Backup (.json)** regularly. That file is a full,
portable copy of your data independent of the browser or hosting choice — the one thing that
protects you no matter what else changes.
