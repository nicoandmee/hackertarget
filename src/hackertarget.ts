import * as Puppeteer from 'puppeteer';

const chalk = require('chalk');
const log = console.log;

export async function login(username: string, password: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/wp-login.php', { waitUntil: 'networkidle2' });

    await page.waitForSelector('#user_login');

    await page.type('#user_login', username);
    await page.type('#user_pass', password);
    await page.click('label[for="rememberme"]');

    const handle = await page.$('#wp-submit');
    await Promise.all([
        handle.click(),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await page.waitForSelector('a[href="/dashboard/"]', { timeout: 12000 });
    log(chalk.green('Login success!'));


    await page.waitForSelector('a[data-cookie-set="accept"]')
    await page.click('a[data-cookie-set="accept"]');

}
/**
 * @description Similar/the same as results from dnsdumpster.com
 *
 * @param {any} target
 * @param {any} page
 */
export async function profileTarget(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/domain-profiler/', { waitUntil: 'networkidle2' });


    await page.waitForSelector('[name="scantarget"],[name="theinput"]')
    await page.type('[name="scantarget"],[name="theinput"]', target);

    await page.click('[name="terms"]');

    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}
/**
 * @description Runs a intense WP scan against target (WARNING: make sure target is WP for this to produce meaningful results)
 *
 * @param {any} target
 * @param {any} page
 */
export async function scanWP(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/wordpress-security-scan/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('#myForm1 > div.btx-form-container > span > select');
    await page.type('[name="scantarget"],[name="theinput"]', target);
    await page.select('select[name="enumtype"', 'users50');

    await page.click('[name="terms"]');

    return Promise.all([
        page.click('#clickform'),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}



/**
 * @description Runs enumeration on all services running on the given target server.
 *
 * @param {any} target
 * @param {any} page
 */
export async function runWappalyzer(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/whatweb-scan/', { waitUntil: 'networkidle2' });

    await page.type('[name="scantarget"],[name="theinput"]', target);

    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}

/**
 * @description Runs a full Nikto web vulnerability scan on given target or target(s).
 *
 * @param {any} target
 * @param {any} page
 */
export async function runNikto(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/nikto-website-scanner/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('[name="scantarget"],[name="theinput"]');
    await page.type('[name="scantarget"],[name="theinput"]', target);
    await page.select('[name="useragent"]', 'chrome');

    await page.click('[name="terms"]');

    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}

/**
 * @description Runs a full OpenVAS scan on the given target or target(s
 *
 * @param {any} target
 * @param {any} page
 */
export async function runOpenVAS(target: string, page: Puppeteer.Page) {
    // OpenVAS Full Scan
    await page.goto('https://hackertarget.com/openvas-scan/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('select[name="reporttype"]');
    await page.select('select[name="reporttype"]', 'Enhanced');

    await page.type('[name="scantarget"],[name="theinput"]', target);
    await page.click('[name="terms"]');

    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}

/**
 * @description Runs as full NMAP scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 *
 * @param {any} target
 * @param {any} page
 */
export async function runNMAP(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/nmap-online-port-scanner/', { waitUntil: 'networkidle2' });
    await page.type('[name="scantarget"],[name="theinput"]', target);

    await page.click('#allports');
    await page.click('#osdetection');
    await page.click('#traceroute');

    await page.click('[name="terms"]');
    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}



/**
 * @description Runs as full Joomla scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 *
 * @param {any} target
 * @param {any} page
 */
 export async function runJoomla(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/joomla-security-scan/ckertarget.com/nmap-online-port-scanner/', { waitUntil: 'networkidle2' });
     await page.waitForSelector('[name="useragent"]');


    await page.type('[name="scantarget"],[name="theinput"]', target);

    await page.select('[name="useragent"]', 'chrome');

    await page.click('[name="terms"]');
    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}




/**
 * @description Runs as full Drupal scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 *
 * @param {any} target
 * @param {any} page
 */
 export async function runDrupal(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/joomla-security-scan', { waitUntil: 'networkidle2' });
     await page.waitForSelector('[name="enumtype"]');
     await page.select('[name=enumtype', 'default');

    await page.type('[name="scantarget"],[name="theinput"]', target);

    await page.click('[name="terms"]');
    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}



/**
 * @description Runs BlindElephant recon scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 *
 * @param {any} target
 * @param {any} page
 */
export async function runBlindElephant(target: string, page: Puppeteer.Page) {
    await page.goto('https://hackertarget.com/blindelephant-scan/', { waitUntil: 'networkidle2' });
     await page.waitForSelector('[name="webapp"]');

     const apps = await page.evaluate(() => {
         const platforms = [...document.querySelectorAll('[name="webapp"] > option') as any];
         return platforms.map((el) => el.getAttribute('value'));
     });


     for (const app of apps) {
        log(`Scannning for CMS Platform: ${app}`);
        await page.select('[name="webapp"]', app);

         await page.click('[name="terms"]');

        await Promise.all([
            page.click('#clickform'),
            page.waitForNavigation(),
            page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
        ]);


         log(chalk.yellow(`Submitted scan job for: ${target}, Platform: ${app}`));
    }

    return true;
}