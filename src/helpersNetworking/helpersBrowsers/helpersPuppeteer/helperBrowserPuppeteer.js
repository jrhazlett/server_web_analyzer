//
// Libraries - downloaded
//
import prettyPrinterForHumans from "pretty_printer_for_humans";
import puppeteer from "puppeteer";
//
// Libraries - custom
//
import helperApp from "../../../helpersApp/helperApp.js";
import HelperElementHandle from "./support/helperElementHandle.js";
import helperErrors from "../../../helpersErrors/helperErrors.js";
import helperFiles from "../../../helpersDisk/helpersFiles/helperFiles.js";
import helperPathsProject from "../../../helpersDisk/helpersPaths/helperPathsProject.js";
import helperPrinting from "../../../helpersPrinting/helperPrinting.js";
import helperStrings from "../../../helpersStrings/helperStrings.js";
//
// Public
//
export default class HelperBrowserPuppeteer {
    //
    // Public - click
    //
    /**
     * Reminder: Actual form filling is handled for setValuesForFieldsAtXpathsViaArrayOfPairsAndSubmitForm()
     * */
    clickSubmitOnForm = async () => { await this.fieldPage.click('input[type="submit"]'); }

    /**
     * @param {string} argStringXpath
     * */
    clickXpath = async (argStringXpath) => {
        const arrayOfHelperElementHandlesViaXpath = await this.getArrayOfHelperElementHandlesViaXpath(argStringXpath);
        let itemIndex = -1;
        const intLength = arrayOfHelperElementHandlesViaXpath.length;
        while (++itemIndex < intLength) { await arrayOfHelperElementHandlesViaXpath[itemIndex].click(); }
    };
    //
    // Public - close
    //
    /**
     * Reminder: This auto-loads into process.on( "exit", ... ) on instantiation,
     * so this function doesn't necessary need to be called.
     * */
    closeBrowser = () => {
        if (this.fieldBrowser !== undefined) { this.fieldBrowser.close(); }
    };
    //
    // Public - get - getArrayOfHelperElementHandlesViaXpath
    //
    /**
     * @param {string} argStringXpath
     * @returns Promise
     * */
    getArrayOfHelperElementHandlesViaXpath = async (argStringXpath) => {
        return new Promise(async (resolve) => {
            resolve(
                this._getArrayOfHelperElementHandlesFromArrayOfElementHandles(
                    await this._getArrayOfWebElementsViaXpath(argStringXpath)
                )
            )
        } );
    }

    /**
     * @param {string} argStringXpath
     * @returns {Promise}
     *
     * Notes: Must be in the following format or else this will trigger an undefined error
     * ( ...argArray ) => argArray.map( itemWebElement => itemWebElement.attributeToGet )
     * */
    _getArrayOfWebElementsViaXpath = async (argStringXpath) => {
        let err = this.getErrorIfPageLoadNotWaitedFor();
        if (err !== undefined) {
            return err;
        }
        //
        // Some xpaths have had issues during tests (ie //h1); make sure they're not used
        //
        err = this._getErrorIfXpathInvalid(argStringXpath);
        if (err !== undefined) {
            return err;
        }

        return new Promise(async (resolve) => {
            resolve(await this.fieldPage.$x(argStringXpath))
        } );
    };

    /**
     * @param {puppeteer.ElementHandle[]} argArrayOfElementHandles
     * @returns {HelperElementHandle[]}
     * */
    _getArrayOfHelperElementHandlesFromArrayOfElementHandles = ( argArrayOfElementHandles ) => { return argArrayOfElementHandles.map( (itemElementHandle) => { return new HelperElementHandle(itemElementHandle, this.fieldPage) } ); }

    //
    // Public - get - array
    //
    /**
     * @returns {Promise}
     * */
    getArrayOfStringsLinksText = async () => { return this.getArrayOfStringsViaXpath( "//a[@href]", "innerText", ) }

    /**
     * @returns {Promise}
     * */
    getArrayOfStringsLinksUrl = async () => { return this.getArrayOfStringsViaXpath( "//a[@href]", "href", ) }

    /**
     * @returns {Promise}
     * */
    getArrayOfStringsParagraphsText = async () => { return this.getArrayOfStringsViaXpath( "//p", "innerText", ) }

