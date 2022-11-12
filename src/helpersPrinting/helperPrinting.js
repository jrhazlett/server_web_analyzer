//
// Public
//
export default class helperPrinting {
    //
    // Public
    //
    /**
     * @param {string} argStringMessage
     * @param {Function} argCallback
     * */
    static wrapperPrintMessage = async ( argStringMessage, argCallback ) => {

        const stringMessage = helperPrinting._getStringByCombiningArray( [ argStringMessage, "...", ] )
        //
        // Print start
        //
        console.log( helperPrinting._getStringByCombiningArray( [ stringMessage, "\n", ] ) )
        //
        // Run callback
        //
        const resultToReturn = await argCallback()
        //
        // Print conclusion
        //
        console.log( helperPrinting._getStringByCombiningArray( [ stringMessage, "DONE\n", ] ) )
        //
        // Return the callback
        //
        return resultToReturn
    }

    /**
     * @param {[]} argArrayOfStrings
     * @param {string} argStringDelimiter
     * */
    static _getStringByCombiningArray = ( argArrayOfStrings, argStringDelimiter = "" ) => {
        return argArrayOfStrings.length === 0
            ? ""
            : argArrayOfStrings.reduce(
                ( itemPrev, item ) => {

                    const itemStringPrev = typeof itemPrev === "symbol" ? itemPrev.toString() : `${itemPrev}`
                    const itemString = typeof item === "symbol" ? item.toString() : `${item}`
                    return itemStringPrev + argStringDelimiter + itemString
                }
            )
    }
}


















































