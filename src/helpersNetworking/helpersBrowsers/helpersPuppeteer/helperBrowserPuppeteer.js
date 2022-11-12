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
    clickSubmitOnForm = async () => { await this.fieldPage.click( "input[type=\"submit\"]" ) }

    /**
     * @param {string} argStringXpath
     * */
    clickXpath = async ( argStringXpath ) => {
        const arrayOfHelperElementHandlesViaXpath = await this.getArrayOfHelperElementHandlesViaXpath( argStringXpath )
        for ( let itemIndex = 0, intLength = arrayOfHelperElementHandlesViaXpath.length; itemIndex < intLength; itemIndex++ ) {
            await arrayOfHelperElementHandlesViaXpath[ itemIndex ].click()
        }
    }
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
    // Public - get - getArrayOfHelperElementHandlesViaXpath
    //
    /**
     * @param {string} argStringXpath
     * @returns []
     * */
    getArrayOfHelperElementHandlesViaXpath = async ( argStringXpath ) => {
        return new Promise(
            async ( resolve ) => {
                resolve( this._getArrayOfHelperElementHandlesFromArrayOfElementHandles(
                    await this._getArrayOfWebElementsViaXpath( argStringXpath )
                ) )
            } )
    }

    /**
     * @param {string} argStringXpath
     *
     * Notes: Must be in the following format or else this will triger an undefined error
     * ( ...argArray ) => argArray.map( itemWebElement => itemWebElement.attributeToGet )
     * */
    _getArrayOfWebElementsViaXpath = async ( argStringXpath ) => {

        let err = this.getErrorIfPageLoadNotWaitedFor()
        if ( err !== undefined ) { return err }
        //
        // Some xpaths have had issues during tests (ie //h1); make sure they're not used
        //
        err = this._getErrorIfXpathInvalid( argStringXpath )
        if ( err !== undefined ) { return err }

        return new Promise( async ( resolve ) => { resolve( await this.fieldPage.$x( argStringXpath ) ) } )
    }

    /**
     * @param {[]} argArrayOfElementHandles
     * @returns []
     * */
    _getArrayOfHelperElementHandlesFromArrayOfElementHandles = ( argArrayOfElementHandles ) => {
        const arrayToReturn = new Array( argArrayOfElementHandles.length )
        for ( let itemIndex = 0, intLength = argArrayOfElementHandles.length; itemIndex < intLength; itemIndex++ ) {
            arrayToReturn[ itemIndex ] = new HelperElementHandle( argArrayOfElementHandles[ itemIndex ], this.fieldPage, )
        }
        return arrayToReturn
    }
    //
    // Public - get - array
    //
    /**
     * @returns []
     * */
    getArrayOfStringsLinksText = async () => {
        const arrayOfHelperElementHandlesViaXpath = await this.getArrayOfHelperElementHandlesViaXpath( "//a[@href]" )
        const arrayToReturn = new Array( arrayOfHelperElementHandlesViaXpath.length )
        for ( let itemIndex = 0, intLength = arrayOfHelperElementHandlesViaXpath.length; itemIndex < intLength; itemIndex++ ) {
            arrayToReturn[ itemIndex ] = arrayOfHelperElementHandlesViaXpath[ itemIndex ].getStringText()
        }
        return Promise.all( arrayToReturn )
    }

    /**
     * @returns []
     * */
    getArrayOfStringsLinksUrl = async () => {
        const arrayOfHelperElementHandlesViaXpath = await this.getArrayOfHelperElementHandlesViaXpath( "//a[@href]" )
        const arrayToReturn = new Array( arrayOfHelperElementHandlesViaXpath.length )
        for ( let itemIndex = 0, intLength = arrayOfHelperElementHandlesViaXpath.length; itemIndex < intLength; itemIndex++ ) {
            arrayToReturn[ itemIndex ] = arrayOfHelperElementHandlesViaXpath[ itemIndex ].getStringUrl()
        }
        return Promise.all( arrayToReturn )
    }

    /**
     * @returns []
     * */
    getArrayOfStringsParagraphsText = async () => {
        const arrayOfHelperElementHandlesViaXpath = this.getArrayOfHelperElementHandlesViaXpath( "//p" )
        const arrayToReturn = new Array( arrayOfHelperElementHandlesViaXpath.length )
        for ( let itemIndex = 0, intLength = arrayOfHelperElementHandlesViaXpath.length; itemIndex < intLength; itemIndex++ ) {
            arrayToReturn[ itemIndex ] = arrayOfHelperElementHandlesViaXpath[ itemIndex ].getStringInnerText()
        }
        return Promise.all( arrayToReturn )
    }
    //
    // Public - get - getErrorIfPageLoadNotWaitedFor
    //
    /**
     * @returns { Error | undefined }
     * */
    getErrorIfPageLoadNotWaitedFor = () => {
        if ( !this.fieldBoolXpathLoaded ) {
            return helperErrors.raiseError(
                Error(
                    helperStrings.getStringByCombiningArray( [
                        "Page load not waited for.",
                        `this.fieldBoolXpathLoaded = ${this.fieldBoolXpathLoaded}`,
                        " "
                    ], "\n", )
                )
            )
        }
        return undefined
    }
    //
    // Public - get - getStringSourceForPage
    //
    /**
     * @returns string
     * */
    getStringSourceForPage = async () => {
        return new Promise(
            async ( resolve ) => {
                resolve( await this.fieldPage.content() )
            }
        ) }
    //
    // Public - get - getStringTitle
    //
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
        const arrayToReturn = await this.getArrayOfHelperElementHandlesViaXpath( "//title" )
        return arrayToReturn.length > 0 ? arrayToReturn[ 0 ].getStringInnerText() : undefined
    }
    //
    // Public - load
    //
    /**
     * @param {string} argStringPathFile
     * */
    setCookiesWithDataFromFile = async ( argStringPathFile ) => {
        await this.fieldPage.setCookie( helperFiles.getObjectFromFile( argStringPathFile ) )
    }
    //
    // Public - set
    //
    /**
     * @param {string} argStringUrl
     * @returns this
     * */
    setUrl = async ( argStringUrl ) => {
        this.fieldBoolXpathLoaded = false

        await helperPrinting.wrapperPrintMessage(
            `Setting url: ${argStringUrl}`,
            async () => {
                //
                // Setup the browser if its not already initialized
                //
                await this.setupBrowserIfUndefined()
                //
                // Load url and wait for dom to downloaded
                //
                await this.fieldPage.goto( argStringUrl, { waitUntil: "domcontentloaded" }, )
            },
        )
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
     * @param {string} argStringValue
     * @returns []
     *
     * The array contains web elements
     * */
    setValueForTextFieldAtXpath = async ( argStringXpath, argStringValue ) => {
        const arrayOfHelperElementHandlesViaXpath = await this.getArrayOfHelperElementHandlesViaXpath( argStringXpath )
        const arrayToReturn = new Array( arrayOfHelperElementHandlesViaXpath.length )
        for ( let itemIndex = 0, intLength = arrayOfHelperElementHandlesViaXpath.length; itemIndex < intLength; itemIndex++ ) {
            arrayToReturn[ itemIndex ] = arrayOfHelperElementHandlesViaXpath[ itemIndex ].setValueForTextField( argStringValue )
        }
        return Promise.all( arrayOfHelperElementHandlesViaXpath )
    }

    /**
     * @param {[]} argArrayOfPairsStringXpathsAndStringValues
     * */
    setValuesForFieldsAtXpathsViaArrayOfPairsAndSubmitForm = async ( argArrayOfPairsStringXpathsAndStringValues ) => {
        for ( let itemIndex = 0, intLength = argArrayOfPairsStringXpathsAndStringValues.length; itemIndex < intLength; itemIndex++ ) {
            await this.setValueForTextFieldAtXpath( ...argArrayOfPairsStringXpathsAndStringValues[ itemIndex ] )
        }
        await this.clickSubmitOnForm()
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
    // Public - wait
    //
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
     * @param {string} argStringPathFile
     * */
    writeCookiesForCurrentPageToFile = async ( argStringPathFile ) => {
        helperFiles.writeObjectToFile(
            argStringPathFile,
            await this.fieldPage.cookies(),
        )
    }

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
    // Private - get - _getErrorIfXpathInvalid
    //
    /**
     * Reminder: These are xpaths known to be invalid under all conditions
     * */
    static FIELD_SET_OF_KNOWN_INVALID_XPATHS =
        new Set( [
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
            return helperErrors.raiseError( Error( helperStrings.getStringByCombiningArray( [
                "argStringXpath is a known invalid value",
                `argStringXpath = ${argStringXpath}`,
                `HelperBrowserPuppeteer.SET_OF_KNOWN_INVALID_XPATHS = ${ 
                    this._getStringArrayPrintable( Array.from( HelperBrowserPuppeteer.FIELD_SET_OF_KNOWN_INVALID_XPATHS ).sort() ) 
                }`,
                `\n`,
            ], "\n", ) ) )
        }
        return undefined
    }

    /**
     * @param {number} argIntSecs
     * @returns number
     * */
    _getNumberSecsFromInt = ( argIntSecs ) => {
        // Example: 30000 equates to 30 seconds
        return argIntSecs * 1000
    }

    /**
     * @param {[]} argArrayOfStrings
     * @returns string
     * */
    _getStringArrayPrintable = ( argArrayOfStrings ) => {
        return argArrayOfStrings.length === 0
            ? `[]`
            : `[ ` + argArrayOfStrings.reduce( ( itemStringPrev, itemString ) => { return itemStringPrev + ", " + itemString } ) + ` ]`
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









































