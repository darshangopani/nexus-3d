#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('[v0] Starting commit and push process...');

try {
  // Configure git
  console.log('[v0] Configuring git...');
  execSync('git config user.name "v0-assistant"', { cwd: projectRoot, stdio: 'pipe' });
  execSync('git config user.email "v0@vercel.com"', { cwd: projectRoot, stdio: 'pipe' });

  // Stage changes
  console.log('[v0] Staging changes...');
  execSync('git add -A', { cwd: projectRoot });

  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { cwd: projectRoot, encoding: 'utf-8' });
  
  if (!status.trim()) {
    console.log('[v0] No changes to commit');
    process.exit(0);
  }

  // Commit changes
  console.log('[v0] Committing changes...');
  execSync(`git commit -m "fix: Add vercel.json SPA routing and fix RealisticBlackHole component

- Add vercel.json with rewrites configuration for SPA routing
- Fix RealisticBlackHole.tsx: Remove fragments, move EffectComposer inside group
- Update Home.tsx: Add debug logging to Canvas initialization
- Resolves 404 NOT_FOUND error on Vercel deployment
- Fixes React Three Fiber component hierarchy issues"`, { cwd: projectRoot });

  // Push changes
  console.log('[v0] Pushing changes to remote...');
  execSync('git push origin HEAD', { cwd: projectRoot });

  console.log('[v0] ✅ Changes committed and pushed successfully!');
} catch (error) {
  console.error('[v0] ❌ Error during commit/push:', error.message);
  process.exit(1);
}
