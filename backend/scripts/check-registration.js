/**
 * Check Tesla Partner Account Registration Status
 */
require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = process.env.TESLA_CLIENT_ID;
const CLIENT_SECRET = process.env.TESLA_CLIENT_SECRET;
const FLEET_API_BASE = process.env.TESLA_API_BASE_URL || 'https://fleet-api.prd.na.vn.cloud.tesla.com';
const DOMAIN = 'yerry262.github.io';

async function main() {
  console.log('Checking Tesla Partner Registration...\n');
  
  try {
    // Get partner token
    console.log('1. Getting partner token...');
    const tokenRes = await axios.post(
      'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'openid vehicle_device_data vehicle_cmds vehicle_charging_cmds',
        audience: FLEET_API_BASE
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('   ✅ Token obtained\n');
    
    const token = tokenRes.data.access_token;
    
    // Check public key registration
    console.log('2. Checking public key registration for domain:', DOMAIN);
    try {
      const res = await axios.get(
        `${FLEET_API_BASE}/api/1/partner_accounts/public_key?domain=${DOMAIN}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log('   ✅ Public key IS registered!');
      console.log('   Response:', JSON.stringify(res.data, null, 2));
    } catch (e) {
      if (e.response?.status === 404 || e.response?.status === 400) {
        console.log('   ❌ Public key NOT registered for this domain');
        console.log('   Error:', JSON.stringify(e.response?.data, null, 2));
      } else {
        throw e;
      }
    }
    
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
}

main();
