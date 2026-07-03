const axios = require('axios');

// Replace with your actual auth token from a logged-in user
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';
const BASE_URL = 'http://localhost:5000';

async function testFCMEndpoints() {
    try {
        // 1. Test registering a token
        console.log('📝 Testing token registration...');
        const registerRes = await axios.patch(
            `${BASE_URL}/api/device/fcm-token`,
            { token: 'test-token-' + Date.now() },
            { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
        );
        console.log('✅ Token registered:', registerRes.data);

        // 2. Test checking token status
        console.log('\n🔍 Checking token status...');
        const statusRes = await axios.get(
            `${BASE_URL}/api/device/fcm-token/status`,
            { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
        );
        console.log('✅ Token status:', statusRes.data);

        // 3. Test sending a notification (if you have a notification endpoint)
        // This will require a real FCM token from a device

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testFCMEndpoints();
