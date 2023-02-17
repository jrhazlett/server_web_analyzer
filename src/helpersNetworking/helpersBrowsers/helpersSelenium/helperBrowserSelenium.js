/*
npm i selenium-webdriver
npm i chromedriver

Recommended chrome plugin:
https://chrome.google.com/webstore/detail/xpath-helper/hgimnogjllphhhkhlmebbmlgjoejdpjl?hl=en

Example calls:

const stringUrl = "http://www.example.com"
const helperBrowser = new HelperBrowserSelenium()
await helperBrowser.loadUrlAndWaitForLoadCondition( stringUrl, helperBrowser.getCallbackWaitUntilTitleHasSubstring( "Example" ), )
console.log( await helperBrowser.getStringPageSource() )
*/
//
// Libraries - downloaded
//
import webdriver, { By, until } from "selenium-webdriver";
//
// Libraries - custom
//
import helperErrors from "../../../helpersErrors/helperErrors.js";
//
// Public
//
export default class HelperBrowserSelenium {
    /*
    Recommended Chrome plugin for getting unique xpaths: XPath Helper
    https://chrome.google.com/webstore/detail/xpath-helper/hgimnogjllphhhkhlmebbmlgjoejdpjl?hl=en
    */
    //
    // Public - get - array
    //
    /**
     * @param {string} argStringUrl
     * @param {string} argStringXpath
     * @param {Function} argCallbackArgUnpackedArrayReturnAttribute
     * */
    getArrayOfStringsViaXpath = async (
        argStringUrl,
        argStringXpath,
        argCallbackArgUnpackedArrayReturnAttribute
    ) => {
        const arrayOfWebElements = await this.getArrayOfElementHandlesViaXpath(
            argStringUrl,
            argStringXpath
        );
        return argCallbackArgUnpackedArrayReturnAttribute(arrayOfWebElements);
    };

    /**
     * @param {string} argStringUrl
     * @param {string} argStringXpath
     * @returns Promise
     * */
    getArrayOfElementHandlesViaXpath = async (argStringUrl, argStringXpath) => {
        await this.setUrl(argStringUrl);
        return await this.fieldBrowser.findElements(By.xpath(argStringXpath));
    };

    /**
     * Steps:
     * - await findElements()
     * - Promise.all( map() the results )
     * @returns Promise
     * */
    getArrayOfStringsLinks = async (argStringUrl) =>
        await this.getArrayOfStringsViaXpath(
            argStringUrl,
            "//a",
            (...arrayOfWebElements) =>
                arrayOfWebElements.map((itemWebElement) =>
                    itemWebElement.getAttribute("href")
                )
        );
    //
    // Public - get - callback
    //
    /**
     * Reminder: This IS case sensitive
     *
     * @param {string} argStringSub
     * @returns Function
     * */
    getCallbackWaitUntilTitleHasSubstring = (argStringSub) => () =>
        until.titleContains(argStringSub);
    //
    // Public - get - string
    //
    /**
     * @param {string} argStringUrl
     * @returns Promise
     * */
    getStringPageSource = async (argStringUrl) => {
        await this.setUrl(argStringUrl);
        await this.fieldBrowser.getPageSource();
    };

    /**
     * @returns Promise
     * */
    getStringUrlCurrent = async () => this.fieldBrowser.getCurrentUrl();
    //
    // Public - set
    //
    /**
     * @param {string} argStringXpath
     * @param {string} argStringText
     * @returns Promise
     *
     * Send string to all returned WebElements
     *
     * Reminder: WebElement.sendKeys() returns a Promise. This code doesn't need to block, it just needs to make
     * sure all promises are resolved by this method's conclusion.
     * */
    setTextForFieldAtXpath = async (argStringXpath, argStringText) =>
        Promise.all(
            (
                await this.fieldBrowser.findElements(By.xpath(argStringXpath))
            ).map((itemWebElement) => itemWebElement.sendKeys(argStringText))
        );

