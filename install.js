const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AI Project Generator...\n');

// Function to run commands
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Check if Node.js version is compatible
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.error('❌ Node.js version 16 or higher is required');
    console.error(`Current version: ${nodeVersion}`);
    process.exit(1);
  }
  
  console.log(`✅ Node.js version ${nodeVersion} is compatible\n`);
}

// Create .env file if it doesn't exist
function createEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template\n');
  }
}

// Main installation process
async function install() {
  try {
    checkNodeVersion();
    
    // Install server dependencies
    runCommand('npm install', 'Installing server dependencies');
    
    // Install client dependencies
    const clientPath = path.join(__dirname, 'client');
    if (fs.existsSync(clientPath)) {
      console.log('📦 Installing client dependencies...');
      try {
        execSync('npm install', { 
          stdio: 'inherit', 
          cwd: clientPath 
        });
        console.log('✅ Client dependencies installed\n');
      } catch (error) {
        console.error('❌ Client dependency installation failed:', error.message);
        process.exit(1);
      }
    }
    
    createEnvFile();
    
    console.log('🎉 Installation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:3000');
    console.log('3. Click "API Config" to set up your AI provider');
    console.log('4. Start generating project deliverables!');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

install();