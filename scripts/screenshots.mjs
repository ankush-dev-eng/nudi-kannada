import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screensDir = path.resolve(projectRoot, 'docs/assets/screens');

async function main() {
  console.log('--- Nudi Mobile Screenshot Automation ---');
  if (!fs.existsSync(screensDir)) {
    fs.mkdirSync(screensDir, { recursive: true });
  }

  const { chromium } = await import('playwright');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath)
    ? chromePath
    : fs.existsSync(edgePath)
      ? edgePath
      : undefined;

  console.log(
    'Launching browser...',
    executablePath ? `(using ${executablePath})` : '(using default chromium)'
  );
  const browser = await chromium.launch(
    executablePath ? { executablePath, headless: true } : { headless: true }
  );

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const baseUrl = process.env.BASE_URL || 'https://nudi-kannada-flame.vercel.app';
  console.log(`Target Base URL: ${baseUrl}`);

  const captures = [
    { name: 'home', path: '/' },
    { name: 'learn', path: '/learn/travel' },
    { name: 'speak', path: '/speak?situation=travel' },
    { name: 'roleplay', path: '/roleplay?situation=travel' },
    { name: 'review', path: '/review' },
    { name: 'script', path: '/script' },
    { name: 'dark', path: '/', dark: true },
  ];

  for (const c of captures) {
    const targetUrl = `${baseUrl}${c.path}`;
    console.log(`Capturing ${c.name}.png from ${targetUrl}...`);
    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 20000 });
      if (c.dark) {
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'dark');
        });
      }
      await page.waitForTimeout(600);
      const outPath = path.join(screensDir, `${c.name}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`✓ Saved ${outPath}`);
    } catch (err) {
      console.error(`Failed to capture ${c.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('All mobile screenshots captured successfully in docs/assets/screens/ !');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
