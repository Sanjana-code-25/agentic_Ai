require('dotenv').config();
const http = require('http');
const app = require('./server');
const mongoose = require('mongoose');

// Start server on a test port
const server = app.listen(5099, async () => {
  console.log('[Test] Test server running on port 5099');

  try {
    // Helper for JSON requests
    const makeRequest = (options, postData = null) => {
      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              resolve({
                status: res.statusCode,
                data: JSON.parse(body),
              });
            } catch (e) {
              resolve({ status: res.statusCode, text: body });
            }
          });
        });
        req.on('error', reject);
        if (postData) {
          req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
        }
        req.end();
      });
    };

    console.log('\n--- 1. Testing Health Endpoint ---');
    const health = await makeRequest({
      hostname: '127.0.0.1',
      port: 5099,
      path: '/api/health',
      method: 'GET',
    });
    console.log('Health check status:', health.status, health.data?.status);

    console.log('\n--- 2. Testing Student Registration ---');
    const regRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5099,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Test Student User',
        email: `teststudent_${Date.now()}@college.edu`,
        password: 'Password@123',
        role: 'student',
        department: 'IT',
      }
    );
    console.log('Register status:', regRes.status, 'User:', regRes.data?.user?.email);
    const studentToken = regRes.data?.token;

    console.log('\n--- 3. Testing Admin Login ---');
    // First register admin if needed
    const adminReg = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5099,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Super Admin',
        email: `admin_${Date.now()}@college.edu`,
        password: 'Admin@123',
        role: 'admin',
        department: 'Administration',
      }
    );
    const adminToken = adminReg.data?.token;
    console.log('Admin registered & authenticated with token');

    console.log('\n--- 4. Testing Student Complaint Submission ---');
    const compRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5099,
        path: '/api/complaints',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
      },
      {
        title: 'Broken Light in Hostel Room 204',
        category: 'Hostel',
        location: 'Block B, 2nd Floor',
        priority: 'High',
        description: 'The ceiling tube light is fused and sparks intermittently.',
      }
    );
    console.log('Complaint created:', compRes.status, compRes.data?.complaint?._id);
    const complaintId = compRes.data?.complaint?._id;

    console.log('\n--- 5. Testing Student Get My Complaints ---');
    const myComplaints = await makeRequest({
      hostname: '127.0.0.1',
      port: 5099,
      path: '/api/complaints/my-complaints',
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log('Student complaints count:', myComplaints.data?.count);

    console.log('\n--- 6. Testing Admin Stats ---');
    const statsRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5099,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('Admin stats:', statsRes.data?.stats);

    console.log('\n--- 7. Testing Admin Update Complaint ---');
    const updateRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5099,
        path: `/api/admin/complaints/${complaintId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        status: 'In Progress',
        assignedTo: 'Campus Electrical Division',
        adminComments: 'Electrician dispatched.',
        resolutionDetails: 'Replacing bulb ballasts.',
      }
    );
    console.log('Admin update status:', updateRes.status, updateRes.data?.complaint?.status);

    console.log('\n✅ All API tests passed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close(() => {
      console.log('[Test] Server closed.');
      process.exit(0);
    });
  }
});
