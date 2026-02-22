require('dotenv').config();
const axios = require('axios');

async function testMicrosoft() {
  console.log('🔍 Testing Microsoft connection...');
  console.log('📋 Configuration:', {
    tenantId: process.env.MICROSOFT_TENANT_ID ? '✅ Set' : '❌ Missing',
    clientId: process.env.MICROSOFT_CLIENT_ID ? '✅ Set' : '❌ Missing',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
    tenantIdValue: process.env.MICROSOFT_TENANT_ID,
    clientIdValue: process.env.MICROSOFT_CLIENT_ID,
  });

  try {
    // Test token endpoint
    console.log('\n📡 Requesting token from Microsoft...');
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✅ Token obtained successfully!');
    console.log('📊 Token expires in:', tokenResponse.data.expires_in, 'seconds');
    console.log('🔑 Token preview:', tokenResponse.data.access_token.substring(0, 20) + '...');
    
    // Test Graph API
    console.log('\n📡 Testing Graph API access...');
    const graphResponse = await axios.get(
      'https://graph.microsoft.com/v1.0/subscribedSkus',
      {
        headers: {
          'Authorization': `Bearer ${tokenResponse.data.access_token}`
        }
      }
    );
    
    console.log('✅ Graph API accessed successfully!');
    console.log('📊 Found', graphResponse.data.value.length, 'SKUs');
    
    if (graphResponse.data.value.length > 0) {
      console.log('\n📦 Sample SKU:', {
        skuPartNumber: graphResponse.data.value[0].skuPartNumber,
        skuId: graphResponse.data.value[0].skuId,
        consumedUnits: graphResponse.data.value[0].consumedUnits,
        prepaidUnits: graphResponse.data.value[0].prepaidUnits?.enabled
      });
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📊 Data:', JSON.stringify(error.response.data, null, 2));
      console.error('📊 Headers:', error.response.headers);
      
      // Provide specific guidance based on error
      if (error.response.data.error === 'invalid_client') {
        console.error('\n💡 TROUBLESHOOTING:');
        console.error('1. Your client secret is likely invalid or expired');
        console.error('2. Go to https://entra.microsoft.com → App Registrations');
        console.error('3. Find your app → Certificates & secrets');
        console.error('4. Create a NEW client secret and update your .env file');
      }
      else if (error.response.data.error === 'invalid_tenant') {
        console.error('\n💡 TROUBLESHOOTING:');
        console.error('1. Your tenant ID might be incorrect');
        console.error('2. Check if the app is registered in this tenant');
      }
      else if (error.response.status === 403 || error.response.status === 401) {
        console.error('\n💡 TROUBLESHOOTING:');
        console.error('1. Your app needs API permissions');
        console.error('2. Go to Azure Portal → App Registrations → Your App');
        console.error('3. Click "API Permissions"');
        console.error('4. Add: Microsoft Graph → Application permissions → Directory.Read.All');
        console.error('5. Click "Grant admin consent"');
      }
    } else if (error.request) {
      console.error('📡 No response received from Microsoft');
      console.error('💡 Check your network connection');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testMicrosoft();