    /**
     * @param {string} argStringXpath
     * @param {string} argStringNameForAttribute
     * */
    getArrayOfStringsViaXpath = async ( argStringXpath, argStringNameForAttribute ) => {
        return Promise.all( ( await this.getArrayOfHelperElementHandlesViaXpath( argStringXpath ) )
            .map( async ( itemHelperElementHandle ) => {
                return await this.fieldPage.evaluate(
                    async (...argArrayOfArgs) => { return argArrayOfArgs[ 0 ][ argArrayOfArgs[ 1 ] ] },
                    itemHelperElementHandle.fieldElementHandle,
                    argStringNameForAttribute,
                )
            }
        ) )
    }
    //
    // Public - get - getErrorIfPageLoadNotWaitedFor
    //
    /**
     * @returns {Error|undefined}
     * */
    getErrorIfPageLoadNotWaitedFor = () => {
        return this.fieldBoolXpathLoaded
            ? undefined
            : helperErrors.raiseError(
                  Error(
                      helperStrings.getStringByCombiningArray(
                          [
                              "Page load not waited for.",
                              `this.fieldBoolXpathLoaded = ${this.fieldBoolXpathLoaded}`,
                              " ",
                          ],
                          "\n"
                      )
                  )
              );
    };
    //
    // Public - get - getStringSourceForPage
    //
    /**
     * @returns {string}
     * */
    getStringSourceForPage = async () => { return new Promise(async (resolve) => { resolve(await this.fieldPage.content()) } ); }
    //
    // Public - get - getStringTitle
    //
    /**
     * @returns {string}
     * */
    getStringTitle = async () => {
        //
        // Reminder: Use the xpath here, instead of using the built-in function
        // because this approach tells puppeteer to wait for the title to load.
        // Also, at this point, there's a whole bunch of guiding logic underlying the
        // page loads. This approach keeps the behavior consistent.
        //
        return ( await this.getArrayOfStringsViaXpath(
            "//title",
            "innerText"
        ) )[ 0 ]
    };
    //
    // Public - load
    //
    /**
     * @param {string} argStringPathFile
     * */
    setCookiesWithDataFromFile = async (argStringPathFile) => {
        return await this.fieldPage.setCookie(
            helperFiles.getObjectFromFile(argStringPathFile)
        );
    }
    //
    // Public - set
    //
    /**
     * @param {string} argStringUrl
     * @returns {this}
     * */
    setUrl = async (argStringUrl) => {
        this.fieldBoolXpathLoaded = false;
        await helperPrinting.wrapperPrintMessage(
            `Setting url: ${argStringUrl}`,
            async () => {
                //
                // Setup the browser if its not already initialized
                //
                await this.setupBrowserIfUndefined();
                //
                // Load url and wait for dom to downloaded
                //
                await this.fieldPage.goto(argStringUrl, {
                    waitUntil: "domcontentloaded",
                });
            }
        );
        return this;
    };

    /**
     * @param {string} argStringUrl
     * @param {string} argStringXpath
     * */
    setUrlAndWaitForXpath = async (argStringUrl, argStringXpath) => {
        await this.setUrl(argStringUrl);
        await this.waitForXpath(argStringXpath);
    };

    /**
     * @param {string} argStringXpath
     * @param {string} argStringValue
     * @returns {any[]}
     *
     * The array contains web elements
     * */
    setValueForTextFieldAtXpath = async (argStringXpath, argStringValue) => {
        return Promise.all(
            (
                await this.getArrayOfHelperElementHandlesViaXpath(
                    argStringXpath
                )
            ).map((itemHelperElementHandle) =>
                itemHelperElementHandle.setValueForTextField(argStringValue)
            )
        );
    }

