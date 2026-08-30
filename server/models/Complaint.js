const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complaint must belong to a student'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a complaint category'],
      enum: [
        'Classroom',
        'Lab',
        'Hostel',
        'Wi-Fi',
        'Cleanliness',
        'Infrastructure',
        'Transportation',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please describe your complaint in detail'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please specify the location (e.g. Block B, Room 302)'],
      trim: true,
    },
    imageURL: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed',
      ],
      default: 'Submitted',
    },
    assignedTo: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    adminComments: {
      type: String,
      trim: true,
      default: '',
    },
    resolutionDetails: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionDurationHours: {
      type: Number,
      default: null,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      comment: {
        type: String,
        trim: true,
        default: '',
      },
      submittedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering
complaintSchema.index({ studentId: 1, createdAt: -1 });
complaintSchema.index({ status: 1, category: 1, priority: 1 });
complaintSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Complaint', complaintSchema);
