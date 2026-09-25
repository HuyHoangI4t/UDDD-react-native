const db = require('../config/db');

// Get Notifications (with pagination)
exports.getNotifications = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.query('SELECT * FROM notifications ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
    if (rows.length === 0 && page === 1) {
      // Seed initial notifications
      await db.query('INSERT INTO notifications (title, content, sender, date) VALUES (?, ?, ?, ?)', [
        'Thông báo lịch nghỉ học bù môn Lập trình Web',
        'Sinh viên lớp CNTT K23 nghỉ học ngày thứ 3 và học bù vào chủ nhật tuần tới.',
        'Phòng Đào tạo',
        '24/09/2026'
      ]);
      await db.query('INSERT INTO notifications (title, content, sender, date) VALUES (?, ?, ?, ?)', [
        'Thông báo đóng học phí học kỳ 1 năm học 2026-2027',
        'Đề nghị sinh viên hoàn thành học phí trước ngày 30/10/2026.',
        'Phòng Tài vụ',
        '20/09/2026'
      ]);
      const [seeded] = await db.query('SELECT * FROM notifications ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
      return res.json({ success: true, page, limit, notifications: seeded });
    }
    res.json({ success: true, page, limit, notifications: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thông báo', error: error.message });
  }
};

// Get Notification by ID
exports.getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM notifications WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo.' });
    }
    res.json({ success: true, notification: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết thông báo', error: error.message });
  }
};

// Get Surveys
exports.getSurveys = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM surveys');
    if (rows.length === 0) {
      await db.query('INSERT INTO surveys (title, description, status) VALUES (?, ?, ?)', [
        'Đánh giá chất lượng giảng dạy học kỳ 1 năm học 2026-2027',
        'Khảo sát ý kiến sinh viên về phương pháp giảng dạy của giảng viên các học phần.',
        'Đang mở'
      ]);
      const [seeded] = await db.query('SELECT * FROM surveys');
      return res.json({ success: true, surveys: seeded });
    }
    res.json({ success: true, surveys: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách khảo sát', error: error.message });
  }
};

// Submit Survey
exports.submitSurvey = async (req, res) => {
  const { surveyId, mssv, answers } = req.body;
  if (!surveyId) {
    return res.status(400).json({ success: false, message: 'Mã khảo sát là bắt buộc.' });
  }
  res.json({
    success: true,
    message: 'Gửi kết quả khảo sát thành công. Cảm ơn ý kiến đóng góp của bạn!',
    result: { surveyId, mssv: mssv || 'Anonymous', answers: answers || {}, submittedAt: new Date() }
  });
};

// Support Tickets (Phản hồi, kiến nghị, báo lỗi)
exports.submitSupportTicket = async (req, res) => {
  const { mssv, title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung yêu cầu hỗ trợ là bắt buộc.' });
  }

  try {
    await db.query('INSERT INTO support_tickets (mssv, title, content, status) VALUES (?, ?, ?, ?)', [
      mssv || '23103023', title, content, 'Đang xử lý'
    ]);
    res.json({
      success: true,
      message: 'Gửi yêu cầu hỗ trợ thành công đến Phòng Công tác Sinh viên.',
      ticket: { mssv: mssv || '23103023', title, content, status: 'Đang xử lý', createdAt: new Date() }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi gửi yêu cầu hỗ trợ', error: error.message });
  }
};
