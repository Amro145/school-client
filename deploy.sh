#!/bin/bash

# Configuration
PROJECT_NAME="school-management-frontend"

echo "🚀 Starting Deployment Process for $PROJECT_NAME..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Build for Cloudflare using next-on-pages
echo "🏗️ Building for Cloudflare..."
npm run pages:build

# 3. Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .vercel/output/static --project-name $PROJECT_NAME

echo "✅ Deployment complete!"

