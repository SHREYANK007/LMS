// Test script to verify API endpoints
const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  // Test 1: Check if server is running
  console.log('1. Testing server health...');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✓ Server health check:', data);
  } catch (error) {
    console.error('✗ Server is not running or accessible:', error.message);
    return;
  }

  // Test 2: Test login with admin credentials
  console.log('\n2. Testing login endpoint...');
  console.log('Using credentials: admin@lms.com / admin123');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@lms.com',
        password: 'admin123'
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✓ Login successful:', {
        success: data.success,
        user: data.user,
        hasToken: !!data.token
      });
    } else {
      console.log('✗ Login failed:', data);
    }
  } catch (error) {
    console.error('✗ Login request failed:', error.message);
  }

  // Test 3: Test CORS headers
  console.log('\n3. Testing CORS headers...');
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });

    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
    };

    console.log('✓ CORS headers:', corsHeaders);
  } catch (error) {
    console.error('✗ CORS check failed:', error.message);
  }
}

// Run tests
console.log('Starting API tests...');
console.log('Make sure backend is running on port 5000\n');
testAPI();