#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Repository details based on the provided PromptGuard documentation
REPO_URL="https://github.com/ubitquity/PromptGuard.git"
INSTALL_DIR="PromptGuard"

echo "======================================="
echo " Starting PromptGuard Installation..."
echo "======================================="

# 1. Check for Prerequisites (Git, Node.js, npm)
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed. Please install Git via cPanel or your package manager."
    exit 1
fi

if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Error: Node.js and npm are required. If using cPanel, ensure the Node.js App module is enabled."
    exit 1
fi

echo "✅ Prerequisites met (Git, Node.js, npm)."

# 2. Clone or Update the Repository
if [ -d "$INSTALL_DIR" ]; then
    echo "🔄 Directory $INSTALL_DIR already exists. Pulling latest changes..."
    cd "$INSTALL_DIR"
    git pull origin main
else
    echo "📥 Cloning repository from $REPO_URL..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# 3. Navigate to the Node.js application directory
if [ -d "open-source" ]; then
    cd open-source
else
    echo "❌ Error: 'open-source' directory not found. The repository structure might have changed."
    exit 1
fi

# 4. Install Dependencies
echo "📦 Installing Node.js dependencies (express, body-parser, sqlite3)..."
npm install

# 5. Automated Testing
echo "======================================="
echo "🧪 Testing the PromptGuard Application..."
echo "======================================="

# Start the app in the background
PORT=3000 node app.js &
NODE_PID=$!

# Wait a few seconds to let SQLite initialize and the Express server bind to the port
sleep 3

# Check if the process is still running
if ps -p $NODE_PID > /dev/null; then
   echo "✅ Test successful: PromptGuard started correctly on PID $NODE_PID."
   echo "🛑 Stopping test instance..."
   kill $NODE_PID
else
   echo "❌ Test failed: PromptGuard crashed or did not start correctly."
   exit 1
fi

echo "======================================="
echo "🎉 Setup finished successfully!"
echo "======================================="
echo "To run this in production on cPanel:"
echo "1. Go to 'Setup Node.js App' in cPanel."
echo "2. Create an application pointing to $(pwd)"
echo "3. Set the startup file to 'app.js'"
