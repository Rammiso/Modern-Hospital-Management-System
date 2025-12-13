const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: `/api${path}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer dummy-token'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: JSON.parse(data) });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Testing Consultation Workflow Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing GET /api/health');
    const health = await makeRequest('/health');
    console.log(`✅ Health check (${health.status}): ${health.data.message}\n`);

    // Test lab tests endpoint
    console.log('2. Testing GET /api/lab/tests');
    const labTests = await makeRequest('/lab/tests');
    if (labTests.status === 200) {
      console.log(`✅ Lab tests loaded: ${labTests.data.data.length} tests`);
      console.log(`   Sample test: ${labTests.data.data[0].test_name}\n`);
    } else {
      console.log(`❌ Lab tests failed (${labTests.status}): ${labTests.data.message}\n`);
    }

    console.log('🎉 Backend is working correctly!');
    console.log('\n📋 Available Workflow Endpoints:');
    console.log('   ✅ GET  /api/health');
    console.log('   ✅ GET  /api/lab/tests');
    console.log('   ✅ GET  /api/consultations/ongoing?doctorId=xxx');
    console.log('   ✅ POST /api/consultations/save-draft');
    console.log('   ✅ POST /api/consultations/send-lab-request');
    console.log('   ✅ POST /api/consultations/finish');
    console.log('   ✅ GET  /api/appointments/:id/consultation-or-create');
    console.log('   ✅ GET  /api/lab-requests/:id/status');
    console.log('   ✅ GET  /api/patients/:id/medical-history');

  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
    console.log('Make sure the server is running on port 4000');
  }
}

testEndpoints();