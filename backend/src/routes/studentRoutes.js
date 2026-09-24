const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

/**
 * @swagger
 * /api/grades:
 *   post:
 *     summary: Lấy bảng điểm sinh viên và tự động cập nhật tên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradesRequest'
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/grades', studentController.getGrades);

/**
 * @swagger
 * /api/student/current-courses:
 *   post:
 *     summary: Lấy danh sách học phần đang học (lọc các học phần có điểm chữ là X)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradesRequest'
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/student/current-courses', studentController.getCurrentCourses);

/**
 * @swagger
 * /api/schedule:
 *   post:
 *     summary: Lấy thời khóa biểu (TKB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleRequest'
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/schedule', studentController.getSchedule);

/**
 * @swagger
 * /api/student/profile/{mssv}:
 *   get:
 *     summary: Lấy thông tin chi tiết sinh viên từ database
 *     parameters:
 *       - in: path
 *         name: mssv
 *         required: true
 *         schema:
 *           type: string
 *         example: 23103023
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/student/profile/:mssv', studentController.getProfile);

/**
 * @swagger
 * /api/student/tuition:
 *   post:
 *     summary: Lấy thông tin học phí sinh viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradesRequest'
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/student/tuition', studentController.getTuition);

/**
 * @swagger
 * /api/student/courses/{mssv}:
 *   get:
 *     summary: Lấy danh sách học phần đang học
 *     parameters:
 *       - in: path
 *         name: mssv
 *         required: true
 *         schema:
 *           type: string
 *         example: 23103023
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/student/courses/:mssv', studentController.getCourses);

module.exports = router;
