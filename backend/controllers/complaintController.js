const Complaint = require('../models/Complaint');
const User      = require('../models/User');
const {
  notifyComplaintRegistered,
  notifyStatusUpdate,
} = require('../services/notificationService');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = async (req, res) => {
  const { title, description, category, priority } = req.body;
  try {
    const complaint = await Complaint.create({
      user:        req.user._id,
      title,
      description,
      category,
      priority:    priority || 'Medium',
    });

    // Send SMS + Email notification to user
    await notifyComplaintRegistered(req.user, complaint);

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get complaints of logged-in user
// @route   GET /api/complaints/my
// @access  Private (User)
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort('-createdAt');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints/all
// @access  Private (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate('user', 'name email phone')
      .sort('-createdAt');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email phone');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update complaint status (Admin)
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin)
exports.updateComplaintStatus = async (req, res) => {
  const { status, adminComment } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status       = status       || complaint.status;
    complaint.adminComment = adminComment || complaint.adminComment;
    if (status === 'Resolved') complaint.resolvedAt = Date.now();

    await complaint.save();

    // Notify user about status change via SMS + Email
    const user = await User.findById(complaint.user);
    await notifyStatusUpdate(user, complaint);

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/complaints/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const total      = await Complaint.countDocuments();
    const pending    = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved   = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected   = await Complaint.countDocuments({ status: 'Rejected' });
    res.json({ total, pending, inProgress, resolved, rejected });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
