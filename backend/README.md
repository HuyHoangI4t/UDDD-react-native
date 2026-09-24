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


📂 Cấu trúc mới tại thư mục backend/src/:
   1. config/:
      - db.js: Kết nối MySQL pool (smartcampus).
      - initDb.js: Tự động tạo bảng (users, events, feedback, sos_alerts, map_locations).
      - swagger.js: Cấu hình tài liệu Swagger UI.
   2. controllers/:
      - authController.js: Xử lý đăng ký, đăng nhập (bảo mật mật khẩu với bcryptjs).
      - studentController.js: Xử lý cào điểm, cào TKB từ ttn.edu.vn và tự động cập nhật tên thật sinh viên vào database.
      - campusController.js: Xử lý sự kiện, phản hồi, SOS và bản đồ.
   3. routes/:
      - authRoutes.js: Định tuyến /api/auth/register, /api/auth/login.
      - studentRoutes.js: Định tuyến /api/grades, /api/schedule (hỗ trợ cả msv và mssv).



   - Server Port: 5000 (cả trong server.js và env.example).
   - Swagger UI: http://localhost:5000/api-docs
   - Health check: http://localhost:5000/api/health