# AR Scanner

A full-stack AR QR Scanner web app. Scan a QR code → instantly plays its linked video.

## Project Structure

```
ar-scanner/
├── server.js              # Express server
├── package.json
├── mappings.json          # QR→Video mappings (auto-managed)
├── routes/
│   └── api.js             # Upload, list, delete APIs
└── public/
    ├── scanner/           # Scanner app (mobile-friendly)
    │   └── index.html
    ├── admin/             # Admin panel
    │   └── index.html
    └── uploads/
        ├── qrcodes/       # Uploaded QR images
        └── videos/        # Uploaded videos
```

## Setup

```bash
npm install
npm start
```

Then open:
- **Scanner**: http://localhost:3000
- **Admin**:   http://localhost:3000/admin

## Deploy to Railway / Render / Fly.io

1. Push to GitHub
2. Connect repo to Railway/Render
3. Set start command: `npm start`
4. Done — it's live!

## How to add a QR→Video mapping

1. Open `/admin`
2. Upload: QR code image + video file + title
3. Enter the text content encoded inside the QR (e.g. a URL or keyword)
4. Hit Save — it's immediately live in the scanner

## Notes

- Videos up to 500MB supported
- QR matching is by text content embedded in the QR code
- All uploads stored in `public/uploads/`
