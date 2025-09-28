// Simple test script to create a session and verify calendar integration
const fetch = require('node-fetch');

const testSession = async () => {
  try {
    const apiUrl = 'http://localhost:5000';

    // First, login to get a token (you'll need to provide actual credentials)
    console.log('Testing session creation...');

    const sessionData = {
      title: 'Test PTE Session',
      description: 'Test session to verify calendar integration',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      sessionType: 'ONE_TO_ONE',
      courseType: 'PTE'
    };

    // You'll need to replace 'YOUR_TOKEN_HERE' with an actual JWT token
    const token = 'YOUR_TOKEN_HERE';

    const response = await fetch(`${apiUrl}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionData)
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    // Check all sessions
    const allSessionsResponse = await fetch(`${apiUrl}/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const sessions = await allSessionsResponse.json();
    console.log('\nAll sessions:', sessions);

  } catch (error) {
    console.error('Test failed:', error);
  }
};

console.log('Run this after replacing YOUR_TOKEN_HERE with a real JWT token from the app');