const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 * By default Puppeteer caches Chrome outside the project folder (e.g. in the
 * OS home directory). On Render, only files inside this project folder are
 * carried over from the build step to the deployed runtime, so anything
 * cached outside it (like the default location) disappears after build,
 * causing "Could not find Chrome" even though the build log shows it
 * downloading successfully. Pointing the cache here keeps it inside the
 * project so it survives deployment.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};