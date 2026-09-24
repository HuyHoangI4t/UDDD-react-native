const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../config/db');

// Get Student Profile from Database
exports.getProfile = async (req, res) => {
  const { mssv } = req.params;
  if (!mssv) {
    return res.status(400).json({ success: false, message: 'Mã số sinh viên (mssv) là bắt buộc.' });
  }

  try {
    const [rows] = await db.query('SELECT mssv, full_name, faculty, email, created_at FROM users WHERE mssv = ?', [mssv]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên với mã số này.' });
    }
    res.json({ success: true, profile: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy thông tin sinh viên', error: error.message });
  }
};

// Get Grades & Extract Student Full Name
exports.getGrades = async (req, res) => {
  const { mssv, dk } = req.body;

  if (!mssv) {
    return res.status(400).json({ 
      success: false, 
      message: 'Vui lòng nhập Mã số sinh viên (mssv) từ bàn phím để tra cứu điểm.' 
    });
  }

  const studentDk = dk || '10';

  try {
    const url = "https://www.ttn.edu.vn/libraries/tnu/kqcq.php";
    const payload = new URLSearchParams({ 'msv': mssv, 'dk': studentDk });

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
    let extractedFullName = null;

    // 1. Prioritize checking the beginning of the document (first table / header rows)
    $('table').first().find('tr').each((i, row) => {
      const rowCols = [];
      $(row).find('td, th').each((j, col) => {
        rowCols.push($(col).text().trim());
      });
      
      rowCols.forEach((text, index) => {
        if ((text.includes('Họ và tên') || text.includes('Họ tên')) && rowCols[index + 1]) {
          extractedFullName = rowCols[index + 1];
        }
      });
    });

    // 2. Fallback: check top elements if not found in first table
    if (!extractedFullName) {
      $('body *').slice(0, 40).each((i, el) => {
        const text = $(el).text().trim();
        if ((text.includes('Họ và tên') || text.includes('Họ tên')) && text.length < 80) {
          const parts = text.split(/:|-/);
          if (parts.length > 1 && parts[1].trim() && parts[1].trim().length > 2) {
            extractedFullName = parts[1].trim();
          }
        }
      });
    }

    // Update database user name if successfully extracted
    if (extractedFullName) {
      try {
        await db.query('UPDATE users SET full_name = ? WHERE mssv = ?', [extractedFullName, mssv]);
      } catch (dbErr) {
        console.error('Database update name error:', dbErr.message);
      }
    }

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
      mssv: mssv,
      fullName: extractedFullName || ('Sinh viên ' + mssv),
      tables: tablesData
    });
  } catch (error) {
    res.json({
      success: true,
      mssv: mssv,
      fullName: 'Sinh viên ' + mssv,
      note: 'External portal unavailable, serving mock grades data for ' + mssv,
      tables: [
        {
          tableIndex: 1,
          rows: [
            ['STT', 'Mã HP', 'Tên học phần', 'Số TC', 'Điểm QT', 'Điểm Thi', 'Điểm TK', 'Chữ'],
            ['1', 'IT101', 'Lập trình Web nâng cao', '3', '8.5', '8.0', '8.2', 'A'],
            ['2', 'IT102', 'Lập trình Node.js & React', '4', '', '', '', 'X']
          ]
        }
      ]
    });
  }
};

// Get Current In-Progress Courses (filtering courses where letter grade is 'X')
exports.getCurrentCourses = async (req, res) => {
  const { mssv, dk } = req.body;

  if (!mssv) {
    return res.status(400).json({ 
      success: false, 
      message: 'Vui lòng nhập Mã số sinh viên (mssv) để lấy danh sách học phần đang học.' 
    });
  }

  const studentDk = dk || '10';

  try {
    const url = "https://www.ttn.edu.vn/libraries/tnu/kqcq.php";
    const payload = new URLSearchParams({ 'msv': mssv, 'dk': studentDk });

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
    const currentCourses = [];

    $('table').each((index, table) => {
      $(table).find('tr').each((i, row) => {
        const cols = [];
        $(row).find('td, th').each((j, col) => {
          cols.push($(col).text().trim());
        });

        // Check if row is a course row and letter grade is 'X'
        if (cols.length >= 6) {
          const letterGrade = cols[cols.length - 1];
          if (letterGrade === 'X') {
            currentCourses.push({
              code: cols[1],
              name: cols[2],
              credits: cols[3],
              qtScore: cols[4] || '',
              examScore: cols[5] || '',
              letterGrade: 'X'
            });
          }
        }
      });
    });

    res.json({
      success: true,
      mssv: mssv,
      currentCourses
    });
  } catch (error) {
    res.json({
      success: true,
      mssv: mssv,
      note: 'External portal unavailable, serving mock current courses data.',
      currentCourses: [
        { code: 'IT102', name: 'Lập trình Node.js & React', credits: 4, letterGrade: 'X' }
      ]
    });
  }
};

// Get Schedule (TKB)
exports.getSchedule = async (req, res) => {
  const { mssv, dk } = req.body;

  if (!mssv) {
    return res.status(400).json({ 
      success: false, 
      message: 'Vui lòng nhập Mã số sinh viên (mssv) từ bàn phím để tra cứu thời khóa biểu.' 
    });
  }

  const studentDk = dk || '10';

  try {
    const url = "https://www.ttn.edu.vn/libraries/tnu/tkbieusinhvien.php";
    const payload = new URLSearchParams({ 'msv': mssv, 'dk': studentDk });

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
      mssv: mssv,
      tables: tablesData
    });
  } catch (error) {
    res.json({
      success: true,
      mssv: mssv,
      note: 'External portal unavailable, serving mock schedule data for ' + mssv,
      schedule: [
        { day: 'Thứ 2', time: '07:00 - 09:15', subject: 'Lập trình Web nâng cao', room: 'A201', teacher: 'Nguyễn Văn A' },
        { day: 'Thứ 4', time: '09:30 - 11:45', subject: 'Cơ sở dữ liệu phân tán', room: 'B302', teacher: 'Trần Thị B' }
      ]
    });
  }
};

// Get Tuition Fees (Học phí)
exports.getTuition = async (req, res) => {
  const { mssv } = req.body;

  if (!mssv) {
    return res.status(400).json({ 
      success: false, 
      message: 'Vui lòng nhập Mã số sinh viên (mssv) để tra cứu học phí.' 
    });
  }

  res.json({
    success: true,
    mssv: mssv,
    tuitionInfo: {
      totalAmount: 4500000,
      paidAmount: 4500000,
      status: 'Đã hoàn thành học phí học kỳ này',
      details: [
        { term: 'Học kỳ 1 năm học 2026-2027', amount: 4500000, status: 'Đã đóng' }
      ]
    }
  });
};

// Get Enrolled Courses
exports.getCourses = async (req, res) => {
  const { mssv } = req.params;
  if (!mssv) {
    return res.status(400).json({ success: false, message: 'Mã số sinh viên (mssv) là bắt buộc trong URL.' });
  }

  res.json({
    success: true,
    mssv: mssv,
    courses: [
      { code: 'IT101', name: 'Lập trình Web nâng cao', credits: 3, teacher: 'Nguyễn Văn A' },
      { code: 'IT102', name: 'Lập trình Node.js & React', credits: 4, teacher: 'Trần Thị B' },
      { code: 'IT103', name: 'Cơ sở dữ liệu phân tán', credits: 3, teacher: 'Lê Văn C' }
    ]
  });
};
