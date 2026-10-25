import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screensDir = path.resolve(projectRoot, 'docs/assets/screens');

async function navigateTo(page, url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: 25000 });
      await page.waitForSelector('#root', { timeout: 15000 });
      await page.waitForTimeout(1000);
      return;
    } catch (e) {
      if (attempt === 3) throw e;
      console.warn(`[RETRY ${attempt}] navigating to ${url}: ${e.message}`);
      await page.waitForTimeout(1500);
    }
  }
}

async function seedUserProgress(page) {
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const req = indexedDB.open('nudi_kannada_db', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('cards')) {
          const cardStore = db.createObjectStore('cards', { keyPath: 'phraseId' });
          cardStore.createIndex('by-due', 'dueDate');
          cardStore.createIndex('by-repetition', 'repetition');
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'situationId' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
      };
      req.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(['cards', 'progress', 'meta'], 'readwrite');
        const today = new Date().toISOString().split('T')[0];

        const phrases = ['travel-01', 'travel-02', 'transport-01'];
        for (const phraseId of phrases) {
          tx.objectStore('cards').put({
            phraseId,
            interval: 0,
            repetition: 0,
            easeFactor: 2.5,
            dueDate: today,
            lapses: 0,
          });
        }

        tx.objectStore('progress').put({
          situationId: 'travel',
          phrasesLearned: ['travel-01', 'travel-02'],
          phrasesMastered: [],
          roleplaysCompleted: [],
        });

        tx.objectStore('meta').put(
          {
            currentStreak: 3,
            longestStreak: 5,
            lastActiveDate: today,
            totalPracticeDays: 3,
          },
          'user_streak'
        );

        tx.oncomplete = () => resolve();
      };
    });
  });
}

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

  // Seed progress
  await navigateTo(page, `${baseUrl}/`);
  await seedUserProgress(page);

  // --- 1. HOME SCREENSHOT ---
  console.log('Capturing home.png...');
  await navigateTo(page, `${baseUrl}/`);
  await page.screenshot({ path: path.join(screensDir, 'home.png'), fullPage: false });
  console.log('✓ Saved home.png');

  // --- 2. LEARN SCREENSHOT (travel) ---
  console.log('Capturing learn.png (travel)...');
  await navigateTo(page, `${baseUrl}/learn/travel`);
  await page.screenshot({ path: path.join(screensDir, 'learn.png'), fullPage: false });
  console.log('✓ Saved learn.png');

  // --- 3. SPEAK SCREENSHOT (travel, after tapping a phrase & evaluating) ---
  console.log('Capturing speak.png (travel, after tapping a phrase)...');
  await navigateTo(page, `${baseUrl}/speak/travel`);
  try {
    const fallbackInput = page.locator('input[class*="fallbackInput"]');
    const isInputVisible = await fallbackInput.isVisible().catch(() => false);
    if (!isInputVisible) {
      const fallbackToggle = page.locator('button[class*="fallbackToggleBtn"]');
      if (await fallbackToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        await fallbackToggle.click();
        await page.waitForTimeout(300);
      }
    }
    if (await fallbackInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await fallbackInput.fill('Namaskara, ee bus Majestic-ge hogutta?');
      const scoreBtn = page.locator('button[class*="fallbackSubmitBtn"]');
      await scoreBtn.click();
      await page.waitForTimeout(600);
    }
    // Scroll slightly so the stats, target card, and score feedback are centered
    await page.evaluate(() => {
      window.scrollTo({ top: 120, behavior: 'instant' });
    });
  } catch (err) {
    console.warn('Note on speak interaction:', err.message);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screensDir, 'speak.png'), fullPage: false });
  console.log('✓ Saved speak.png');

  // --- 4. ROLEPLAY SCREENSHOT (transport, mid-conversation) ---
  console.log('Capturing roleplay.png (transport, mid-conversation)...');
  await navigateTo(page, `${baseUrl}/roleplay/transport`);
  try {
    const continueBtn = page.locator('button[class*="advanceBtn"]');
    if (await continueBtn.isVisible({ timeout: 2000 })) {
      await continueBtn.click();
      await page.waitForTimeout(400);
    }
    const optionBtn = page.locator('button[class*="optionButton"]').first();
    if (await optionBtn.isVisible({ timeout: 4000 })) {
      await optionBtn.click();
      await page.waitForTimeout(800);
    }
    await page.evaluate(() => {
      window.scrollBy({ top: 220, behavior: 'instant' });
    });
  } catch (err) {
    console.warn('Note on roleplay interaction:', err.message);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screensDir, 'roleplay.png'), fullPage: false });
  console.log('✓ Saved roleplay.png');

  // --- 5. REVIEW SCREENSHOT (active card, revealed SM-2 buttons, no empty state) ---
  console.log('Capturing review.png (with active review card)...');
  await navigateTo(page, `${baseUrl}/review`);
  try {
    const revealBtn = page.locator('button[class*="revealBtn"]').filter({ hasText: /Show Meaning|Meaning/i });
    if (await revealBtn.first().isVisible({ timeout: 4000 })) {
      await revealBtn.first().click();
      await page.waitForTimeout(600);
    }
  } catch (err) {
    console.warn('Note on review reveal:', err.message);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screensDir, 'review.png'), fullPage: false });
  console.log('✓ Saved review.png');

  // --- 6. SCRIPT HELPER SCREENSHOT ---
  console.log('Capturing script.png...');
  await navigateTo(page, `${baseUrl}/script`);
  await page.screenshot({ path: path.join(screensDir, 'script.png'), fullPage: false });
  console.log('✓ Saved script.png');

  // --- 7. DARK THEME SCREENSHOT ---
  console.log('Capturing dark.png...');
  await navigateTo(page, `${baseUrl}/`);
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screensDir, 'dark.png'), fullPage: false });
  console.log('✓ Saved dark.png');

  await browser.close();
  console.log('\nAll 7 mobile screenshots captured successfully in docs/assets/screens/ !');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
