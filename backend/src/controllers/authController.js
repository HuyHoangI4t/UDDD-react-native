const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Register
exports.register = async (req, res) => {
  const { mssv, password, fullName, faculty, email } = req.body;

  if (!mssv || !password) {
    return res.status(400).json({ success: false, message: 'Mã số sinh viên (mssv) và mật khẩu là bắt buộc.' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE mssv = ?', [mssv]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Mã số sinh viên đã tồn tại trong hệ thống.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userFullName = fullName || ('Sinh viên ' + mssv);
    const userFaculty = faculty || 'Công nghệ thông tin';
    const userEmail = email || `${mssv}@sv.ttn.edu.vn`;

    await db.query(
      'INSERT INTO users (mssv, full_name, faculty, email, password) VALUES (?, ?, ?, ?, ?)',
      [mssv, userFullName, userFaculty, userEmail, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      user: { mssv, fullName: userFullName, faculty: userFaculty, email: userEmail }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi đăng ký', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { mssv, password } = req.body;

  if (!mssv || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã số sinh viên và mật khẩu.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE mssv = ?', [mssv]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Mã số sinh viên hoặc mật khẩu không đúng.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mã số sinh viên hoặc mật khẩu không đúng.' });
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        mssv: user.mssv,
        fullName: user.full_name,
        faculty: user.faculty,
        email: user.email
      },
      token: 'jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi đăng nhập', error: error.message });
  }
};
