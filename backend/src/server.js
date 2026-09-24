const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const initializeTables = require('./config/initDb');
const setupSwagger = require('./config/swagger');

// Import modular routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const campusRoutes = require('./routes/campusRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB tables & Swagger UI on startup
initializeTables();
setupSwagger(app);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Kiểm tra trạng thái server và kết nối MySQL (smartcampus).
 *     responses:
 *       200:
 *         description: Server và Database hoạt động bình thường.
 */
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', message: 'LTDDDNT Backend API & MySQL database (smartcampus) đang hoạt động bình thường.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Lỗi kết nối database', error: error.message });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', studentRoutes); // /api/grades, /api/schedule
app.use('/api', campusRoutes);  // /api/events, /api/feedback, /api/sos, /api/map

app.listen(PORT, () => {
  console.log(`🚀 LTDDDNT Backend server đang chạy tại cổng ${PORT}`);
  console.log(`📄 Swagger UI sẵn sàng tại http://localhost:${PORT}/api-docs`);
});
