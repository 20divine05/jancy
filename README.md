# 🛡️ DropShield - Disposable, Self-Destructing File Sharing Vault

> **DropShield** is a full-stack MERN application for disposable, highly secure file sharing (Mini WeTransfer with self-destruct functionality). Files automatically destroy themselves after reaching a user-defined download limit or when their expiration timer elapses.

---

## ✨ Features

- ⚡ **Self-Destruct File Protocol**: Files are unlinked and permanently deleted from disk and MongoDB as soon as max downloads are reached.
- 🕒 **Customizable Expiration Timers**: Choose expiration windows (1 Hour, 24 Hours, 7 Days) enforced by MongoDB TTL (`expiresAt`) indexes.
- 🔒 **Bcrypt Passcode PIN Protection**: Optional passcode protection hashed with salted `bcryptjs` hashes before saving.
- 🧹 **Automatic Background Sweeper**: Periodic orphan file cleaner purges physical files on disk if TTL document expiration occurs.
- 🎨 **Modern Cyber Glassmorphism UI**: Built with React, Tailwind CSS, Lucide Icons, live download countdown timers, copy-to-clipboard, and confetti celebrations.
- ⚡ **Zero-Config Fallback**: Automatically connects to local/Atlas MongoDB or spins up an in-memory data store for instant demo testing out of the box.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**: Fast RESTful API web server.
- **MongoDB & Mongoose**: Document database with native TTL index (`expiresAt: 1`).
- **Multer**: Single-file disk upload middleware with file size validation (100MB max limit).
- **BcryptJS**: Passcode hashing algorithm.
- **CORS & Dotenv**: Cross-origin security and environment variable management.

### Frontend
- **React 19 (Vite)**: Modern fast frontend framework.
- **Tailwind CSS**: Custom dark cyber glassmorphism design system.
- **Lucide-React**: Clean modern SVG icons.
- **Axios**: HTTP client for API requests and binary file stream handling.
- **React Router DOM**: Client-side single page app routing (`/` and `/download/:id`).
- **Canvas-Confetti**: Interactive particle celebratory feedback.

---

## 📁 Project Architecture

```
dropshield/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & fallback handler
│   ├── controllers/
│   │   └── fileController.js     # Upload, Info, Download & Self-Destruct Logic
│   ├── middleware/
│   │   └── upload.js             # Multer storage configuration
│   ├── models/
│   │   └── File.js               # Mongoose schema with TTL index
│   ├── routes/
│   │   └── fileRoutes.js         # API Endpoints (/upload, /info/:id, /download/:id, /stats)
│   ├── utils/
│   │   └── cleanup.js            # Background physical file sweeper
│   ├── uploads/                  # Physical disk storage directory
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server startup (Port 5000)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header with security badges
│   │   │   ├── Stats.jsx         # Live transfer counters
│   │   │   ├── UploadBox.jsx     # Drag & drop dropzone with upload progress
│   │   │   ├── ConfigPanel.jsx   # Expiration, Max Downloads & PIN settings
│   │   │   ├── SuccessCard.jsx   # Share link card with Copy & QR preview
│   │   │   ├── DownloadCard.jsx  # Download view with live countdown timer
│   │   │   ├── PasscodeModal.jsx # PIN input modal for protected files
│   │   │   └── ExpiredNotice.jsx # Minimalist 404 self-destructed notice
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Upload Dashboard view
│   │   │   └── DownloadPage.jsx  # Download Route view
│   │   ├── App.jsx               # Application routes & layout
│   │   ├── main.jsx              # React Vite entry point
│   │   └── index.css             # Tailwind directives & glassmorphism utilities
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Step-by-Step Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **NPM** (v9 or higher)
- *(Optional)* **MongoDB** installed locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/dropshield.git
cd dropshield
```

### 2. Setup & Start Backend
```bash
cd backend
npm install

# (Optional) Environment Configuration
cp .env.example .env

# Start Backend Server
npm start
```
> The backend server will start on `http://localhost:5000`.

### 3. Setup & Start Frontend
In a new terminal window:
```bash
cd frontend
npm install

# Start Vite Dev Server
npm run dev
```
> The frontend application will run on `http://localhost:5173`.

---

## 🔄 Self-Destruct Workflow

```
[User Uploads File]
       │
       ├──► Hash Passcode (bcrypt)
       ├──► Save File Payload to backend/uploads/
       └──► Create File Doc in MongoDB with expiresAt (TTL Index)
       │
[Share Link Generated] ──► http://localhost:5173/download/:id
       │
[Recipient Accesses Link]
       ├──► Check Expiration / Download Limit
       ├──► Verify PIN Passcode (if set)
       └──► Stream File Download Payload
       │
[Download Reaches maxDownloads OR TTL Timer Elapses]
       ├──► Asynchronously delete MongoDB Document
       ├──► Physically unlink & erase file from disk (fs.unlink)
       └──► Future visits return HTTP 404 ("Link expired or destroyed")
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/files/upload` | Upload single file with optional `passcode`, `maxDownloads`, `expirationHours` |
| `GET` | `/api/files/info/:id` | Get file metadata (filename, size, remaining downloads, PIN requirement) |
| `POST` | `/api/files/download/:id` | Download file stream with optional `{ passcode }` payload |
| `GET` | `/api/files/stats` | Retrieve platform statistics (active files, total transfers) |
| `GET` | `/api/health` | Backend server health check |

---


