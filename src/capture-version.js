import { readFile, writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer';
import packageJson from '../package.json' assert { type: 'json' };

async function getPage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
    ],
  });
  const page = await browser.newPage();
  return { browser, page };
}

async function closePage(browser, page) {
  await page.close();
  await browser.close();
}

function getVersion() {
  return packageJson.version;
}

export async function captureVersion(version) {
  const { browser, page } = await getPage();
  await page.emulateMediaFeatures([
    {name: 'prefers-reduced-motion', value: 'reduce'},
  ]);
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `docs/screenshots/${version}-desktop.png`, fullPage: true });
  await page.setViewport({ width: 390, height: 630 });
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: `docs/screenshots/${version}-mobile.png`, fullPage: true });
  await closePage(browser, page);
}

async function updateChangelog(version) {
  const changelog = await readFile('docs/CHANGELOG.md', 'utf-8');
  const lines = changelog.split('\n');
  let isCurrentVersion = false;
  let lastLine;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`# [${version}]`)) {
      isCurrentVersion = true;
    } else if (isCurrentVersion) {
      if (lines[i].startsWith('## ') || lines[i].startsWith('# ')) {
        lastLine = i;
        break;
      }
    }
  }

  const newLine = `![${version}](./screenshots/${version}-desktop.png) ![${version}](./screenshots/${version}-mobile.png) \n`;
  lines.splice(lastLine, 0, newLine);
  await writeFile('docs/CHANGELOG.md', lines.join('\n'));
}


async function main() {
  const version = getVersion();
  await captureVersion(version);
  await updateChangelog(version);
}

main()