/**
 * Generate EC key pair for Tesla Fleet API
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate EC key pair (prime256v1 = secp256r1)
const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1',
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

const keysDir = path.join(__dirname, '..');
const privateKeyPath = path.join(keysDir, 'private-key.pem');
const publicKeyPath = path.join(keysDir, 'public-key.pem');

fs.writeFileSync(privateKeyPath, privateKey);
fs.writeFileSync(publicKeyPath, publicKey);

console.log('✅ Keys generated successfully!');
console.log('');
console.log('Private key saved to:', privateKeyPath);
console.log('Public key saved to:', publicKeyPath);
console.log('');
console.log('📋 NEXT STEPS:');
console.log('');
console.log('1. Create a GitHub repository named: yerry262.github.io');
console.log('');
console.log('2. Create the following folder structure in that repo:');
console.log('   .well-known/appspecific/');
console.log('');
console.log('3. Copy public-key.pem to that folder and rename it to:');
console.log('   com.tesla.3p.public-key.pem');
console.log('');
console.log('4. Enable GitHub Pages for the repository');
console.log('');
console.log('5. Verify it\'s accessible at:');
console.log('   https://yerry262.github.io/.well-known/appspecific/com.tesla.3p.public-key.pem');
console.log('');
console.log('6. Then run: node scripts/register-partner.js');
console.log('');
console.log('📄 Your public key content (copy this for the file):');
console.log('');
console.log(publicKey);
