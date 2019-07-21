#!/usr/bin/env node

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") })

import * as puppeteer from "puppeteer";
import * as args from "commander";
import * as _ from 'lodash';

// init first

import * as admin from 'firebase-admin';

const serviceAccount = require('../config/cgreenential.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL: 'https://clear-wind-236520.firebaseio.com/' });
admin.firestore().settings({ timestampsInSnapshots: true });

import * as HackerTarget from './hackertarget';
import { logScan, stopBrowser } from './utils';
import * as Puppeteer from 'puppeteer';

const chalk = require('chalk');
const log = console.log;

args
    .version("0.0.1")
    .option("-t, --target <target>", "target host")
    .option("-h, --headfull [headfull]", "headfull browser launch")
    .option("-f, --filters [filters]", "(Opt) Shodan Filters")
    .parse(process.argv);



async function scan() {
    try {
        const { target } = args.parse(process.argv);
        log(chalk.green('Executing Scan: ', target));

        const options = {
            ignoreHTTPSErrors: true,
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors', '--disk-cache-size=1', '--disable-infobars'],
        };
        const browser = await puppeteer.launch(options);

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(15000);

        // Login
        await HackerTarget.login(process.env.HACKERTARGET_USERNAME, process.env.HACKERTARGET_PASSWORD, page);

        await HackerTarget.profileTarget(target, page);
        log(chalk.green('Executed Domain Profiling', target));

        await HackerTarget.runNikto(target, page);
        log(chalk.green('Executed Nikto Scanner (Full):', target));

        await HackerTarget.scanWP(target, page);
        log(chalk.green('Executed WP Full Scanner:', target));

        await HackerTarget.runNMAP(target, page);
        log(chalk.green('Executed NMAP (-sV) Scanner:', target));

        await HackerTarget.runOpenVAS(target, page);
        log(chalk.green('Execute OpenVAS Scanner:', target));

        log(`Finished HackerTarget Scanning for: ${target}.`);
        await logScan(target);
        await stopBrowser(browser);
    } catch (error) {
        console.error("Migration failed!", error);
    }
}


scan();