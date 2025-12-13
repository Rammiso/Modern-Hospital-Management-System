const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: `/api${path}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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

async function testDoctorsNoAuth() {
  console.log('🧪 Testing Doctors Endpoint (No Auth)...\n');

  try {
    console.log('Testing GET /api/doctors-test');
    const result = await makeRequest('/doctors-test');
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, JSON.stringify(result.data, null, 2));

  } catch (error) {
    console.log(`❌ Connection Error: ${error.message}`);
  }
}

testDoctorsNoAuth();