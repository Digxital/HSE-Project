const express = require('express');
const axios = require('axios');
const router = express.Router();

// Import authentication middleware
const { authenticateToken } = require('../middleware/auth.middleware');

// Get available SKUs/licenses - protected by authentication
router.get('/skus', authenticateToken, async (req, res) => {
  try {
    // Get token from Microsoft
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      })
    );

    const accessToken = tokenResponse.data.access_token;

    // Get SKUs from Microsoft Graph
    const skusResponse = await axios.get(
      'https://graph.microsoft.com/v1.0/subscribedSkus',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    // Format the response for better frontend consumption
    const formattedSkus = skusResponse.data.value.map(sku => ({
      skuId: sku.skuId,
      skuPartNumber: sku.skuPartNumber,
      displayName: getFriendlySkuName(sku.skuPartNumber),
      totalLicenses: sku.prepaidUnits?.enabled || 0,
      usedLicenses: sku.consumedUnits,
      availableLicenses: (sku.prepaidUnits?.enabled || 0) - sku.consumedUnits,
      servicePlans: sku.servicePlans,
      capabilityStatus: sku.capabilityStatus
    }));

    res.json(formattedSkus);
  } catch (error) {
    console.error('Error fetching SKUs:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch SKUs',
      details: error.response?.data || error.message 
    });
  }
});

// Get Microsoft token for frontend - also protected
router.get('/token', authenticateToken, async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      })
    );

    res.json({
      accessToken: tokenResponse.data.access_token,
      expiresIn: tokenResponse.data.expires_in,
      tokenType: tokenResponse.data.token_type
    });
  } catch (error) {
    console.error('Error getting Microsoft token:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get Microsoft token',
      details: error.response?.data || error.message
    });
  }
});

// Helper function to make SKU names more readable
function getFriendlySkuName(skuPartNumber) {
  const skuNames = { 
    'VISIOCLIENT': 'Visio Plan',
    'O365_BUSINESS_ESSENTIALS': 'Microsoft 365 Business Essentials',
    'O365_BUSINESS_PREMIUM': 'Microsoft 365 Business Premium',
    'ENTERPRISEPACK': 'Microsoft 365 E3',
    'ENTERPRISEPREMIUM': 'Microsoft 365 E5',
    'FLOW_FREE': 'Power Automate Free',
    'POWER_BI_PRO': 'Power BI Pro',
    'PROJECT_ONLINE_PLAN_1': 'Project Online Plan 1',
    'PROJECT_ONLINE_PLAN_3': 'Project Online Plan 3',
    'TEAMS_FREE': 'Microsoft Teams Free',
    'WIN_10_ENT_A3': 'Windows 10 Enterprise A3',
    'WIN_10_ENT_A5': 'Windows 10 Enterprise A5'
  };
  
  return skuNames[skuPartNumber] || skuPartNumber.replace(/_/g, ' ').replace(/\w\S*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

module.exports = router;