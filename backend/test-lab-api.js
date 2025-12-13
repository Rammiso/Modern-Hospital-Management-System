const axios = require('axios');

async function testLabAPI() {
  try {
    console.log('Testing Lab Requests API...\n');
    
    const response = await axios.get('http://localhost:4000/api/lab-requests');
    
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Total Records:', response.data.total);
    console.log('\nFirst 3 Records:');
    console.log(JSON.stringify(response.data.data.slice(0, 3), null, 2));
    
    // Check if patient_name is present
    const firstRecord = response.data.data[0];
    console.log('\nFirst Record Fields:');
    console.log('- ID:', firstRecord?.id);
    console.log('- Test Name:', firstRecord?.test_name);
    console.log('- Patient Name:', firstRecord?.patient_name || 'MISSING');
    console.log('- Patient ID:', firstRecord?.patient_id || 'MISSING');
    console.log('- Status:', firstRecord?.status);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testLabAPI();
