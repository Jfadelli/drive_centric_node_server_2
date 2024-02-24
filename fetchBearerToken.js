const puppeteer = require('puppeteer');
const EventEmitter = require('events');
require('dotenv').config();

class TokenEmitter extends EventEmitter {}
const tokenEmitter = new TokenEmitter();

async function fetchBearerToken() {
  const loginUrl = process.env.LOGIN_URL;
  const username = process.env.USER_NAME;
  const password = process.env.PASSWORD;

  let browser;
  let bearerToken = ''; // Initialize bearerToken variable

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(5000); // Increase the timeout to 5 seconds

    // Listen to all network responses
    page.on('response', async (response) => {
      // console.log(`Response received: ${response.url()} - ${response.status()}`);
      const requestHeaders = response.request().headers();
      if (requestHeaders.authorization && requestHeaders.authorization.startsWith('Bearer ')) {
        bearerToken = requestHeaders.authorization.replace('Bearer ', '');
        // console.log(`Bearer Token found: ${bearerToken}`);
        tokenEmitter.emit('tokenCaptured', bearerToken); // Emit an event when the token is captured
      }
    });

    await page.goto(loginUrl);
    await page.waitForSelector('#signInName', { visible: true });
    await page.type('#signInName', username);
    await page.waitForSelector('#password', { visible: true });
    await page.type('#password', password);
    await page.waitForSelector('#next', { visible: true });
    await page.click('#next');

    // Wait for the token to be captured
    await new Promise(resolve => tokenEmitter.once('tokenCaptured', resolve));

  } catch (error) {
    console.error('Error fetching bearer token:', error);
  } finally {
    if (browser) {
      await browser.close();
      // console.log(`Browser closed successfully. Token: ${bearerToken ? bearerToken : "No Token found."}`);
    }
  }
  return bearerToken; // Return the bearerToken
}

module.exports = {
  fetchBearerToken,
};
