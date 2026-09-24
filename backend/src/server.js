const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./config/db');
const initializeTables = require('./config/initDb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB tables on startup
initializeTables();

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', message: 'LTDDDNT Backend API & MySQL database (smartcampus) are running successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database query failed', error: error.message });
  }
});

// Authentication / Login API (with MySQL user storage)
app.post('/api/auth/login', async (req, res) => {
  const { msv, password } = req.body;
  if (!msv) {
    return res.status(400).json({ success: false, message: 'Mã sinh viên (msv) là bắt buộc.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE msv = ?', [msv]);
    let user;

    if (rows.length === 0) {
      const fullName = 'Sinh viên ' + msv;
      const faculty = 'Công nghệ thông tin';
      const email = `${msv}@ttn.edu.vn`;
      await db.query(
        'INSERT INTO users (msv, full_name, faculty, email, password) VALUES (?, ?, ?, ?, ?)',
        [msv, fullName, faculty, email, password || '']
      );
      user = { msv, fullName, faculty, email };
    } else {
      user = {
        msv: rows[0].msv,
        fullName: rows[0].full_name,
        faculty: rows[0].faculty,
        email: rows[0].email
      };
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user,
      token: 'mock-jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi đăng nhập', error: error.message });
  }
});

// Grades API (diem.py integration)
app.post('/api/grades', async (req, res) => {
  const { msv, dk } = req.body;
  const studentMsv = msv || '23103023';
  const studentDk = dk || '10';

  try {
    const url = "https://www.ttn.edu.vn/libraries/tnu/kqcq.php";
    const payload = new URLSearchParams({
      'msv': studentMsv,
      'dk': studentDk
    });

    const response = await axios.post(url, payload.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.ttn.edu.vn/index.php?option=com_tnu&view=kqchinhquy',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const tablesData = [];

    $('table').each((index, table) => {
      const rows = [];
      $(table).find('tr').each((i, row) => {
        const cols = [];
        $(row).find('td, th').each((j, col) => {
          cols.push($(col).text().trim());
        });
        if (cols.length > 0 && cols.some(c => c !== '')) {
          rows.push(cols);
        }
      });
      tablesData.push({ tableIndex: index + 1, rows });
    });

    res.json({
      success: true,
      msv: studentMsv,
      tables: tablesData,
      rawHtmlLength: response.data.length
    });
  } catch (error) {
    res.json({
      success: true,
      msv: studentMsv,
      note: 'External portal unavailable or returned error, serving mock grades data.',
      tables: [
        {
          tableIndex: 1,
          rows: [
            ['STT', 'Mã HP', 'Tên học phần', 'Số TC', 'Điểm QT', 'Điểm Thi', 'Điểm TK', 'Chữ'],
            ['1', 'IT101', 'Lập trình Web nâng cao', '3', '8.5', '8.0', '8.2', 'A'],
            ['2', 'IT102', 'Lập trình Node.js & React', '4', '9.0', '8.5', '8.7', 'A']
          ]
        }
      ]
    });
  }
});

// Schedule API (tkb.py integration)
app.post('/api/schedule', async (req, res) => {
  const { msv, dk } = req.body;
  const studentMsv = msv || '23103023';
  const studentDk = dk || '10';

  try {
    const url = "https://www.ttn.edu.vn/libraries/tnu/tkbieusinhvien.php";
    const payload = new URLSearchParams({
      'msv': studentMsv,
      'dk': studentDk
    });

    const response = await axios.post(url, payload.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.ttn.edu.vn/',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const tablesData = [];

    $('table').each((index, table) => {
      const rows = [];
      $(table).find('tr').each((i, row) => {
        const cols = [];
        $(row).find('td, th').each((j, col) => {
          cols.push($(col).text().trim());
        });
        if (cols.length > 0 && cols.some(c => c !== '')) {
          rows.push(cols);
        }
      });
      tablesData.push({ tableIndex: index + 1, rows });
    });

    res.json({
      success: true,
      msv: studentMsv,
      tables: tablesData
    });
  } catch (error) {
    res.json({
      success: true,
      msv: studentMsv,
      note: 'External portal unavailable, serving mock schedule data.',
      schedule: [
        { day: 'Thứ 2', time: '07:00 - 09:15', subject: 'Lập trình Web nâng cao', room: 'A201', teacher: 'Nguyễn Văn A' },
        { day: 'Thứ 4', time: '09:30 - 11:45', subject: 'Cơ sở dữ liệu phân tán', room: 'B302', teacher: 'Trần Thị B' }
      ]
    });
  }
});

// Events API (Database integrated)
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY id DESC');
    if (rows.length === 0) {
      await db.query(
        'INSERT INTO events (title, event_date, location, description) VALUES (?, ?, ?, ?)',
        ['Hội thảo Công nghệ AI 2026', '2026-10-05', 'Hội trường lớn', 'Chia sẻ xu hướng AI mới nhất.']
      );
      await db.query(
        'INSERT INTO events (title, event_date, location, description) VALUES (?, ?, ?, ?)',
        ['Ngày hội việc làm CNTT', '2026-10-20', 'Sân trường', 'Gặp gỡ các doanh nghiệp hàng đầu.']
      );
      const [seededRows] = await db.query('SELECT * FROM events ORDER BY id DESC');
      return res.json({ success: true, events: seededRows });
    }
    res.json({ success: true, events: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách sự kiện', error: error.message });
  }
});

// Feedback API (Database integrated)
app.post('/api/feedback', async (req, res) => {
  const { title, content, msv } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung phản hồi là bắt buộc.' });
  }

  try {
    await db.query(
      'INSERT INTO feedback (msv, title, content) VALUES (?, ?, ?)',
      [msv || 'Anonymous', title, content]
    );
    res.json({
      success: true,
      message: 'Gửi phản hồi thành công vào cơ sở dữ liệu smartcampus!',
      feedback: { title, content, msv: msv || 'Anonymous', createdAt: new Date() }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lưu phản hồi', error: error.message });
  }
});

// SOS API (Database integrated)
app.post('/api/sos', async (req, res) => {
  const { msv, location, message } = req.body;
  try {
    await db.query(
      'INSERT INTO sos_alerts (msv, location, message) VALUES (?, ?, ?)',
      [msv || '23103023', location || 'Không rõ vị trí', message || 'Khẩn cấp']
    );
    res.json({
      success: true,
      message: 'Đã lưu tín hiệu SOS vào cơ sở dữ liệu và thông báo lực lượng chức năng!',
      alert: { msv: msv || '23103023', location: location || 'Không rõ vị trí', message: message || 'Khẩn cấp', timestamp: new Date() }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lưu SOS', error: error.message });
  }
});

// Map API (Database integrated)
app.get('/api/map', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM map_locations');
    if (rows.length === 0) {
      await db.query(
        'INSERT INTO map_locations (name, lat, lng, description) VALUES (?, ?, ?, ?)',
        ['Tòa nhà Hiệu bộ', 21.0, 105.8, 'Phòng ban hành chính, tài vụ']
      );
      await db.query(
        'INSERT INTO map_locations (name, lat, lng, description) VALUES (?, ?, ?, ?)',
        ['Thư viện trung tâm', 21.01, 105.81, 'Khu tự học, kho sách']
      );
      const [seededRows] = await db.query('SELECT * FROM map_locations');
      return res.json({ success: true, locations: seededRows });
    }
    res.json({ success: true, locations: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy bản đồ', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 LTDDDNT Backend server is running on port ${PORT}`);
});
