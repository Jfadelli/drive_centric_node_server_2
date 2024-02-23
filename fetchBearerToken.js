const puppeteer = require('puppeteer');
require('dotenv').config();

async function fetchBearerToken() {
  const loginUrl = process.env.LOGIN_URL;
  const username = process.env.USER_NAME;
  const password = process.env.PASSWORD;
  // Removed specific endpoint for a more general approach

  let browser;
  let bearerToken = ''; // Initialize bearerToken variable

  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(10000); // Set a generous timeout

    // Keep listening to all network responses
    await page.setRequestInterception(true);
    page.on('response', async (response) => {
      console.log(`Response received: ${response.url()} - ${response.status()}`);
      const requestHeaders = response.request().headers();
      if (requestHeaders.authorization && requestHeaders.authorization.startsWith('Bearer ')) {
        bearerToken = requestHeaders.authorization.replace('Bearer ', '');
        console.log(`Bearer Token found: ${bearerToken}`);
      }
    });

    console.log(`Navigating to ${loginUrl}`);
    await page.setJavaScriptEnabled(false);
    await page.goto(loginUrl);
    await page.setJavaScriptEnabled(true);
    console.log('Navigation complete');
    
    await page.waitForSelector('#signInName', { visible: true });
    await page.type('#signInName', username);
    await page.waitForSelector('#password', { visible: true });
    await page.type('#password', password);
    await page.waitForSelector('#next', { visible: true });
    await page.click('#next');

    // Wait for navigation and potential redirects
    await Promise.race([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.waitForSelector('#root > div > div.kdPlusContainer > div.kdPlusFullScreen > div > div.containerDashboard.jss32 > div.makeStyleBlock.jss36 > div > div', { visible: true })
    ]);
    

    // Implement a specific condition or timeout to stop listening
    // This is a basic example using setTimeout
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

  } catch (error) {
    console.error('Error fetching bearer token:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log(`Browser closed successfully. Token: ${bearerToken ? bearerToken : "No Token found."}`);
    }
  }
}

module.exports = {
  fetchBearerToken,
};
