
import * as admin from "firebase-admin";
import * as puppeteer from 'puppeteer';
import * as subquest from "subquest";

const database = admin.database();

export async function logScan(target: string) {
    var scanRef = database.ref().push();
    const key = scanRef.key;

    console.log(`Scan ID: ${key}`);

    return scanRef.set({
        executedAt: admin.firestore.Timestamp.now(),
        id: key,
        domain: target.toString(),
    });
}



export async function stopBrowser(browser: puppeteer.Browser) {
    try {
        await browser.close();
    } catch (error) {
        console.error('stopBrowser', error);
    }
}
