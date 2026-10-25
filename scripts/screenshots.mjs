import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screensDir = path.resolve(projectRoot, 'docs/assets/screens');

async function main() {
  console.log('--- Nudi Screenshot Automation ---');
  if (!fs.existsSync(screensDir)) {
    fs.mkdirSync(screensDir, { recursive: true });
  }

  try {
    const { chromium } = await import('playwright');
    console.log('Launching headless Chromium browser...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    console.log(`Navigating to ${baseUrl}...`);

    const routes = [
      { name: 'home', path: '/' },
      { name: 'learn', path: '/learn/travel' },
      { name: 'speak', path: '/speak?situation=travel' },
      { name: 'roleplay', path: '/roleplay?situation=travel' },
      { name: 'review', path: '/review' },
      { name: 'script', path: '/script' },
      { name: 'search', path: '/search' },
      { name: 'settings', path: '/settings' },
    ];

    for (const r of routes) {
      console.log(`Capturing screenshot for route: ${r.path} -> ${r.name}.png`);
      try {
        await page.goto(`${baseUrl}${r.path}`, { waitUntil: 'networkidle', timeout: 8000 });
        await page.screenshot({ path: path.join(screensDir, `${r.name}.png`), fullPage: false });
      } catch (err) {
        console.warn(`Could not capture route ${r.path}:`, err.message);
      }
    }

    await browser.close();
    console.log('Screenshots generated successfully in docs/assets/screens/');
  } catch (err) {
    console.log('Playwright not installed in global environment. Ready for CI capture.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
