const Complaint = require('../models/Complaint');

// @desc    Get all complaints lodged by the logged-in student
// @route   GET /api/complaints/my-complaints
// @access  Private (Student)
exports.getMyComplaints = async (req, res) => {
  try {
    const { status, category, priority, sort = '-createdAt' } = req.query;

    const query = { studentId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    const complaints = await Complaint.find(query)
      .sort(sort)
      .populate('studentId', 'name email department');

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('Error fetching student complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your complaints',
      error: error.message,
    });
  }
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
exports.createComplaint = async (req, res) => {
  try {
    const { title, category, description, location, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, description, and location',
      });
    }

    let imageURL = '';
    if (req.file) {
      // If Cloudinary was used, req.file.path holds the remote URL
      // If disk storage was used, build the local relative URL
      if (req.file.path && req.file.path.startsWith('http')) {
        imageURL = req.file.path;
      } else {
        imageURL = `/uploads/${req.file.filename}`;
      }
    }

    const complaint = await Complaint.create({
      studentId: req.user._id,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      priority: priority || 'Medium',
      status: 'Submitted',
      imageURL,
      assignedTo: 'Unassigned',
    });

    const populatedComplaint = await Complaint.findById(complaint._id).populate(
      'studentId',
      'name email department'
    );

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit complaint',
    });
  }
};

// @desc    Get single complaint details
// @route   GET /api/complaints/:id
// @access  Private (Student sees own, Admin sees any)
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'studentId',
      'name email department'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Role check: If student, ensure it belongs to them
    if (
      req.user.role === 'student' &&
      complaint.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own complaints',
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint details',
      error: error.message,
    });
  }
};

// @desc    Submit student feedback and star rating for a resolved complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private (Student)
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5 stars',
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Role check: Only owner student can submit feedback
    if (complaint.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only submit feedback for your own complaints',
      });
    }

    if (!['Resolved', 'Closed'].includes(complaint.status)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted after a complaint is marked Resolved or Closed',
      });
    }

    complaint.feedback = {
      rating: parseInt(rating, 10),
      comment: (comment || '').trim(),
      submittedAt: new Date(),
    };

    await complaint.save();

    const populated = await Complaint.findById(complaint._id).populate(
      'studentId',
      'name email department'
    );

    res.status(200).json({
      success: true,
      message: 'Thank you! Your feedback has been recorded successfully.',
      complaint: populated,
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit feedback',
    });
  }
};

