const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateComplaint,
  getAdminStats,
} = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// All admin routes require token and admin role
router.use(verifyToken, verifyAdmin);

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', updateComplaint);
router.get('/stats', getAdminStats);

module.exports = router;
