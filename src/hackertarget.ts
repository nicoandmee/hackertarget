const HACKERTARGET_USERNAME = process.env.HACKERTARGET_USERNAME
const HACKERTARGET_PASSWORD = process.env.HACKERTARGET_PASSWORD


/**
 * @description Similar/the same as results from dnsdumpster.com
 *
 * @param {any} target
 * @param {any} page
 */
export async function profileTarget(target: any, page: any) {
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
export async function scanWP(target: any, page: any) {
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
export async function runWappalyzer(target: any, page: any) {
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
export async function runNikto(target: any, page: any) {
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
export async function runOpenVAS(target: any, page: any) {
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
export async function runNMAP(target: any, page: any) {
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