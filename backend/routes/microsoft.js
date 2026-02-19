const express = require('express');
const axios = require('axios');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// Microsoft 365 configuration
const MICROSOFT_TENANT_ID = process.env.MICROSOFT_TENANT_ID;
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;

// Get available SKUs/licenses
router.get('/skus', authenticateToken, async (req, res) => {
  try {
    // Get token from Microsoft
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
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

    // Transform to a usable format (removed TypeScript annotation)
    const skus = skusResponse.data.value.map(sku => ({
      skuId: sku.skuId,
      skuPartNumber: sku.skuPartNumber,
      prepaidUnits: sku.prepaidUnits.enabled,
      consumedUnits: sku.consumedUnits,
      // Add a formatted display name
      displayName: `${sku.skuPartNumber} (${sku.consumedUnits}/${sku.prepaidUnits.enabled} used)`
    }));

    res.json(skus);
  } catch (error) {
    console.error('Error fetching SKUs:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch SKUs' });
  }
});

// Get Microsoft token for frontend
router.get('/token', authenticateToken, async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      })
    );

    res.json({
      accessToken: tokenResponse.data.access_token,
      expiresIn: tokenResponse.data.expires_in
    });
  } catch (error) {
    console.error('Error getting Microsoft token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get Microsoft token' });
  }
});

module.exports = router;