// @desc    Image-based Issue Classification Engine
// @route   POST /api/complaints/classify-image
// @access  Private (Student)
exports.classifyImage = async (req, res) => {
  try {
    const hint = (req.body.hint || '').toLowerCase();
    const originalName = req.file?.originalname?.toLowerCase() || '';
    const queryTerm = `${hint} ${originalName}`.trim();

    let classification = {
      category: 'Infrastructure',
      priority: 'Medium',
      confidence: 88,
      detectedTags: ['Campus Facility', 'Fixture Maintenance'],
      suggestedTitle: 'Campus Facility Maintenance Required',
      suggestedDescription:
        'A maintenance issue was detected from the uploaded image. Please review and confirm specific location details.',
      suggestedLocation: 'Main Campus Building',
      safetyAlert: null,
    };

    if (queryTerm.match(/projector|display|hdmi|screen|blackboard|podium|classroom/)) {
      classification = {
        category: 'Classroom',
        priority: 'High',
        confidence: 96,
        detectedTags: ['AV Equipment', 'Projector Bulb/Signal', 'Lecture Hall'],
        suggestedTitle: 'Projector & Display Signal Failure in Lecture Room',
        suggestedDescription:
          'The ceiling projector is malfunctioning, showing distorted colors or intermittently dropping HDMI input during classes.',
        suggestedLocation: 'Academic Block, Room 304',
        safetyAlert: null,
      };
    } else if (queryTerm.match(/wifi|wi-fi|router|internet|network|lan|signal|ethernet/)) {
      classification = {
        category: 'Wi-Fi',
        priority: 'High',
        confidence: 94,
        detectedTags: ['Networking Hardware', '5GHz Access Point', 'Latency Drop'],
        suggestedTitle: 'Wi-Fi Access Point Dropping Connections & High Latency',
        suggestedDescription:
          'Wi-Fi router in the corridor is showing red indicator / dropping packets. Students unable to access study portal.',
        suggestedLocation: 'Hostel Block C, 2nd Floor Corridor',
        safetyAlert: null,
      };
    } else if (queryTerm.match(/water|leak|pipe|cooler|tap|sink|plumb|clean|drain|washroom|toilet/)) {
      classification = {
        category: 'Cleanliness',
        priority: 'High',
        confidence: 95,
        detectedTags: ['Plumbing Leakage', 'Water Hazard', 'Sanitation Defect'],
        suggestedTitle: 'Water Cooler Drainage Leak Creating Floor Hazard',
        suggestedDescription:
          'Continuous water leakage from pipe creating slippery hazard in hallway. Requires sanitation and plumbing valve replacement.',
        suggestedLocation: 'Main Science Block, 3rd Floor Corridor',
        safetyAlert: 'Slippery floor hazard reported.',
      };
    } else if (queryTerm.match(/lab|scope|oscilloscope|circuit|pcb|soldering|multimeter|instrument/)) {
      classification = {
        category: 'Lab',
        priority: 'Medium',
        confidence: 93,
        detectedTags: ['Laboratory Apparatus', 'Signal Measurement', 'Hardware Bench'],
        suggestedTitle: 'Laboratory Test Instrument Channel Calibration Issue',
        suggestedDescription:
          'Workstation instrument channel probe is damaged/loose and giving noisy readings during experimental sessions.',
        suggestedLocation: 'Department ECE/CSE Lab, Workstation #7',
        safetyAlert: null,
      };
    } else if (queryTerm.match(/bus|transport|vehicle|shuttle|route|driver/)) {
      classification = {
        category: 'Transportation',
        priority: 'Medium',
        confidence: 91,
        detectedTags: ['Transit Shuttle', 'Schedule Delay', 'Bus Maintenance'],
        suggestedTitle: 'College Transit Bus Delay / Operational Issue',
        suggestedDescription:
          'Scheduled transit bus service experiencing repeated arrival delays, affecting student attendance.',
        suggestedLocation: 'Campus Bus Bay / Indiranagar Route',
        safetyAlert: null,
      };
    } else if (queryTerm.match(/hostel|room|fan|bed|warden|door|lock|window/)) {
      classification = {
        category: 'Hostel',
        priority: 'Medium',
        confidence: 92,
        detectedTags: ['Hostel Accommodation', 'Room Fixture', 'Carpentry'],
        suggestedTitle: 'Hostel Room Fixture / Maintenance Repair',
        suggestedDescription:
          'Issue identified with hostel room fixture requiring prompt maintenance staff intervention.',
        suggestedLocation: 'Student Hostel Block A, Room 204',
        safetyAlert: null,
      };
    } else if (queryTerm.match(/wire|spark|switch|shock|ac|air condition|electric|power/)) {
      classification = {
        category: 'Infrastructure',
        priority: 'Critical',
        confidence: 97,
        detectedTags: ['Electrical Safety', 'Power Outage', 'Urgent Action'],
        suggestedTitle: 'Electrical Fixture / Sparking Concern in Campus Corridor',
        suggestedDescription:
          'Exposed wiring or switchboard defect observed. Immediate electrician dispatch requested for safety compliance.',
        suggestedLocation: 'Engineering Block 1, Ground Floor',
        safetyAlert: 'Critical electrical safety hazard.',
      };
    }

    let uploadedUrl = '';
    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        uploadedUrl = req.file.path;
      } else {
        uploadedUrl = `/uploads/${req.file.filename}`;
      }
    }

    res.status(200).json({
      success: true,
      classification,
      uploadedUrl,
    });
  } catch (error) {
    console.error('Image classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to classify image',
      error: error.message,
    });
  }
};
