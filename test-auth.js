// Simple script to test authentication
const password = process.env.ADMIN_PASSWORD || 'admin123';
const testPassword = 'admin123';

console.log('Environment Password:', password);
console.log('Test Password:', testPassword);
console.log('Match:', password === testPassword);
console.log('Password length:', password.length);
console.log('Test password length:', testPassword.length);
console.log('Password chars:', password.split('').map(c => c.charCodeAt(0)));
console.log('Test chars:', testPassword.split('').map(c => c.charCodeAt(0)));
