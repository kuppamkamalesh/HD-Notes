# 📝 HD Notes

A modern, full‑stack note‑taking application built with **React + TypeScript + Vite** on the frontend and **Express + TypeScript + MongoDB** on the backend. HD Notes ships production‑ready features like **OTP email login**, **Google OAuth**, **JWT sessions**, rate‑limited email delivery, and a clean, animated UI.

---

## 🌐 Live URLs

- **Frontend (Vercel):** https://hd-notes-three.vercel.app/
- **Backend Health (Render):** https://hd-notes-3.onrender.com/health

---

## ✨ Features

- 🔐 **Authentication**

  - Email **OTP login** (Gmail SMTP)
  - **Google OAuth** (Google Identity)
  - **JWT** access token

- 📬 **Email Delivery**

  - Nodemailer with Gmail SMTP
  - **Rate limiting** for OTP
  - One‑time OTP hashing & expiry

- 🗒️ **Notes**

  - Create / List / Delete notes (MongoDB)
  - Organized REST API

- 🎨 **UI/UX**

  - Tailwind CSS + Framer Motion
  - Responsive, fast, and minimal

- ☁️ **Deployment**
  - **Frontend:** Vercel
  - **Backend:** Render (Web Service)

---

## 🧱 Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, Zod, Nodemailer, jsonwebtoken  
**Infra:** Vercel (static), Render (Node Web Service)

---

## 📂 Monorepo Structure

```
/ (repo root)
├─ frontend/                # React + Vite app
│  ├─ src/
│  └─ vite.config.ts
└─ backend/                 # Express + TypeScript API
   ├─ src/
   │  ├─ index.ts           # Express entry (server)
   │  ├─ routes/
   │  ├─ db/
   │  └─ config/
   ├─ tsconfig.json
   └─ package.json          # "build": "tsc", "start": "node dist/index.js"
```

---

## ⚙️ Local Development

### Prerequisites

- Node.js 18+
- MongoDB (Atlas)
- A Gmail account + **App Password** (for OTP emails)
- Google OAuth Client ID

### 1) Backend

```bash
cd backend
npm install
```

Create **backend/.env**:

```env
PORT=4000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<a_long_random_secret>
JWT_EXPIRES_IN=15m

# Gmail SMTP (App Password required)
GMAIL_USER=<your_gmail_address>
GMAIL_PASS=<your_gmail_app_password>

# Google OAuth
GOOGLE_CLIENT_ID=<your_google_client_id>

# OTP settings
OTP_EXP_MINUTES=10
OTP_RESEND_COOLDOWN_SECONDS=60
```

Run locally:

```bash
npm run dev           # ts-node-dev
# or build + start
npm run build && npm start
```

Health check:

```
GET http://localhost:4000/health
```

### 2) Frontend

```bash
cd frontend
npm install
```

Create **frontend/.env**:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Run locally:

```bash
npm run dev
# open http://localhost:5173
```

---

## 🚀 Deployment

### Backend → Render (Web Service)

**Service settings:**

- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start` (which runs `node dist/index.js`)
- **Environment Variables:** same as backend `.env` (do **not** commit `.env`)

## 🔑 Auth Implementation Notes

- **JWT creation** (TypeScript-friendly):

- **Google OAuth** uses a server-side token verification (Google Identity).

- **OTP**: generated, hashed, stored with expiry; requests are **rate-limited** and throttled for resends.

---

## 🧪 Quick API Smoke Tests

```bash
# Health
curl https://hd-notes-3.onrender.com/health


---

## 📜 License

MIT © 2025 Kamalesh
```
