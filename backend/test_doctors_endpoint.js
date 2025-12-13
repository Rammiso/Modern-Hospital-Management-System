const http = require('http');

function makeRequest(path, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: `/api${path}`,
      method: 'GET',
      headers: headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testDoctorsEndpoint() {
  console.log('🧪 Testing Doctors Endpoint...\n');

  try {
    // Test without token
    console.log('1. Testing GET /api/doctors (no token)');
    const noToken = await makeRequest('/doctors');
    console.log(`Status: ${noToken.status}`);
    console.log(`Response:`, noToken.data);
    console.log();

    // Test with dummy token
    console.log('2. Testing GET /api/doctors (with dummy token)');
    const withToken = await makeRequest('/doctors', 'dummy-token');
    console.log(`Status: ${withToken.status}`);
    console.log(`Response:`, withToken.data);
    console.log();

    // Test health endpoint for comparison
    console.log('3. Testing GET /api/health (for comparison)');
    const health = await makeRequest('/health');
    console.log(`Status: ${health.status}`);
    console.log(`Response:`, health.data);

  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
  }
}

testDoctorsEndpoint();