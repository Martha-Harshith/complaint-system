const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getStats,
} = require('../controllers/complaintController');

router.post('/',             protect,            createComplaint);
router.get('/my',            protect,            getMyComplaints);
router.get('/all',           protect, adminOnly, getAllComplaints);
router.get('/stats',         protect, adminOnly, getStats);
router.get('/:id',           protect,            getComplaintById);
router.put('/:id/status',    protect, adminOnly, updateComplaintStatus);
router.delete('/:id',        protect, adminOnly, deleteComplaint);

module.exports = router;
