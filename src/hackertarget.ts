import * as puppeteer from 'puppeteer';

const chalk = require('chalk');
const log = console.log;

export async function login(username: string, password: string, page: puppeteer.Page) {
    await page.goto('https://hackertarget.com/wp-login.php', { waitUntil: 'networkidle0' });

    await page.waitForSelector('#user_login', {timeout: 25000 });

    await page.type('#user_login', username, { delay: 250 });
    await page.type('#user_pass', password, { delay: 250 });
    await page.click('label[for="rememberme"]');

    await Promise.all([
        page.click('#wp-submit'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await page.waitForSelector('a[href="/dashboard/"]', { timeout: 25000 });
    log(chalk.green('Login success!'));

    await page.waitForSelector('a[data-cookie-set="accept"]', {delay: 250  })
    await page.click('a[data-cookie-set="accept"]', {delay: 250  });

}

export async function runDefaultScanProfile(target, page) {
    await runNMAP(target, page);
    log(chalk.green('Executed NMAP Scanner:', target));

    await runOpenVAS(target, page);
    log(chalk.green('Execute OpenVAS Scanner:', target));

    await runNikto(target, page);
    log(chalk.green('Execute Nikto Scanner:', target));

    log(chalk.blue(`Finished HackerTarget Scanning for: ${target}.`));
}



/**
 * @description Runs a domain profile of the target.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
export async function profileTarget(target: string, page: puppeteer.Page) {
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
 * @description Runs WordPress specific scanning tools on the given target or targt(s). Saved to Drive automatically as reports generated.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
export async function scanWordpress(target: string, page: puppeteer.Page) {
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
 * @description Runs Wappalyzer test scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
export async function runWappalyzer(target: string, page: puppeteer.Page) {
    await page.goto('https://hackertarget.com/whatweb-scan/', { waitUntil: 'networkidle2' });

    await page.type('[name="scantarget"],[name="theinput"]', target);

    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}

/**
 * @description Runs as full Nikto vulnerability scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
export async function runNikto(target: string, page: puppeteer.Page) {
    await page.goto('https://hackertarget.com/nikto-website-scanner/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('[name="scantarget"],[name="theinput"]', {timeout: 12000});
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
 * @description Runs as full OpenVAS scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
export async function runOpenVAS(target: string, page: puppeteer.Page) {
    await page.goto('https://hackertarget.com/openvas-scan/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('#reporttype');
    await page.select('#reporttype', 'Enhanced');

    await page.type('[name="scantarget"],[name="theinput"]', target);
    await page.click('[name="terms"]');

    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);
}

/**
 * @description Runs as full Nmap scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
export async function runNMAP(target: string, page: puppeteer.Page) {
    await page.goto('https://hackertarget.com/nmap-online-port-scanner/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('[name="scantarget"]');

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
 * @description Runs as full Jooma scan on the given target or target(s). Saved to Drive automatically as reports generated.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
 export async function runJoomla(target: string, page: puppeteer.Page) {
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
 * @description Runs as full Drupal scan on the given target or target(s). Saved to Drive automatically as reports generated.
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
 export async function runDrupal(target: string, page: puppeteer.Page) {
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
 * @description Runs SQLi injection test on the target
 * @param {string} target URL of target
 * @param {puppeteer.Page} page Puppeteer Page Object
 */
export async function runSQLInjectionScan(target: string, page: puppeteer.Page) {
    await page.goto('https://hackertarget.com/sql-injection-test-online/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[name="scantarget"]', { timeout: 120000 });

    await page.type('input[name="scantarget"]', target);
    await page.select('[name="useragent"]', 'chrome');

    await page.click('[name="terms"]');
    return Promise.all([
        page.click('#clickform'),
        page.waitForNavigation(),
        page.waitForSelector('.alert-success', { visible: true, timeout: 12000 })
    ]);

}


/**
 * @description Runs BlindElephant recon scan on the given target or targt(s). Saved to Drive automatically as reports generated.
 * @param {string} target
 * @param {puppeteer.Page} page
 */
export async function runBlindElephant(target: string, page: puppeteer.Page) {
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