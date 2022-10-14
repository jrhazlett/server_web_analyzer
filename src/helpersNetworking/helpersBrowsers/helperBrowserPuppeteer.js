//
// Libraries - downloaded
//
import puppeteer from "puppeteer";
//
// Libraries - custom
//
import helperApp from "../../helpersApp/helperApp.js";
import helperPathsProject from "../../helpersDisk/helpersPaths/helperPathsProject.js";
//
// Public
//
export default class HelperBrowserPuppeteer {
    //
    // Public - click
    //
    /***/
    clickSubmitOnForm = async () => { await this.fieldPage.click( "input[type=\"submit\"]" ) }
    //
    // Public - close
    //
    /**
     * Reminder: This auto-loads into process.on( "exit", ... ) on instantiation,
     * so this function doesn't necessary need to be called.
     * */
    closeBrowser = () => {
        if ( this.fieldBrowser !== undefined ) { this.fieldBrowser.close() }
    }
    //
    // Public - get - array
    //
    /**
     * @returns []
     * */
    getArrayOfStringsDivTagH1 = async () => {
        return this.getArrayOfStringsViaXpath(
            "//div//h1",
            ( itemWebElements ) => itemWebElements.innerText,
        )
    }

    /**
     * REMINDER: VERIFIED WORKS
     *
     * Reminder: This requires 'await' even though the ide tries to claim otherwise
     *
     * @returns []
     * */
    getArrayOfStringsLinksText = async () => {
        return this.getArrayOfStringsViaXpath(
            "//a[@href]",
            ( ...arrayToReturn ) => arrayToReturn.map( itemWebElements => itemWebElements.text ),
        )
    }

    /**
     * REMINDER: VERIFIED WORKS
     *
     * Reminder: This requires 'await' even though the ide tries to claim otherwise
     *
     * @returns []
     * */
    getArrayOfStringsLinksUrl = async () => {
        return this.getArrayOfStringsViaXpath(
            "//a[@href]",
            ( ...arrayToReturn ) => arrayToReturn.map( itemWebElements => itemWebElements.href ),
        )
    }

    /**
     * @returns []
     * */
    getArrayOfStringsParagraphsText = async () => {
        return this.getArrayOfStringsViaXpath(
            "//p",
            ( ...arrayToReturn ) => arrayToReturn.map( itemWebElements => itemWebElements.innerText ),
        )
    }

    /**
     * @param {string} argStringXpath
     * @param {Function} argCallbackArgUnpackedArrayReturnAttribute
     *
     * Notes: Must be in the following format or else this will triger an undefined error
     * ( ...argArray ) => argArray.map( itemWebElement => itemWebElement.attributeToGet )
     * */
    getArrayOfStringsViaXpath = async ( argStringXpath, argCallbackArgUnpackedArrayReturnAttribute ) => {

        const arrayOfWebElements = await this.getArrayOfWebElementsViaXpath( argStringXpath )
        return this
            .fieldPage
            .evaluate(
                // Reminder: This MUST be a top-level callback with the following format...
                // ( ...argArray ) => argArray.map( itemWebElement => itemWebElement.attributeToGet )
                // Trying to pass a callback that operated on an item-exclusive operation will result in an 'argCallback is undefined' error
                argCallbackArgUnpackedArrayReturnAttribute,
                ...arrayOfWebElements,
            )
    }

    /**
     * @param {string} argStringXpath
     *
     * Notes: Must be in the following format or else this will triger an undefined error
     * ( ...argArray ) => argArray.map( itemWebElement => itemWebElement.attributeToGet )
     * */
    getArrayOfWebElementsViaXpath = async ( argStringXpath ) => {

        let err = this.getErrorIfPageLoadNotWaitedFor()
        if ( err !== undefined ) { return err }
        //
        // Some xpaths have had issues during tests (ie //h1); make sure they're not used
        //
        err = this._getErrorIfXpathInvalid( argStringXpath )
        if ( err !== undefined ) { return err }

        return await this.fieldPage.$x( argStringXpath )
    }

    /**
     * @returns { Error | undefined }
     * */
    getErrorIfPageLoadNotWaitedFor = () => {

        if ( !this.fieldBoolXpathLoaded ) {
            return Error([
                "Page load not waited for.",
                `this.fieldBoolXpathLoaded = ${this.fieldBoolXpathLoaded}`,
                " "
            ].reduce( (itemStringPrev, itemString) => itemStringPrev + "\n" + itemString ))
        }
        return undefined
    }

    /**
     * @returns string
     * */
    getStringSourceForPage = async () => { return await this.fieldPage.content() }

    /**
     * @returns string
     * */
    getStringTitle = async () => {
        //
        // Reminder: Use the xpath here, instead of using the built-in function
        // because this approach tells puppeteer to wait for the title to load.
        // Also, at this point, there's a whole bunch of guiding logic underlying the
        // page loads. This approach keeps the behavior consistent.
        //
        const arrayToReturn = await this.getArrayOfStringsViaXpath(
            "//title",
            ( ...arrayOfWebElements ) => arrayOfWebElements.map( itemWebElement => itemWebElement.innerText ),
        )
        //
        // If there's a value in the returned array, then index 0 will be the title
        //
        if ( arrayToReturn.length > 0 ) { return arrayToReturn[ 0 ] }
        //
        // If we get this far, then nothing came up for the title
        //
        return undefined
    }
    //
    // Public - set
    //
    /**
     * @param {string} argStringXpath
     * @param {string} argStringValue
     * @returns []
     *
     * The array contains web elements
     * */
    setValueForFieldAtXpath = async ( argStringXpath, argStringValue ) => {

        const arrayOfWebElements = await this.getArrayOfWebElementsViaXpath( argStringXpath )

        for ( let itemIndex = 0, intLength = arrayOfWebElements.length; itemIndex < intLength; itemIndex++ ) {
            const itemWebElement = arrayOfWebElements[ itemIndex ]
            itemWebElement.value = argStringValue
        }
        return arrayOfWebElements
    }

