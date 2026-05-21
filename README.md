# Kerala Blood Connect

Kerala Blood Connect is a MERN stack blood donation platform for finding donors, creating emergency blood requests, browsing blood banks, and managing records through an admin dashboard.

## Prerequisites

- Node.js 18+
- MongoDB Atlas connection string or local MongoDB

## Backend Setup

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Update `.env` with your MongoDB connection string and JWT secret.

Seed sample data:

```bash
npm run seed
```

Sample admin after seeding:

```txt
Email: admin@lifedrop.com
Password: admin123
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend uses `VITE_API_URL` if present, otherwise it connects to `http://localhost:5000/api`.

## Environment Variables

Backend `.env`:

```txt
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
BLOOD_BANK_MAX_LIMIT=50
```

Frontend `.env` optional:

```txt
VITE_API_URL=http://localhost:5000/api
VITE_HOME_BLOOD_BANK_LIMIT=2
VITE_BLOOD_BANK_INITIAL_LIMIT=8
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_ATTRIBUTION=&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
VITE_LEAFLET_MARKER_ICON=https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
VITE_LEAFLET_MARKER_ICON_2X=https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png
VITE_LEAFLET_MARKER_SHADOW=https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png
```
