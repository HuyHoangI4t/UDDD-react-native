# LTDDDNT Node.js Backend

Backend API server built with **Node.js**, **Express**, **Axios**, and **Cheerio**. It provides REST endpoints for the LTDDDNT mobile app and proxies student grade and timetable data from the university portal (ttn.edu.vn).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - Student login
- `POST /api/grades` - Get student grades (scrapes ttn.edu.vn or falls back to mock data)
- `POST /api/schedule` - Get student timetable (scrapes ttn.edu.vn or falls back to mock data)
- `GET /api/events` - Get university events
- `POST /api/feedback` - Submit student feedback
- `POST /api/sos` - Send emergency SOS alert
- `GET /api/map` - Get campus map locations
