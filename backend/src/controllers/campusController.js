const db = require('../config/db');



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
