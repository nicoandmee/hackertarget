
import * as puppeteer from 'puppeteer';


export function sanitizeInput(input: string) {
    if (!input || input === '') return;
    input = input.replace(/^https?:\/\//, '');
    input = input.replace(/\//g, '');
    console.debug(`Sanitized input: ${input}`);
    return input;
}

export async function stopBrowser(browser: puppeteer.Browser) {
    try {
        await browser.close();
    } catch (error) {
        console.error('stopBrowser', error);
    }
}
