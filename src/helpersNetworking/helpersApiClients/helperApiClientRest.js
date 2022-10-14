/*
npm i axios

Reminder: Merging objects...

objectNew = {
    ...objectOne,
    ...objectTwo,
}
*/
//
// Libraries - downloaded
//
import axios from "axios"
//
// Libraries - custom
//
import helperCopying from "../../helpersCopying/helperCopying.js";
import helperTime from "../../helpersTime/helperTime.js";
import prettyPrinterForHumans from "pretty_printer_for_humans";
//
// Public
//
export default class helperApiClientRest {
    //
    // Public - get
    //
    /**
     * This function will never throw an error
     * It defaults to a 1 sec timeout
     *
     * @param {Object} argObjectAxiosRequestConfig
     * @returns any
     * */
    static async getResponse( argObjectAxiosRequestConfig ) {
        //
        // Create a copy of the incoming config; this we way avoid changing the argument
        //
        const objectAxiosRequestConfig = helperCopying.getCopy( argObjectAxiosRequestConfig )
        //
        // Set timeout
        //
        if ( objectAxiosRequestConfig.timeout === undefined ) { objectAxiosRequestConfig.timeout = helperTime.getIntSeconds( 1 ) }
        //
        // Setup axios so it never throws an error
        //
        if ( objectAxiosRequestConfig.validateStatus === undefined ) { objectAxiosRequestConfig.validateStatus = ( status ) => true }
        //
        // Run request
        //
        console.log( `Getting REST response from url: ${objectAxiosRequestConfig.url}...` )
        let response
        try {
            response = await axios( objectAxiosRequestConfig )
        } catch ( err ) {
            console.log( [
                "Error occurred, likely due to being unable to connect to target.",
                "REMINDER: The default config for web analyzer, errors do *not* trigger on >400 error codes.",
                " ",
            ].reduce( ( itemStringPrev, itemString ) => itemStringPrev + "\n" + itemString ) )

            // Kill the app before axios / nodejs has a chance to dump an insane amount of text to screen
            // Comment this out if you actually want to see it
            process.exit( 1 )
        }
        console.log( `Getting REST response from url: ${objectAxiosRequestConfig.url}...DONE\n` )
        return response
    }

    /**
     * If necessary, merge this with an existing config
     *
     * @returns Object
     * */
    static getObjectSettingHeaderContentType = () => { return { "Content-type": "application/json; charset=utf-8" } }

    /**
     * @param {Object} argResponse
     * */
    static printResponse = ( argResponse ) => {

        prettyPrinterForHumans.pprint(
            argResponse,
            {
                argStringNameToOutput: "argResponse",
                argStringTrailingSpace: "\n",
                argIntDepthToPrint: 2,
            }
        )

        const { status } = argResponse

        console.log( `status = ${status}` )

    }
}














































