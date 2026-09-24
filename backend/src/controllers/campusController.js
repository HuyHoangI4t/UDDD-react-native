const db = require('../config/db');

// Get Events
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY id DESC');
    if (rows.length === 0) {
      await db.query('INSERT INTO events (title, event_date, location, description) VALUES (?, ?, ?, ?)', ['Hội thảo Công nghệ AI 2026', '2026-10-05', 'Hội trường lớn', 'Chia sẻ xu hướng AI mới nhất.']);
      await db.query('INSERT INTO events (title, event_date, location, description) VALUES (?, ?, ?, ?)', ['Ngày hội việc làm CNTT', '2026-10-20', 'Sân trường', 'Gặp gỡ các doanh nghiệp hàng đầu.']);
      const [seededRows] = await db.query('SELECT * FROM events ORDER BY id DESC');
      return res.json({ success: true, events: seededRows });
    }
    res.json({ success: true, events: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy sự kiện', error: error.message });
  }
};

// Submit Feedback
exports.submitFeedback = async (req, res) => {
  const { title, content, msv } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung phản hồi là bắt buộc.' });
  }

  try {
    await db.query('INSERT INTO feedback (msv, title, content) VALUES (?, ?, ?)', [msv || 'Anonymous', title, content]);
    res.json({
      success: true,
      message: 'Gửi phản hồi thành công',
      feedback: { title, content, msv: msv || 'Anonymous', createdAt: new Date() }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lưu phản hồi', error: error.message });
  }
};

// Submit SOS
exports.submitSos = async (req, res) => {
  const { msv, location, message } = req.body;
  try {
    await db.query('INSERT INTO sos_alerts (msv, location, message) VALUES (?, ?, ?)', [msv || '23103023', location || 'Không rõ vị trí', message || 'Khẩn cấp']);
    res.json({
      success: true,
      message: 'Đã gửi tín hiệu SOS thành công',
      alert: { msv: msv || '23103023', location: location || 'Không rõ vị trí', message: message || 'Khẩn cấp', timestamp: new Date() }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lưu SOS', error: error.message });
  }
};

// Get Map Locations
exports.getMapLocations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM map_locations');
    if (rows.length === 0) {
      await db.query('INSERT INTO map_locations (name, lat, lng, description) VALUES (?, ?, ?, ?)', ['Tòa nhà Hiệu bộ', 21.0, 105.8, 'Phòng ban hành chính, tài vụ']);
      await db.query('INSERT INTO map_locations (name, lat, lng, description) VALUES (?, ?, ?, ?)', ['Thư viện trung tâm', 21.01, 105.81, 'Khu tự học, kho sách']);
      const [seededRows] = await db.query('SELECT * FROM map_locations');
      return res.json({ success: true, locations: seededRows });
    }
    res.json({ success: true, locations: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy bản đồ', error: error.message });
  }
};
