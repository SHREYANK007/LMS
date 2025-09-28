// Simple test to verify backend endpoints
const fetch = require('node-fetch');

async function testEndpoints() {
  const baseUrl = 'http://localhost:5000';

  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    // Test admin students endpoint (should require auth)
    const studentsResponse = await fetch(`${baseUrl}/admin/students`);
    console.log('Students endpoint status:', studentsResponse.status);

    // Test admin tutors endpoint (should require auth)
    const tutorsResponse = await fetch(`${baseUrl}/admin/tutors`);
    console.log('Tutors endpoint status:', tutorsResponse.status);

  } catch (error) {
    console.error('Error testing endpoints:', error.message);
  }
}

testEndpoints();