# Class 11 JEE Aspirant Routine & Timetable Tracker 🎯

A high-performance, distraction-free, offline-first dashboard tailored specifically for Class 11 IIT-JEE aspirants to manage daily schedules, execute routines in real time, record study output, manage backlogs, and visualize preparation balance.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)

---

## ⚡ Features

1. **Day-Wise Fixed Timetable Planner:**
   - Define custom time blocks for each day (Monday–Sunday) with exact start & end times.
   - Categorize by subject: Physics (emerald), Chemistry (amber), Mathematics (blue), Coaching, Revision, and Self-Study.
   - 1-click **"Copy to Weekdays"** and **"Load JEE Preset"** (starter template with HC Verma, NCERT Chemistry, DPPs, and Mock Tests).

2. **Daily Routine Execution Dashboard:**
   - Detects the current day of the week and live IST clock.
   - **Active Task Banner:** Automatically highlights the currently active study slot with a real-time countdown timer.
   - **1-Click Status Toggling:** Mark slots as `Done` ✅, `In Progress` ⏳, or `Backlog` ⚠️ with a live progress bar.

3. **Daily Performance Logger & JEE Journal:**
   - Single-click **"Pull Routine Hours"** button auto-tallies completed hours by subject.
   - Questions solved target counter with `+5`/`+10`/`+25` quick add buttons.
   - 5-star concentration rating and daily reflection journal.

4. **Smart Backlog Box & Sunday Catch-Up:**
   - Tasks marked as `Backlog` route automatically to the Backlog Box.
   - Single-click **"Queue for Sunday"** catch-up toggle that surfaces an active checklist inside Sunday's designated revision slot.

5. **Progress & Analytics:**
   - 7-day study hours bar chart with daily target threshold line.
   - **PCM Subject Balance Meter:** Live percentage distribution to maintain an equal 1:1:1 split between Physics, Chemistry, and Mathematics.
   - Consecutive-day streak counter (🔥 X Days Streak).

6. **Offline Persistence & Backup:**
   - Instant local browser persistence (`localStorage`).
   - JSON export and import in the Settings modal for offline backups.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Build & Test

```bash
# Run unit test suite (30 automated tests)
npm test

# Build production bundle
npm run build
```

---

## 🌐 Deploy to GitHub and Vercel

### Step 1: Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `jee-routine-tracker`).
2. Run the following commands in your project folder:

```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository (`jee-routine-tracker`).
4. Vercel automatically detects the framework as **Vite**:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**!

Your JEE Tracker will be live on a fast, free worldwide CDN URL (e.g. `https://jee-routine-tracker.vercel.app`)!
