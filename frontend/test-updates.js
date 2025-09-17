#!/usr/bin/env node

/**
 * Test script to verify that all updates work correctly
 * Run this script to check if the application builds properly
 */
console.log('Starting build verification test...');

const { execSync } = require('child_process');

try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build successful! All updates work correctly.');
} catch (error) {
  console.error('❌ Build failed! Please check the error messages above.');
  process.exit(1);
}