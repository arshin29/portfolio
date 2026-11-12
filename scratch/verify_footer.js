const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testFooter() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Scroll to bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot of bottom credit bar initial state
  const creditBar = await page.$('.meadow-credit');
  if (!creditBar) {
    console.error('Could not find .meadow-credit');
    await browser.close();
    return;
  }

  const creditText = await page.evaluate(el => el.innerText, creditBar);
  console.log('Credit bar text:', JSON.stringify(creditText));

  await page.screenshot({
    path: 'scratch/footer_initial.png',
    clip: { x: 0, y: 400, width: 1440, height: 500 }
  });
  console.log('Saved scratch/footer_initial.png');

  // Click "Privacy policy"
  console.log('Clicking Privacy policy...');
  const privacySummary = await page.evaluateHandle(() => {
    const details = document.querySelector('.meadow-analytics:not(.meadow-weather-source)');
    return details ? details.querySelector('summary') : null;
  });

  if (privacySummary) {
    await privacySummary.click();
    await new Promise(r => setTimeout(r, 500));

    const privacyCard = await page.$('.meadow-analytics:not(.meadow-weather-source) .meadow-analytics-card');
    const isPrivacyVisible = await page.evaluate(el => el && window.getComputedStyle(el).display !== 'none', privacyCard);
    const privacyContent = await page.evaluate(el => el ? el.innerText : '', privacyCard);
    console.log('Privacy popover visible:', isPrivacyVisible);
    console.log('Privacy popover text:', JSON.stringify(privacyContent));

    await page.screenshot({
      path: 'scratch/footer_privacy_open.png',
      clip: { x: 800, y: 600, width: 640, height: 300 }
    });
    console.log('Saved scratch/footer_privacy_open.png');
  }

  // Click "Weather source"
  console.log('Clicking Weather source...');
  const weatherSummary = await page.evaluateHandle(() => {
    const details = document.querySelector('.meadow-weather-source');
    return details ? details.querySelector('summary') : null;
  });

  if (weatherSummary) {
    await weatherSummary.click();
    await new Promise(r => setTimeout(r, 500));

    const weatherCard = await page.$('.meadow-weather-source .meadow-analytics-card');
    const isWeatherVisible = await page.evaluate(el => el && window.getComputedStyle(el).display !== 'none', weatherCard);
    const weatherContent = await page.evaluate(el => el ? el.innerText : '', weatherCard);
    console.log('Weather popover visible:', isWeatherVisible);
    console.log('Weather popover text:', JSON.stringify(weatherContent));

    const isPrivacyStillOpen = await page.evaluate(() => {
      const el = document.querySelector('.meadow-analytics:not(.meadow-weather-source) .meadow-analytics-card');
      return el && window.getComputedStyle(el).display !== 'none';
    });
    console.log('Is Privacy still open (should be false/closed):', isPrivacyStillOpen);

    await page.screenshot({
      path: 'scratch/footer_weather_open.png',
      clip: { x: 800, y: 550, width: 640, height: 350 }
    });
    console.log('Saved scratch/footer_weather_open.png');
  }

  // Click outside to close
  console.log('Clicking outside...');
  await page.mouse.click(200, 700);
  await new Promise(r => setTimeout(r, 300));
  const areAnyOpen = await page.evaluate(() => {
    const cards = document.querySelectorAll('.meadow-analytics-card');
    for (const c of cards) {
      if (window.getComputedStyle(c).display !== 'none') return true;
    }
    return false;
  });
  console.log('Are any popovers still open after outside click:', areAnyOpen);

  // Mobile test
  console.log('Testing mobile layout (390px)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));

  const isWeatherHidden = await page.evaluate(() => {
    const el = document.querySelector('.meadow-weather-source');
    return el && window.getComputedStyle(el).display === 'none';
  });
  console.log('Is Weather source button hidden on mobile (<=560px):', isWeatherHidden);

  // Click Privacy policy on mobile
  const mobilePrivacySummary = await page.evaluateHandle(() => {
    const details = document.querySelector('.meadow-analytics:not(.meadow-weather-source)');
    return details ? details.querySelector('summary') : null;
  });
  if (mobilePrivacySummary) {
    await mobilePrivacySummary.click();
    await new Promise(r => setTimeout(r, 500));

    const mobilePhoneText = await page.evaluate(() => {
      const el = document.querySelector('.meadow-credit-phone');
      return el ? { text: el.innerText, display: window.getComputedStyle(el).display } : null;
    });
    console.log('Mobile phone attribution visible in privacy popup:', mobilePhoneText);

    await page.screenshot({
      path: 'scratch/footer_mobile_privacy.png',
      clip: { x: 0, y: 500, width: 390, height: 344 }
    });
    console.log('Saved scratch/footer_mobile_privacy.png');
  }

  await browser.close();
  console.log('Verification completed successfully!');
}

testFooter().catch(console.error);
