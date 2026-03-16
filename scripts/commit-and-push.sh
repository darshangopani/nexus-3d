#!/bin/bash

# Configure git if needed
git config user.name "v0-assistant" || true
git config user.email "v0@vercel.com" || true

# Add all changes
git add -A

# Commit the changes
git commit -m "fix: Add vercel.json SPA routing and fix RealisticBlackHole component

- Add vercel.json with rewrites configuration for SPA routing
- Fix RealisticBlackHole.tsx: Remove fragments, move EffectComposer inside group
- Update Home.tsx: Add debug logging to Canvas initialization
- Resolves 404 NOT_FOUND error on Vercel deployment
- Fixes React Three Fiber component hierarchy issues"

# Push to the current branch
git push origin HEAD

echo "Changes committed and pushed successfully!"
