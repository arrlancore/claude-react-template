#!/bin/bash

echo "🚀 Setting up E2E Testing for Monaco Editor"

# Install Playwright if not already installed
if ! command -v npx playwright --version &> /dev/null; then
    echo "📦 Installing Playwright..."
    npm install @playwright/test --save-dev
fi

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install chromium

# Check if development server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Development server not running. Please start with:"
    echo "   npm run dev"
    echo ""
    echo "Then run this script again or use:"
    echo "   npm run test:e2e"
    exit 1
fi

echo "✅ Running JavaScript E2E test..."
npx playwright test tests/e2e/javascript-only.spec.ts --headed

echo ""
echo "🎯 JavaScript test complete!"
echo ""
echo "To run all language tests:"
echo "   npm run test:e2e"
echo ""
echo "To run with UI:"
echo "   npm run test:e2e:ui"
