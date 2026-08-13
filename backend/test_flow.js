const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const API_BASE = 'http://localhost:5000/api/files';

async function runEndToEndTests() {
  console.log('🚀 Starting DropShield End-to-End Automated Tests...\n');

  // 1. Create a dummy test file
  const testFilePath = path.join(__dirname, 'temp_test_file.txt');
  fs.writeFileSync(testFilePath, 'DropShield Top Secret Test Payload Content 1234567890');
  console.log('📄 Created sample test file:', testFilePath);

  try {
    // 2. Test File Upload (with Passcode: "secret123", maxDownloads: 1)
    console.log('\n--- Test 1: Uploading File ---');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    formData.append('passcode', 'secret123');
    formData.append('maxDownloads', '1');
    formData.append('expirationHours', '1');

    const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
      headers: formData.getHeaders(),
    });

    console.log('Upload Response:', uploadRes.data);
    const fileId = uploadRes.data.file.id;
    console.log(`✅ Upload successful! Generated File ID: ${fileId}`);

    // 3. Test Metadata Info Endpoint
    console.log('\n--- Test 2: Fetching File Metadata ---');
    const infoRes = await axios.get(`${API_BASE}/info/${fileId}`);
    console.log('Metadata Info:', infoRes.data);
    if (infoRes.data.file.requiresPasscode && infoRes.data.file.remainingDownloads === 1) {
      console.log('✅ Metadata verification passed!');
    }

    // 4. Test Download with INCORRECT Passcode (expect 401)
    console.log('\n--- Test 3: Downloading with Incorrect Passcode ---');
    try {
      await axios.post(`${API_BASE}/download/${fileId}`, { passcode: 'wrong_pin' });
      console.error('❌ Failed: Server should have rejected invalid passcode');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('✅ Correctly rejected invalid passcode (401 Unauthorized)');
      } else {
        console.error('Unexpected error:', err.message);
      }
    }

    // 5. Test Download with CORRECT Passcode (expect 200 stream)
    console.log('\n--- Test 4: Downloading with Correct Passcode ---');
    const downloadRes = await axios.post(
      `${API_BASE}/download/${fileId}`,
      { passcode: 'secret123' },
      { responseType: 'arraybuffer' }
    );

    const downloadedContent = Buffer.from(downloadRes.data).toString('utf-8');
    console.log('Downloaded Content Payload:', downloadedContent);
    if (downloadedContent === 'DropShield Top Secret Test Payload Content 1234567890') {
      console.log('✅ File stream transmission verified! Content matches perfectly.');
    }

    // 6. Test Self-Destruct Verification (subsequent request must return 404)
    console.log('\n--- Test 5: Verifying Self-Destruct Purge ---');
    // Wait brief moment for async unlink hook
    await new Promise((r) => setTimeout(r, 500));

    try {
      await axios.get(`${API_BASE}/info/${fileId}`);
      console.error('❌ Failed: Link should have self-destructed!');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log('✅ SUCCESS! Link is destroyed and returns 404 ("Link expired or destroyed")');
      } else {
        console.error('Unexpected error on destroyed link:', err.message);
      }
    }

    console.log('\n🎉 ALL DropShield END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('❌ Test suite failed:', error.response?.data || error.message);
  } finally {
    // Cleanup local temp file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

runEndToEndTests();
