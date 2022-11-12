//
// Public
//
export default class helperStrings {
    //
    // Public
    //
    /**
     * @param {[]} argArrayOfStrings
     * @param {string} argStringDelimiter
     * */
    static getStringByCombiningArray = ( argArrayOfStrings, argStringDelimiter = "" ) => {
        return argArrayOfStrings.length === 0
            ? ""
            : argArrayOfStrings.reduce(
                ( itemPrev, item ) => {
                    const itemStringPrev = typeof itemPrev === "symbol" ? itemPrev.toString() : `${itemPrev}`
                    const itemString = typeof item === "symbol" ? item.toString() : `${item}`
                    return itemStringPrev + argStringDelimiter + itemString
                } )
    }

    /**
     * This function is a less efficient version of getStringFromArgViaEnumDataType()
     * It exists to functions with simpler overhead like getValueAtPath()
     *
     * Javascript's `${}` doesn't work in *all* cases, so this function is necessary to compensate.
     *
     * @param {any} arg
     * @returns string
     * */
    static getStringFromArg = ( arg ) => { return typeof arg === "symbol" ? arg.toString() : `${arg}` };

    /**
     * @param {[]} argIterable
     * @return string
     * */
    static getStringPrintableFromIterable = (argIterable) => {

        const arrayFromArg = Array.from( argIterable )
        if ( arrayFromArg.length === 0 ) { return "[]" }

        return `[ ${arrayFromArg.reduce( 
            ( itemPrev, item ) => {
                const itemStringPrev = typeof itemPrev === "symbol" ? itemPrev.toString() : `${itemPrev}`
                const itemString = typeof item === "symbol" ? item.toString() : `${item}`
                return itemStringPrev + ", " + itemString 
            } 
        )} ]`
    };
}













































