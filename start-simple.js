const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Project Generator...\n');

// Start the backend server
console.log('🔧 Starting backend server on port 3001...');
const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Wait a moment for server to start
setTimeout(() => {
  // Start the frontend
  console.log('🎨 Starting frontend on port 3000...');

  // Use batch file approach for Windows
  const client = spawn('start-client.bat', [], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });

  client.on('error', (err) => {
    console.error('Frontend failed to start:', err);
    console.log('Please manually run: cd client && npm start');
  });
}, 2000);

server.on('error', (err) => {
  console.error('Backend failed to start:', err);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  server.kill();
  process.exit(0);
});

console.log('\n📋 Access your app at:');
console.log('Frontend: http://localhost:3000');
console.log('Backend: http://localhost:3001');
console.log('\nPress Ctrl+C to stop both servers');