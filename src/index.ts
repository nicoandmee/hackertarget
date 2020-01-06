#!/usr/bin/env node

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") })

import * as puppeteer from "puppeteer";
import * as args from "commander";
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as readline from 'readline';

import * as HackerTarget from './hackertarget';
import { stopBrowser, sanitizeInput } from './utils';

const chalk = require('chalk');
const log = console.log;

args
    .version('0.0.1', '-v, --version')
    .option("-t, --target <target>", "target host")
    .option("-f --file <file>", ".txt file containing targets to scan")
    .option("-m, --modules <modules>", "modules to run")
    .parse(process.argv);



async function scan() {
    try {
        const opts = args.parse(process.argv);
        const targets = [];

        // Handle lists of targets
        if (opts.file) {
            log(chalk.green('Importing targets'));

            // Import the file
            let reader = readline.createInterface({
                input: fs.createReadStream(resolve(__dirname, opts.file)),
            });

            reader.on('line', (line) => {
                targets.push(sanitizeInput(line));
            });
        }

        if (opts.target) {
            targets.push(sanitizeInput(opts.target));
        }

        log(chalk.green(`Running on ${targets.length} targets`));

        const options = {
            ignoreHTTPSErrors: true,
            headless: process.env.NODE_ENV === 'production' ? true : false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors', '--disk-cache-size=1', '--disable-infobars'],
        };
        const browser = await puppeteer.launch(options);

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(25000);

        // Login
        await HackerTarget.login(process.env.HACKERTARGET_USERNAME, process.env.HACKERTARGET_PASSWORD, page);

        // Scan
        for (const target of targets) {
            log(chalk.green(`Executing scan on ${target} targets`));
            await HackerTarget.runDefaultScanProfile(target, page);
        }

        await stopBrowser(browser);
    } catch (error) {
        console.error("Execution of scan failed!", error);
    }
}


scan();