    /**
     * @param {(string)[][]} argArrayOfPairsStringXpathsAndStringValues
     * */
    setValuesForFieldsAtXpathsViaArrayOfPairsAndSubmitForm = async (
        argArrayOfPairsStringXpathsAndStringValues
    ) => {
        let itemIndex = -1;
        const intLength = argArrayOfPairsStringXpathsAndStringValues.length;
        while (++itemIndex < intLength) {
            await this.setValueForTextFieldAtXpath(
                ...argArrayOfPairsStringXpathsAndStringValues[itemIndex]
            );
        }
        await this.clickSubmitOnForm();
    };
    //
    // Public - setup
    //
    /***/
    setupBrowserIfUndefined = async () => {
        if (this.fieldBrowser === undefined) {
            this.fieldBrowser = await puppeteer.launch();
            this.fieldPage = await this.fieldBrowser.newPage();
        }
    };
    //
    // Public - wait
    //
    /**
     * @param {string} argStringXpath
     * */
    waitForXpath = async (argStringXpath) => {
        console.log(`Waiting for xpath to load: ${argStringXpath}...`);
        await this.fieldPage.waitForXPath(argStringXpath, {
            timeout: this._getNumberSecsFromInt(this.fieldSecsTimeoutDefault),
        });
        console.log(`Waiting for xpath to load: ${argStringXpath}...DONE\n`);
        this.fieldBoolXpathLoaded = true;
    };
    //
    // Public - write
    //
    /**
     * @param {string} argStringPathFile
     * */
    writeCookiesForCurrentPageToFile = async (argStringPathFile) => {
        await helperFiles.writeObjectToFile(
            argStringPathFile,
            await this.fieldPage.cookies()
        );
    }

    /**
     * @param {string} argStringPathFilePicture
     * @param {string} argStringUrl
     * */
    writeFilePictureToDiskFromUrl = async (
        argStringPathFilePicture,
        argStringUrl
    ) => {
        await this.setupBrowserIfUndefined();
        await this.setUrl(argStringUrl);
        await this.fieldPage.screenshot({
            path: helperPathsProject.getStringPathDataOutput(
                argStringPathFilePicture
            ),
        });
    };
    //
    // Private - get - _getErrorIfXpathInvalid
    //
    /**
     * Reminder: These are xpaths known to be invalid under all conditions
     * */
    static FIELD_SET_OF_KNOWN_INVALID_XPATHS = new Set([
        // Reminder: //h1 definitely doesn't work; other tags do
        // Assuming this same issue exists for all //h<number> tags, then
        // block all of them
        // NOTE: //div//h1 DOES work, so the issue seems to be JUST with '//h1'
        "//h1",
        "//h2",
        "//h3",
        "//h4",
        "//h5",
        "//h6",
    ]);

    /**
     * @param {string} argStringXpath
     * @returns {(undefined|Error)}
     * */
    _getErrorIfXpathInvalid = (argStringXpath) => {
        return !HelperBrowserPuppeteer.FIELD_SET_OF_KNOWN_INVALID_XPATHS.has(
            argStringXpath
        )
            ? undefined
            : helperErrors.raiseError(
                  Error(
                      helperStrings.getStringByCombiningArray(
                          [
                              "argStringXpath is a known invalid value",
                              `argStringXpath = ${argStringXpath}`,
                              `HelperBrowserPuppeteer.SET_OF_KNOWN_INVALID_XPATHS = ${this._getStringArrayPrintable(
                                  Array.from(
                                      HelperBrowserPuppeteer.FIELD_SET_OF_KNOWN_INVALID_XPATHS
                                  ).sort()
                              )}`,
                              `\n`,
                          ],
                          "\n"
                      )
                  )
              );
    };

    /**
     * @param {number} argIntSecs
     * @returns {number}
     *
     * Example: 30000 equates to 30 seconds
     * */
    _getNumberSecsFromInt = (argIntSecs) => argIntSecs * 1000;

    /**
     * @param {string[]} argArrayOfStrings
     * @returns {string}
     * */
    _getStringArrayPrintable = (argArrayOfStrings) => {
        return argArrayOfStrings.length === 0
            ? `[]`
            : `[ ` +
            argArrayOfStrings.reduce((itemStringPrev, itemString) => {
                return itemStringPrev + ", " + itemString;
            }) +
            ` ]`;
    }
    //
    // Setup
    //
    /***/
    constructor() {
        this.fieldBrowser = undefined;
        this.fieldBoolXpathLoaded = false;
        this.fieldPage = undefined;

        this.fieldSecsTimeoutDefault = 5;
        //
        // Tell the app to close the browser on exit
        //
        helperApp.appendCallbackToArrayToRunOnExit(this.closeBrowser);
    }
}
