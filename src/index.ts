#!/usr/bin/env node

import * as puppeteer from "puppeteer";
import * as args from "commander";
import * as _ from 'lodash';

// Automation for HackerTarget services
import * as HackerTarget from './hackertarget';

// wrap chalk to log cause we love colors
const chalk = require('chalk');
const log = console.log;

args
    .version("0.0.1")
    .option("-full, --headfull <headfull>", "Whether to open browser or use headless (default).")
    .option("-h, --host <host>", "Target Host")
    .option("-f, --filters <filters>", "(Opt) Shodan Filters")
    .parse(process.argv);



async function scan() {
    const target = process.args["host"];
    const filters = process.env.args["filters"]; // unused for now

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


    await HackerTarget.profileTarget(target, page);
    log(chalk.red('Executed: Domain Profiling', target));

    await HackerTarget.runWappalyzer(target, page);
    log(chalk.red('Executed: Wappalyzer', target));

    await HackerTarget.runNikto(target, page);
    log(chalk.red('Executed: Nikto Scanner (Full) | UA: Chrome', target));

    await HackerTarget.scanWP(target, page);
    log(chalk.red('Executed: WP Full Scanner', target));

    await HackerTarget.runNMAP(target, page);
    log(chalk.red('Executed: Full nmap', target));

    await HackerTarget.runOpenVAS(target, page);
    log(chalk.red('Executed: OpenVAS Scanner', target));

    console.timeEnd(`HackerTarget Scan | Started with target: ${target}`);
    log(`Finished HackerTarget Scanning for: ${target}!`);


    // TODO: [BAC-11] Add shodan integration
    let searchOpts = {
        facets: 'port:100,country:100',
        // minify: false,
    };
}


scan();