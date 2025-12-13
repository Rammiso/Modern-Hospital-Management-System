const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function testEndpoints() {
  console.log('🧪 Testing Consultation Workflow Endpoints...\n');

  try {
    // Test 1: Get Ethiopian MOH Lab Tests
    console.log('1. Testing GET /api/lab/tests');
    const labTests = await axios.get(`${BASE_URL}/lab/tests`, {
      headers: { Authorization: 'Bearer dummy-token' }
    });
    console.log(`✅ Lab tests loaded: ${labTests.data.data.length} tests`);
    console.log(`   Sample test: ${labTests.data.data[0].test_name}\n`);

    // Test 2: Get ongoing consultations (should return empty for dummy doctor)
    console.log('2. Testing GET /api/consultations/ongoing');
    const ongoing = await axios.get(`${BASE_URL}/consultations/ongoing?doctorId=dummy-doctor-id`, {
      headers: { Authorization: 'Bearer dummy-token' }
    });
    console.log(`✅ Ongoing consultations: ${ongoing.data.data.length} consultations\n`);

    // Test 3: Health check
    console.log('3. Testing GET /api/health');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health check: ${health.data.message}\n`);

    console.log('🎉 All endpoints are working correctly!');
    console.log('\n📋 Available Workflow Endpoints:');
    console.log('   GET  /api/consultations/ongoing?doctorId=xxx');
    console.log('   POST /api/consultations/save-draft');
    console.log('   POST /api/consultations/send-lab-request');
    console.log('   POST /api/consultations/finish');
    console.log('   GET  /api/appointments/:id/consultation-or-create');
    console.log('   GET  /api/lab-requests/:id/status');
    console.log('   GET  /api/lab/tests');
    console.log('   GET  /api/patients/:id/medical-history');

  } catch (error) {
    if (error.response) {
      console.log(`❌ Error ${error.response.status}: ${error.response.data.message || error.response.data.error}`);
    } else {
      console.log(`❌ Network Error: ${error.message}`);
    }
  }
}

testEndpoints();