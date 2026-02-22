const express = require('express');
const axios = require('axios');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// Microsoft 365 configuration
const MICROSOFT_TENANT_ID = process.env.MICROSOFT_TENANT_ID;
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;

// Helper function to get Microsoft Graph access token
async function getMicrosoftAccessToken() {
  try {
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return tokenResponse.data.access_token;
  } catch (error) {
    console.error('Error getting Microsoft token:', error.response?.data || error.message);
    throw new Error('Failed to get Microsoft access token');
  }
}

// ========== SKU ROUTES ==========
router.get('/skus', authenticateToken, async (req, res) => {
  try {
    console.log('📡 Fetching Microsoft SKUs...');
    const accessToken = await getMicrosoftAccessToken();
    
    const skusResponse = await axios.get(
      'https://graph.microsoft.com/v1.0/subscribedSkus',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

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

    console.log(`✅ Found ${formattedSkus.length} SKUs`);
    res.json(formattedSkus);
  } catch (error) {
    console.error('❌ Error fetching SKUs:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch SKUs',
      details: error.response?.data || error.message 
    });
  }
});

// ========== TOKEN ROUTE ==========
router.get('/token', authenticateToken, async (req, res) => {
  try {
    console.log('📡 Fetching Microsoft token...');
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      })
    );

    console.log('✅ Microsoft token obtained successfully');
    res.json({
      accessToken: tokenResponse.data.access_token,
      expiresIn: tokenResponse.data.expires_in,
      tokenType: tokenResponse.data.token_type
    });
  } catch (error) {
    console.error('❌ Error getting Microsoft token:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get Microsoft token',
      details: error.response?.data || error.message 
    });
  }
});

// ========== CREATE MICROSOFT USER ==========
router.post('/users', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, jobTitle, department, usageLocation = 'US' } = req.body;
    
    console.log('📝 Creating Microsoft 365 user:', { firstName, lastName, email });
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'firstName, lastName, and email are required'
      });
    }
    
    const accessToken = await getMicrosoftAccessToken();
    const password = generateRandomPassword();
    
    const createUserResponse = await axios.post(
      'https://graph.microsoft.com/v1.0/users',
      {
        accountEnabled: true,
        displayName: `${firstName} ${lastName}`,
        mailNickname: email.split('@')[0],
        userPrincipalName: email,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: password,
        },
        jobTitle: jobTitle || '',
        department: department || 'General',
        usageLocation: usageLocation,
        givenName: firstName,
        surname: lastName,
        mail: email,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Microsoft 365 user created:', createUserResponse.data.id);
    
    res.status(201).json({
      id: createUserResponse.data.id,
      displayName: createUserResponse.data.displayName,
      userPrincipalName: createUserResponse.data.userPrincipalName,
      mail: createUserResponse.data.mail,
      temporaryPassword: password,
      created: true
    });
    
  } catch (error) {
    console.error('❌ Error creating Microsoft 365 user:', error.response?.data || error.message);
    
    // Handle specific Microsoft Graph errors
    if (error.response?.data?.error) {
      const microsoftError = error.response.data.error;
      
      // Check for duplicate user
      if (microsoftError.code === 'Request_BadRequest' && 
          microsoftError.message.includes('already exists')) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this email already exists in Microsoft 365',
          details: microsoftError
        });
      }
      
      // Check for permission issues
      if (microsoftError.code === 'Authorization_RequestDenied') {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Microsoft Graph API permission denied. Check API permissions.',
          details: microsoftError
        });
      }
    }
    
    res.status(500).json({
      error: 'Failed to create Microsoft 365 user',
      details: error.response?.data || error.message
    });
  }
});

// ========== GET MICROSOFT USER ==========
router.get('/users/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📡 Fetching Microsoft user: ${userId}`);
    
    const accessToken = await getMicrosoftAccessToken();
    
    const userResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/users/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );
    
    console.log('✅ Microsoft user found');
    res.json(userResponse.data);
    
  } catch (error) {
    console.error('❌ Error fetching Microsoft user:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Microsoft 365 user not found'
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch Microsoft user',
      details: error.response?.data || error.message
    });
  }
});

// ========== ASSIGN LICENSE ==========
router.post('/users/:userId/assignLicense', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { skuId } = req.body;
    
    console.log(`📝 Assigning license ${skuId} to user ${userId}`);
    
    if (!skuId) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'skuId is required'
      });
    }
    
    const accessToken = await getMicrosoftAccessToken();
    
    const assignResponse = await axios.post(
      `https://graph.microsoft.com/v1.0/users/${userId}/assignLicense`,
      {
        addLicenses: [
          {
            disabledPlans: [],
            skuId: skuId,
          }
        ],
        removeLicenses: []
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ License assigned successfully');
    res.json({
      success: true,
      message: 'License assigned successfully',
      user: assignResponse.data
    });
    
  } catch (error) {
    console.error('❌ Error assigning license:', error.response?.data || error.message);
    
    if (error.response?.data?.error?.code === 'InsufficientLicenses') {
      return res.status(400).json({
        error: 'Insufficient licenses',
        message: 'No available licenses of this type',
        details: error.response.data.error
      });
    }
    
    res.status(500).json({
      error: 'Failed to assign license',
      details: error.response?.data || error.message
    });
  }
});

// ========== SEND WELCOME EMAIL ==========
router.post('/users/:userId/sendWelcomeEmail', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, temporaryPassword } = req.body;
    
    console.log(`📧 Sending welcome email to ${email}`);
    
    if (!email || !temporaryPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'email and temporaryPassword are required'
      });
    }
    
    const accessToken = await getMicrosoftAccessToken();
    
    const emailContent = {
      message: {
        subject: 'Welcome to Microsoft 365',
        body: {
          contentType: 'HTML',
          content: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #0078d4; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f5f5f5; }
                .credentials { background: white; padding: 15px; border-left: 4px solid #0078d4; margin: 20px 0; }
                .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Microsoft 365!</h1>
                </div>
                <div class="content">
                  <p>Your Microsoft 365 account has been created successfully.</p>
                  
                  <div class="credentials">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Temporary Password:</strong> <code>${temporaryPassword}</code></p>
                  </div>
                  
                  <p><strong>Next Steps:</strong></p>
                  <ol>
                    <li>Go to <a href="https://login.microsoftonline.com">Microsoft 365 Login</a></li>
                    <li>Sign in with your email and temporary password</li>
                    <li>You will be prompted to change your password</li>
                    <li>Set up multi-factor authentication for security</li>
                  </ol>
                  
                  <p><strong>Important Security Notes:</strong></p>
                  <ul>
                    <li>This password is temporary and will expire after first login</li>
                    <li>Never share your password with anyone</li>
                    <li>Microsoft will never ask for your password via email</li>
                  </ul>
                </div>
                <div class="footer">
                  <p>This is an automated message. Please do not reply to this email.</p>
                  <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: email,
            },
          },
        ],
      },
      saveToSentItems: false
    };
    
    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${userId}/sendMail`,
      emailContent,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Welcome email sent successfully');
    res.json({
      success: true,
      message: 'Welcome email sent successfully'
    });
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to send welcome email',
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

// Helper function to generate random password
function generateRandomPassword() {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  
  let password = '';
  
  // Ensure at least one of each required character type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = router;