    /**
     * @param {Object} argObjectStringsXpathsAndStringsValues
     * */
    setValueForFieldsAtXpathsAndSubmitForm = async ( argObjectStringsXpathsAndStringsValues ) => {

        const arrayOfStringXpaths = Object.entries( argObjectStringsXpathsAndStringsValues )
        for ( let itemIndex = 0, intLength = arrayOfStringXpaths.length; itemIndex < intLength; itemIndex++ ) {

            const [ itemStringXpath, itemStringValue ] = arrayOfStringXpaths[ itemIndex ]
            await this.setValueForFieldAtXpath( itemStringXpath, itemStringValue, )
        }
        await this.clickSubmitOnForm()
    }

    /**
     * @param {string} argStringUrl
     * @returns this
     * */
    setUrl = async ( argStringUrl ) => {
        this.fieldBoolXpathLoaded = false
        console.log( `Setting url: ${argStringUrl}...` )
        await this.setupBrowserIfUndefined()
        await this.fieldPage.goto( argStringUrl, { waitUntil: "domcontentloaded" }, )
        console.log( `Setting url: ${argStringUrl}...DONE\n` )
        return this
    }

    /**
     * @param {string} argStringUrl
     * @param {string} argStringXpath
     * */
    setUrlAndWaitForXpath = async ( argStringUrl, argStringXpath, ) => {
        await this.setUrl( argStringUrl )
        await this.waitForXpath( argStringXpath )
    }

    /**
     * @param {string} argStringXpath
     * */
    waitForXpath = async ( argStringXpath ) => {
        console.log( `Waiting for xpath to load: ${argStringXpath}...` )
        await this.fieldPage.waitForXPath(
            argStringXpath,
            { timeout: this._getNumberSecsFromInt( this.fieldSecsTimeoutDefault ) },
        )
        console.log( `Waiting for xpath to load: ${argStringXpath}...DONE\n` )
        this.fieldBoolXpathLoaded = true
    }
    //
    // Public - write
    //
    /**
     * @param {string} argStringPathFilePicture
     * @param {string} argStringUrl
     * */
    writeFilePictureToDiskFromUrl = async ( argStringPathFilePicture, argStringUrl ) => {
        await this.setupBrowserIfUndefined()
        await this.setUrl( argStringUrl )
        await this.fieldPage.screenshot( { path: helperPathsProject.getStringPathDataOutput( argStringPathFilePicture ) } )
    }
    //
    // Public - setup
    //
    /***/
    setupBrowserIfUndefined = async () => {
        if ( this.fieldBrowser === undefined ) {
            this.fieldBrowser = await puppeteer.launch()
            this.fieldPage = await this.fieldBrowser.newPage()
        }
    }
    //
    // Private - get - _getErrorIfXpathInvalid
    //
    /**
     * Reminder: These are xpaths known to be invalid under all conditions
     * */
    static FIELD_SET_OF_KNOWN_INVALID_XPATHS = new Set( [
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
    ] )

    /**
     * @param {string} argStringXpath
     * */
    _getErrorIfXpathInvalid = ( argStringXpath ) => {

        if ( HelperBrowserPuppeteer.FIELD_SET_OF_KNOWN_INVALID_XPATHS.has( argStringXpath ) ) {
            return Error( [
                "argStringXpath is a known invalid value",
                `argStringXpath = ${argStringXpath}`,
                `HelperBrowserPuppeteer.SET_OF_KNOWN_INVALID_XPATHS = ${ this._getStringArrayPrintable( Array.from( HelperBrowserPuppeteer.FIELD_SET_OF_KNOWN_INVALID_XPATHS ).sort() ) }`,
                `\n`,
            ].reduce( ( itemStringPrev, itemString ) => itemStringPrev + "\n" + itemString ) )
        }
        return undefined
    }

    /**
     * @param {[]} argArrayOfStrings
     * @returns string
     * */
    _getStringArrayPrintable = ( argArrayOfStrings ) => {

        if ( argArrayOfStrings.length === 0 ) { return `[]` }
        return `[ ` + argArrayOfStrings.reduce( ( itemStringPrev, itemString ) => itemStringPrev + ", " + itemString ) + ` ]`
    }

    /**
     * @param {number} argIntSecs
     * @returns number
     * */
    _getNumberSecsFromInt = ( argIntSecs ) => {
        // Example: 30000 equates to 30 seconds
        return argIntSecs * 1000
    }
    //
    // Setup
    //
    /***/
    constructor() {

        this.fieldBrowser = undefined
        this.fieldBoolXpathLoaded = false
        this.fieldPage = undefined

        this.fieldSecsTimeoutDefault = 5
        //
        // Tell the app to close the browser on exit
        //
        helperApp.appendCallbackToArrayToRunOnExit( this.closeBrowser )
    }
}









































