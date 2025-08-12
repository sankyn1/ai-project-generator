@echo off
echo 🚀 Starting AI Project Generator...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm run setup
    echo.
)

REM Check if client/node_modules exists
if not exist "client\node_modules" (
    echo 📦 Installing client dependencies...
    pushd client
    call npm install
    popd
    echo.
)

echo 🌟 Starting development servers...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.

call npm run dev