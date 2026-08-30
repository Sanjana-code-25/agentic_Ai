const express = require('express');
const router = express.Router();
const {
  getMyComplaints,
  createComplaint,
  getComplaintById,
  classifyImage,
  submitFeedback,
} = require('../controllers/complaintController');
const { verifyToken, verifyStudent } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All complaint routes require at least authenticated user
router.use(verifyToken);

// Student-specific operations
router.get('/my-complaints', verifyStudent, getMyComplaints);
router.post('/', verifyStudent, upload.single('image'), createComplaint);
router.post('/classify-image', verifyStudent, upload.single('image'), classifyImage);
router.post('/:id/feedback', verifyStudent, submitFeedback);

// Single complaint view (Student can view own, Admin can view any)
router.get('/:id', getComplaintById);

module.exports = router;
