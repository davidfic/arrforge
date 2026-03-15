const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');

  // Navigate to starter flow selections to reach Review step quickly
  // Click 'Use Recommended Starter'
  await page.click('text=Use Recommended Starter');
  // Click next to Configure
  await page.click('text=Next: Configure');
  // Click Next: Review & Download
  await page.click('text=Next: Review & Download');

  // Wait for download links to appear
  await page.waitForSelector('a[download="media-stack.zip"]', { timeout: 5000 });

  // Intercept downloads
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('a[download="media-stack.zip"]'),
  ]).catch((e) => { console.error('Download failed', e); return [null]; });

  if (download) {
    const path = await download.path();
    console.log('Download successful, path:', path);
  } else {
    console.log('Download did not start.');

    // Try compose download link
    const [compDL] = await Promise.all([
      page.waitForEvent('download').catch(() => null),
      page.click('a[download="docker-compose.yml"]').catch(() => null),
    ]).catch(() => [null]);

    if (compDL) {
      console.log('Compose download started');
    } else {
      console.log('Compose download did not start either');
      const zipHref = await page.getAttribute('a[download="media-stack.zip"]', 'href');
      const compHref = await page.getAttribute('a[download="docker-compose.yml"]', 'href');
      console.log('zip href:', zipHref);
      console.log('compose href:', compHref);

      // Dump console messages
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    }
  }

  await browser.close();
})();