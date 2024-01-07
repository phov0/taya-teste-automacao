import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin())

export const createPage = async () =>{
    const browser = await puppeteer.launch({
        // executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
        headless: false,
        defaultViewport: null,
        userDataDir: "./tmp",
    });

    const page = await browser.newPage();
    // await page.setViewport({ width: 1920, height: 1080});
    //await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
    await page.goto(
        `https://imobiliario.desenvolvimento.taya.com.br`
    );

    return {page, browser};
}