    /**
     * @param {string[][]} argArrayOfPairsStringsXpathsAndStringsText
     * */
    setTextForFieldAtXpathViaArrayOfPairsXpathAndText = async (
        argArrayOfPairsStringsXpathsAndStringsText
    ) => {
        //
        // Reminder: WebElement.getAttribute() returns a Promise. This code doesn't need to block, it just needs to make
        // sure all promises are resolved by this method's conclusion.
        // Resolve all promises before concluding method
        await Promise.all(
            argArrayOfPairsStringsXpathsAndStringsText.map(
                async ([itemStringXpath, itemStringText]) => {
                    const arrayOfWebElements =
                        await this.fieldBrowser.findElements(
                            By.xpath(itemStringXpath)
                        );
                    return arrayOfWebElements.length === 0
                        ? new Promise((resolve) =>
                              resolve(
                                  helperErrors.raiseError(
                                      Error(
                                          `Xpath not found; itemStringXpath = ${itemStringXpath}; itemStringText = ${itemStringText}`
                                      )
                                  )
                              )
                          )
                        : //
                          // Send string to all returned WebElements
                          //
                          // Reminder: WebElement.sendKeys() returns a Promise. This code doesn't need to block, it just needs to make
                          // sure all promises are resolved by this method's conclusion.
                          Promise.all(
                              arrayOfWebElements.map((itemPromiseSendKey) =>
                                  itemPromiseSendKey.sendKeys(itemStringText)
                              )
                          );
                }
            )
        );
    };

    /**
     * @param {string} argStringUrl
     * */
    setUrl = async (argStringUrl) => {
        this.setupBrowserIfUndefined();
        console.log(`Setting url: ${argStringUrl}...`);
        await this.fieldBrowser.get(argStringUrl);
        console.log(`Setting url: ${argStringUrl}...DONE\n`);
        return this;
    };
    //
    // Public - setup
    //
    /***/
    setupBrowserIfUndefined = () => {
        if (this.fieldBrowser === undefined) {
            //
            // Build list of any options for browser
            //
            const arrayOfStringsOptions = [
                //
                // Keep browser invisible
                //
                "--disable-dev-shm-usage",
                "--headless",
                "--no-sandbox",
                //
                // Ignore certificate errors
                //
                "--ignore-certificate-errors",
            ];
            //
            // Create browser process
            //
            // Reminder: Separating out new webdriver.Builder().forBrowser("chrome") into its own section triggers an error
            const stringNameBrowser = "chrome";

            if (arrayOfStringsOptions.length === 0) {
                this.fieldBrowser = new webdriver.Builder()
                    .forBrowser(stringNameBrowser)
                    .build();
            } else {
                this.fieldBrowser = new webdriver.Builder()
                    .forBrowser(stringNameBrowser)
                    .setChromeOptions(arrayOfStringsOptions)
                    .build();
            }
            //
            // On exit, make sure we quit out of any open browsers
            //
            process.addListener("beforeExit", async () => {
                try {
                    await this.fieldBrowser.quit();
                } catch (err) {
                    // Reminder: This quiets the 'NoSuchSessionError' message
                    console.log("");
                }
            });
        }
    };
    //
    // Public - wait
    //
    /**
     * @param {Function} argCallbackConditional
     * */
    waitUntilCallbackConditionMet = async (argCallbackConditional) =>
        this.fieldBrowser.wait(argCallbackConditional());
    //
    // Constructor
    //
    constructor() {
        this.fieldBrowser = undefined;
    }
}

/*
getArrayOfStringsValuesFromXpathAndAttribute = async ( argStringXpath, argStringNameAttribute ) => {
    //
    // Unpack xpath and attribute name from each list item
    //
    const arrayOfWebElements = await this.fieldBrowser.findElements( By.xpath( argStringXpath ) )
    //
    // Create array of values from attributes returned from xpath search
    //
    // Reminder: WebElement.getAttribute() returns a Promise. This code doesn't need to block, it just needs to make
    // sure all promises are resolved by this method's conclusion.
    const arrayOfPromises = new Array( arrayOfWebElements.length )
    for ( let itemIntIndex = 0, intLength = arrayOfWebElements.length; itemIntIndex < intLength; itemIntIndex++ ) {
        // Get value from web element
        arrayOfPromises[ itemIntIndex ] = arrayOfWebElements[ itemIntIndex ].getAttribute( argStringNameAttribute )
    }
    return Promise.all( arrayOfPromises )
}
*/
