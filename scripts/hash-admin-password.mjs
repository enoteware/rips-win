#!/usr/bin/env node
/**
 * Generate ADMIN_PASSWORD_HASH for .env.local.
 * Run: node scripts/hash-admin-password.mjs [your-password]
 * Or: node scripts/hash-admin-password.mjs   (prompts for password)
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2] ?? process.env.ADMIN_PASSWORD;
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs <password>');
  console.error('Or set ADMIN_PASSWORD and run without args.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log('Add this to .env.local:');
console.log('ADMIN_PASSWORD_HASH="' + hash + '"');
console.log('');
console.log('Also set: ADMIN_EMAIL=your@email.com');
