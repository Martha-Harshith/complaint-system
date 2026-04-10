const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      required: true,
    },
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
    },
    category: {
      type:     String,
      enum:     ['Technical', 'Billing', 'Service', 'Product', 'Other'],
      required: [true, 'Category is required'],
    },
    status: {
      type:    String,
      enum:    ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type:    String,
      enum:    ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    adminComment: {
      type:    String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
