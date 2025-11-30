/**
 * Tesla Fleet API Partner Registration Script
 * 
 * This script registers your application with Tesla's Fleet API.
 * You only need to run this ONCE per region.
 * 
 * Prerequisites:
 * 1. Generate a public/private key pair:
 *    openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem
 *    openssl ec -in private-key.pem -pubout -out public-key.pem
 * 
 * 2. Host public-key.pem at:
 *    https://yerry262.github.io/.well-known/appspecific/com.tesla.3p.public-key.pem
 * 
 * 3. Run this script: node scripts/register-partner.js
 */

require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = process.env.TESLA_CLIENT_ID;
const CLIENT_SECRET = process.env.TESLA_CLIENT_SECRET;
const FLEET_API_BASE = process.env.TESLA_API_BASE_URL || 'https://fleet-api.prd.na.vn.cloud.tesla.com';

async function getPartnerToken() {
  console.log('🔑 Getting partner authentication token...');
  
  try {
    const response = await axios.post(
      'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'openid vehicle_device_data vehicle_cmds vehicle_charging_cmds',
        audience: FLEET_API_BASE
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✅ Partner token obtained successfully!');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Failed to get partner token:', error.response?.data || error.message);
    throw error;
  }
}

async function registerPartner(partnerToken) {
  console.log('📝 Registering application with Tesla Fleet API...');
  console.log(`   Region: ${FLEET_API_BASE}`);
  
  try {
    const response = await axios.post(
      `${FLEET_API_BASE}/api/1/partner_accounts`,
      {
        domain: 'yerry262.github.io'
      },
      {
        headers: {
          'Authorization': `Bearer ${partnerToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  Application already registered in this region.');
      return { already_registered: true };
    }
    console.error('❌ Registration failed:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  console.log('');
  console.log('🚗 Tesla Fleet API Partner Registration');
  console.log('========================================');
  console.log('');
  console.log('Client ID:', CLIENT_ID);
  console.log('Region:', FLEET_API_BASE);
  console.log('');
  
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Error: TESLA_CLIENT_ID and TESLA_CLIENT_SECRET must be set in .env file');
    process.exit(1);
  }
  
  try {
    // Step 1: Get partner token
    const partnerToken = await getPartnerToken();
    
    // Step 2: Register with Fleet API
    await registerPartner(partnerToken);
    
    console.log('');
    console.log('🎉 Setup complete! You can now use the Tesla Dashboard.');
    console.log('');
    console.log('⚠️  IMPORTANT: Before vehicle commands will work, you also need to:');
    console.log('   1. Host your public key at:');
    console.log('      https://yerry262.github.io/.well-known/appspecific/com.tesla.3p.public-key.pem');
    console.log('   2. Pair the virtual key with your vehicle using Tesla app');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Registration failed. Please check the error above.');
    process.exit(1);
  }
}

main();
