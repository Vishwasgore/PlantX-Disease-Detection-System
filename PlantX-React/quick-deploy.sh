#!/bin/bash

echo "=========================================="
echo "PlantX React - Quick Deploy to Vercel"
echo "=========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install it first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🧪 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Choose deployment method:"
echo "1. Deploy with Vercel CLI (recommended)"
echo "2. Manual instructions"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    # Check if vercel is installed
    if ! command -v vercel &> /dev/null; then
        echo ""
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo ""
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "=========================================="
    echo "✅ Deployment complete!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Note your Vercel URL"
    echo "2. Update backend CORS to include your Vercel domain"
    echo "3. Test your app!"
    echo ""
else
    echo ""
    echo "Manual deployment steps:"
    echo ""
    echo "1. Install Vercel CLI:"
    echo "   npm install -g vercel"
    echo ""
    echo "2. Deploy:"
    echo "   vercel --prod"
    echo ""
    echo "3. Or push to GitHub and import to Vercel dashboard"
    echo ""
    echo "See DEPLOY.md for detailed instructions."
    echo ""
fi
