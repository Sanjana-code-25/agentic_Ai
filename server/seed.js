require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Preparing demo records...');

    // Clear old data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('[Seed] Cleared existing users and complaints.');

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Dr. Ramesh Kulkarni (Admin)',
      email: 'admin@college.edu',
      password: 'Admin@123',
      role: 'admin',
      department: 'Campus Administration & Facilities',
    });

    // 2. Create Students
    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student@college.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Computer Science & Engineering',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@college.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Electronics & Communication',
    });

    const student3 = await User.create({
      name: 'Rohit Verma',
      email: 'rohit@college.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Mechanical Engineering',
    });

    console.log('[Seed] Created default users:');
    console.log('   - Admin:   admin@college.edu   / Admin@123');
    console.log('   - Student: student@college.edu / Student@123');
    console.log('   - Student: priya@college.edu   / Student@123');
    console.log('   - Student: rohit@college.edu   / Student@123');

    // 3. Create Sample Complaints with Time Tracking & Student Reviews
    const complaints = [
      {
        studentId: student1._id,
        title: 'Projector flickering & color distortion in Seminar Hall A',
        category: 'Classroom',
        description:
          'During today’s Distributed Systems lecture, the ceiling-mounted Epson projector in Seminar Hall A had extreme green tint distortion and kept losing HDMI signal every few minutes.',
        location: 'Academic Block 2, Floor 3, Room 304',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'IT & AV Support Team (Er. Rajesh)',
        adminComments:
          'IT technician dispatched. Replacement HDMI cable and lamp bulb being tested.',
        resolutionDetails: '',
      },
      {
        studentId: student1._id,
        title: 'High latency and packet drops on Hostel Block C Wi-Fi',
        category: 'Wi-Fi',
        description:
          'The 5GHz access point near Room 214 is constantly dropping packets. Speed test shows less than 0.5 Mbps and frequent disconnects during evening study hours.',
        location: 'Hostel Block C, 2nd Floor Corridor (AP-C2-04)',
        priority: 'High',
        status: 'Assigned',
        assignedTo: 'Network Infrastructure Division',
        adminComments:
          'Ticket forwarded to Campus NOC. Scheduled router firmware reboot and channel re-optimization.',
        resolutionDetails: '',
      },
      {
        studentId: student1._id,
        title: 'Water cooler drainage pipe leaking near 3rd floor elevator',
        category: 'Cleanliness',
        description:
          'Water is accumulating near the elevator landing creating a slippery hazard. The drainage hose seems cracked.',
        location: 'Main Science Block, 3rd Floor near Lift 2',
        priority: 'Medium',
        status: 'Resolved',
        assignedTo: 'Sanitation & Plumbing Staff (Mr. Suresh)',
        adminComments: 'Plumbing unit dispatched.',
        resolutionDetails:
          'Faulty drainage pipe replaced with reinforced PVC tube. Area cleaned and dried. Tested successfully.',
        resolvedAt: new Date(Date.now() - 3 * 3600 * 1000),
        resolutionDurationHours: 2.8,
        feedback: {
          rating: 5,
          comment: 'Fixed very fast! The floor was completely cleaned and dried.',
          submittedAt: new Date(Date.now() - 2 * 3600 * 1000),
        },
      },
      {
        studentId: student2._id,
        title: 'Digital Storage Oscilloscope Channel 2 damaged in VLSI Lab',
        category: 'Lab',
        description:
          'Bench #7 DSO Channel 2 probe connector is loose and reading noisy signals. Needs recalibration or probe replacement before next semester lab exam.',
        location: 'Department of ECE, VLSI Lab (Room 112)',
        priority: 'Medium',
        status: 'Under Review',
        assignedTo: 'Lab In-charge & Tech Assistant',
        adminComments: 'Bench #7 marked as maintenance needed.',
        resolutionDetails: '',
      },
      {
        studentId: student2._id,
        title: 'North Gate automatic RFID pedestrian turnstile jammed',
        category: 'Infrastructure',
        description:
          'The right-side turnstile at North Gate is mechanically locked. Students are bottle-necking during 8:45 AM morning rush.',
        location: 'North Campus Entrance Barrier 2',
        priority: 'Critical',
        status: 'Closed',
        assignedTo: 'Campus Security & Estate Maintenance',
        adminComments: 'Immediate repair initiated by estate engineering.',
        resolutionDetails:
          'Internal motor gear cleared of debris and calibrated. Full turnstile operational test passed.',
        resolvedAt: new Date(Date.now() - 24 * 3600 * 1000),
        resolutionDurationHours: 4.2,
        feedback: {
          rating: 5,
          comment: 'Turnstile is working smoothly now. Great turnaround time!',
          submittedAt: new Date(Date.now() - 20 * 3600 * 1000),
        },
      },
      {
        studentId: student3._id,
        title: 'College Bus Route #4 arriving 25 minutes late consistently',
        category: 'Transportation',
        description:
          'Bus Route 4 (Indiranagar to Campus) has been missing the scheduled 8:00 AM stop continuously for the past week, causing students to miss first hour attendance.',
        location: 'Bus Route #4 (Stop: Indiranagar Metro Station)',
        priority: 'Low',
        status: 'Submitted',
        assignedTo: 'Transport Coordinator',
        adminComments: '',
        resolutionDetails: '',
      },
      {
        studentId: student3._id,
        title: 'Air conditioning unit making loud rattling noise in Library Study Zone',
        category: 'Infrastructure',
        description:
          'The split AC in the quiet reading zone has severe fan vibration noise, disrupting study sessions.',
        location: 'Central Library, 1st Floor Quiet Reading Zone',
        priority: 'Medium',
        status: 'Submitted',
        assignedTo: 'Unassigned',
        adminComments: '',
        resolutionDetails: '',
      },
    ];

    await Complaint.insertMany(complaints);
    console.log(`[Seed] Seeded ${complaints.length} sample complaints across all categories!`);
    console.log('[Seed] Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
