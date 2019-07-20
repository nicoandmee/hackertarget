import * as puppeteer from "puppeteer";
import * as args from "commander";
import * as _ from 'lodash';

import * as HackerTarget from './hackertarget';

import * as chalk from 'chalk';

const log = console.log;

const SHODAN_KEY = process.env.SHODAN_KEY;
const HACKERTARGET_USERNAME = process.env.HACKERTARGET_USERNAME
const HACKERTARGET_PASSWORD = process.env.HACKERTARGET_PASSWORD

args
  .version("0.0.1")
  .option("-h, --host <path>", "Target Host")
  .option("-f, --filters <path>", "(Opt) Shodan Filters")
  .parse(process.argv);



async function scan() {
  const target = process.argv[0].trim();
  console.time(`HackerTarget Scan | Started with target: ${target}`);

  const args = ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors', '--disk-cache-size=1', `--user-data-dir=${this.userDataDir}`, '--disable-infobars'];
  const options = {
    ignoreHTTPSErrors: true,
    headless: false,
    args,
  };
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();

  // Login
  await page.goto('https://hackertarget.com/my-account/', { waitUntil: 'networkidle0' });

  await page.type('#user_login', process.env.HACKERTARGET_USERNAME, { delay: 500 });
  await page.type('#user_pass', process.env.HACKERTARGET_PASSWORD, { delay: 500 });

  const handle = await page.$('#wp-submit');
  await Promise.all([
    handle.click(),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.waitForSelector('a[href="/dashboard/"]', { timeout: 12000 });


  await profileTarget(target, page);
  log(chalk.blue('Executed: Domain Profiling', target));

  await runWappalyzer(target, page);
  log(chalk.blue('Executed: Wappalyzer', target));

  await runNikto(target, page);
  log(chalk.blue('Executed: Nikto Scanner (Full) | UA: Chrome', target));

  await scanWP(target, page);
  log(chalk.blue('Executed: WP Full Scanner', target));

  await runNMAP(target, page);
  log(chalk.blue('Executed: Full nmap', target));

  await runOpenVAS(target, page);
  log(chalk.blue('Executed: OpenVAS Scanner', target));

  console.timeEnd(`HackerTarget Scan | Started with target: ${target}`);
  log(`Finished HackerTarget Scanning for: ${target}!`);

  // Shodan because fuck it
  let searchOpts = {
    facets: 'port:100,country:100',
    // minify: false,
  };


  // TODO: [BAC-11] Add shodan integration
}



/**
 * @description Similar/the same as results from dnsdumpster.com
 *
 * @param {any} target
 * @param {any} page
 */
async function profileTarget(target, page) {
  await page.goto('https://hackertarget.com/domain-profiler/', { waitUntil: 'networkidle0' });
  await page.type('[name="scantarget"],[name="theinput"]', target);

  await page.click('[name="terms"]');

  await Promise.all([
    page.click('#clickform'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.waitForSelector('.alert-success', { visible: true, timeout: 5000 });

}
/**
 * @description Runs a intense WP scan against target (WARNING: make sure target is WP for this to produce meaningful results)
 *
 * @param {any} target
 * @param {any} page
 */
async function scanWP(target, page) {
  await page.goto('https://hackertarget.com/wordpress-security-scan/', { waitUntil: 'networkidle0' });
  await page.type('[name="scantarget"],[name="theinput"]', target);
  await page.select('select[name="enumtype"', 'users50');

  await page.click('[name="terms"]');

  await Promise.all([
    page.click('#clickform'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.waitForSelector('.alert-success', { visible: true, timeout: 5000 });
}



/**
 * @description Runs enumeration on all services running on the given target server.
 *
 * @param {any} target
 * @param {any} page
 */
async function runWappalyzer(target, page) {
  await page.goto('https://hackertarget.com/whatweb-scan/', { waitUntil: 'networkidle0' });
  await page.type('[name="scantarget"],[name="theinput"]', target);
  await page.select('[name="useragent"]', 'chrome');

  await page.click('[name="terms"]');

  await Promise.all([
    page.click('#clickform'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.waitForSelector('.alert-success', { visible: true, timeout: 5000 });
}

/**
 * @description Runs a full Nikto web vulnerability scan on given target or target(s).
 *
 * @param {any} target
 * @param {any} page
 */
async function runNikto(target, page) {
  await page.goto('https://hackertarget.com/nikto-website-scanner/', { waitUntil: 'networkidle0' });
  await page.type('[name="scantarget"],[name="theinput"]', target);
  await page.select('[name="useragent"]', 'chrome');

  await page.click('[name="terms"]');

  await Promise.all([
    page.click('#clickform'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.waitForSelector('.alert-success', { visible: true, timeout: 5000 });
}

/**
 * @description Runs a full OpenVAS scan on the given target or target(s
 *
 * @param {any} target
 * @param {any} page
 */
async function runOpenVAS(target, page) {
  // OpenVAS Full Scan
  await page.goto('https://hackertarget.com/openvas-scan/', { waitUntil: 'networkidle0' });
  await page.type('[name="scantarget"],[name="theinput"]', target);
  await page.click('[name="terms"]');

  await Promise.all([
    page.click('#clickform'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.waitForSelector('.alert-success', { visible: true, timeout: 5000 });
}

/**
 * @description Runs as full NMAP scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 *
 * @param {any} target
 * @param {any} page
 */
async function runNMAP(target, page) {
  await page.goto('https://hackertarget.com/nmap-online-port-scanner/', { waitUntil: 'networkidle0' });
  await page.type('[name="scantarget"],[name="theinput"]', target);

  await page.click('#allports');
  await page.click('#osdetection');
  await page.click('#traceroute');

  await page.click('[name="terms"]');
  await Promise.all([
    page.click('#clickform'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.waitForSelector('.alert-success', { visible: true, timeout: 5000 });
}