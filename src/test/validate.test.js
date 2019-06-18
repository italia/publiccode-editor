//import faker from "faker";
import puppeteer from "puppeteer";
jest.setTimeout(30000);
let page;
let browser;
const width = 1920;
const height = 1080;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

afterAll(() => {
  browser.close();
});

test('should click', async () => {
  await page.goto(
    'localhost:3000'
  );
  await page.click('input[name=name]');
  await page.type('input[name=name]','hello');

  await page.click('input[name=releaseDate]');
  await page.type('input[name=releaseDate]','10/02/2019');
  await page.click('input[name=url]');
  await page.type('input[name=url]','https://google.it');
  //
  // await page.click('input[name=publiccodeYmlVersion]:first');
  // await page.click('input[name=publiccodeYmlVersion][value=0.1]');

  await page.click('#section_3 span.clearfix');

  // await page.click('input[name=description_genericName]:first');
  // await page.type('input[name=description_genericName]','name');

  await page.click('input[name=description_shortDescription]:first');
  await page.type('input[name=description_shortDescription]','shdescription');

  await page.click('a.link');

  await page.click('input[name=description_features.0]:first');
  await page.type('input[name=description_features.0]','feat');

  await page.click('input[role=listbox]:first');
  await page.type('input[role=listbox]','database');

  await page.click('input[name=legal_license]:first');
  await page.type('input[name=legal_license]','description');

  await page.click('input[name=legal_repoOwner]:first');
  await page.type('input[name=legal_repoOwner]','repo');

  await page.click('input[name=maintenance_type]:first');


  await page.click('input[name=legal_repoOwner]:first');

  await page.click('input[name=maintenance_contacts.0.name]:first');
  await page.type('input[name=maintenance_contacts.0.name]','contname');

  await page.click('input[name=localisation_availableLanguages.0]:first');
  await page.type('input[name=localisation_availableLanguages.0]','it');
});