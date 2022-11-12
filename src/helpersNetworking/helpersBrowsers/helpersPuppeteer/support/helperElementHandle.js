/*
Notes:
This class wraps puppeteer's ElementHandle class.

This exists to make data fetching and input entering viable despite forgetting
how the library works.

Source page:
https://pptr.dev/api/puppeteer.elementhandle/
*/
//
// Libraries - downloaded
//
import puppeteer, {
    //ElementHandle,
    //Page
} from "puppeteer";
//
// Public
//
export default class HelperElementHandle {
    //
    // Public
    //
    /***/
    click = async () => { await this.fieldElementHandle.click() }

    /**
     * @returns string
     * */
    getStringHref = async () => { return this.getStringValueAtAttribute( "href" ) }

    /**
     * @returns string
     * */
    getStringInnerText = async () => { return this.getStringValueAtAttribute( "innerText" ) }

    /**
     * @returns string
     * */
    getStringText = async () => { return this.getStringValueAtAttribute( "text" ) }

    /**
     * @param {string} argStringNameAttribute
     * @returns string
     * */
    getStringValueAtAttribute = async ( argStringNameAttribute ) => {
        return this.fieldPage.evaluate(
            ( ...argArrayOfArgs ) => {
                return argArrayOfArgs[ 0 ].getAttribute( argArrayOfArgs[ 1 ] )
            },
            this.fieldElementHandle,
            argStringNameAttribute,
        )
    }
    //
    // Public - set
    //
    /**
     * @param {string} argStringValue
     * */
    setValueForTextField = async ( argStringValue ) => {
        //
        // Reminder: The three-click count is necessary to highlight all the text to replace it.
        //
        await this.fieldElementHandle.click( { clickCount: 3 } )
        await this.fieldElementHandle.type( argStringValue )
    }
    //
    // Public - upload file
    // Reminder: Not sure which one works
    //
    /**
     * @param {string} argStringPathFile
     *
     * Source:
     * https://pptr.dev/api/puppeteer.filechooser
     * */
    uploadFile = async ( argStringPathFile ) => {
        await this.fieldPage.waitForFileChooser()
        await this.fieldElementHandle.accept( [ argStringPathFile ] )
    }

    /**
     * @param {string} argStringPathFile
     *
     * Source:
     * https://stackoverflow.com/questions/59273294/how-to-upload-file-with-js-puppeteer
     * */
    uploadFileOtherOption = async ( argStringPathFile ) => {
        await this.fieldPage.waitForFileChooser()
        this.fieldPage.evaluate(
            ( ...argArrayOfArgs ) => { argArrayOfArgs[ 0 ].uploadFile( argArrayOfArgs[ 1 ] ) },
            this.fieldElementHandle,
            argStringPathFile,
        )
    }
    //
    // Setup
    //
    /**
     * @param {ElementHandle} argElementHandle
     * @param {Page} argPage
     * */
    constructor( argElementHandle, argPage ) {

        this.fieldElementHandle = argElementHandle
        this.fieldPage = argPage
    }
}

























































