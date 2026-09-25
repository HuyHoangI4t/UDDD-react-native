const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campusController');



/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Gửi phản hồi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeedbackRequest'
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/feedback', campusController.submitFeedback);

/**
 * @swagger
 * /api/sos:
 *   post:
 *     summary: Gửi cảnh báo khẩn cấp SOS
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SosRequest'
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/sos', campusController.submitSos);

/**
 * @swagger
 * /api/map:
 *   get:
 *     summary: Lấy vị trí bản đồ khuôn viên
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/map', campusController.getMapLocations);

module.exports = router;
