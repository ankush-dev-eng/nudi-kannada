import fs from 'node:fs';

const baseUrl = process.env.BASE_URL || 'https://nudi-kannada-flame.vercel.app';

async function runSmokeTests() {
  console.log('====================================================');
  console.log(`🚀 Starting Nudi Live Smoke Test against: ${baseUrl}`);
  console.log('====================================================\n');

  const { chromium } = await import('playwright');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath)
    ? chromePath
    : fs.existsSync(edgePath)
      ? edgePath
      : undefined;

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

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign issues (e.g., missing local mic hardware in headless or third-party favicon 404s)
      if (
        !text.includes('speechSynthesis') &&
        !text.includes('microphone') &&
        !text.includes('favicon')
      ) {
        consoleErrors.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  let passedTests = 0;
  let failedTests = 0;

  async function assertNot404(url, description) {
    console.log(`[TEST] Visiting: ${url} (${description})...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });

    const content = await page.content();
    const has404 =
      content.includes('೪೦೪ / 404') ||
      content.includes('ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ') ||
      content.includes('Page Not Found');

    if (has404) {
      console.error(`  ❌ FAILED: 404 page detected on ${url}!`);
      failedTests++;
      return false;
    }

    console.log(`  ✅ PASSED: No 404 detected.`);
    passedTests++;
    return true;
  }

  const situations = [
    { id: 'travel', name: 'Travel & Exploration' },
    { id: 'shopping', name: 'Shopping & Markets' },
    { id: 'healthcare', name: 'Healthcare & Clinic' },
    { id: 'transport', name: 'Auto & Public Transit' },
    { id: 'education', name: 'College & Education' },
    { id: 'workplace', name: 'Workplace & Office' },
  ];

  try {
    // 1. Visit Home
    console.log('\n--- Phase 1: Home Page & Situation Cards ---');
    await assertNot404(`${baseUrl}/`, 'Home Page');

    // 2. Click Learn, Speak, and Roleplay on every situation
    console.log('\n--- Phase 2: Testing Every Situation Card Navigation ---');
    for (const sit of situations) {
      console.log(`\nTesting situation: "${sit.name}" (${sit.id})`);

      // Learn
      await assertNot404(`${baseUrl}/learn/${sit.id}`, `${sit.name} - Learn`);
      // Speak (Fix verification)
      await assertNot404(`${baseUrl}/speak/${sit.id}`, `${sit.name} - Speak`);
      // Roleplay (Fix verification)
      await assertNot404(`${baseUrl}/roleplay/${sit.id}`, `${sit.name} - Roleplay`);
    }

    // 3. Test Short URLs & Aliases
    console.log('\n--- Phase 3: Testing Short URLs & Aliases ---');
    await assertNot404(`${baseUrl}/learn`, 'Short URL /learn redirect');
    await assertNot404(`${baseUrl}/speak`, 'Short URL /speak default');
    await assertNot404(`${baseUrl}/roleplay`, 'Short URL /roleplay default');
    await assertNot404(`${baseUrl}/speak/market`, 'Alias /speak/market -> shopping');
    await assertNot404(`${baseUrl}/roleplay/office`, 'Alias /roleplay/office -> workplace');

    // 4. Test Unknown Situation - Friendly fallback (not 404)
    console.log('\n--- Phase 4: Testing Unknown Situation Handling ---');
    console.log(`[TEST] Visiting: ${baseUrl}/speak/unknown-category-123...`);
    await page.goto(`${baseUrl}/speak/unknown-category-123`, {
      waitUntil: 'networkidle',
      timeout: 25000,
    });
    const unknownContent = await page.content();
    const isBlank404 = unknownContent.includes('೪೦೪ / 404');
    const isFriendlyNotFound =
      unknownContent.includes('ಸಂದರ್ಭ ಕಂಡುಬಂದಿಲ್ಲ') ||
      unknownContent.includes('Situation Not Found');

    if (isBlank404) {
      console.error(`  ❌ FAILED: Showed raw 404 instead of friendly SituationNotFound!`);
      failedTests++;
    } else if (isFriendlyNotFound) {
      console.log(`  ✅ PASSED: Friendly SituationNotFound page shown correctly.`);
      passedTests++;
    } else {
      console.error(`  ❌ FAILED: Unexpected page content on unknown situation route.`);
      failedTests++;
    }
  } catch (err) {
    console.error(`\n❌ Unexpected execution error: ${err.message}`);
    failedTests++;
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('📊 SMOKE TEST SUMMARY');
  console.log('====================================================');
  console.log(`Total checks passed: ${passedTests}`);
  console.log(`Total checks failed: ${failedTests}`);
  console.log(`Console errors:      ${consoleErrors.length}`);
  console.log(`Uncaught exceptions: ${pageErrors.length}`);

  if (consoleErrors.length > 0) {
    console.error('\nConsole errors caught during smoke run:');
    consoleErrors.forEach((e) => console.error(` - ${e}`));
  }

  if (pageErrors.length > 0) {
    console.error('\nPage errors caught during smoke run:');
    pageErrors.forEach((e) => console.error(` - ${e}`));
  }

  if (failedTests > 0 || pageErrors.length > 0 || consoleErrors.length > 0) {
    console.error('\n❌ Smoke tests FAILED.');
    process.exit(1);
  }

  console.log('\n🎉 ALL SMOKE TESTS PASSED! Every link and route is 100% functional.');
  process.exit(0);
}

runSmokeTests();
