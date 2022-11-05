export default class helperStrings {

    /**
     * @param {[]} argArrayOfStrings
     * @param {string} argStringDelimiter
     * */
    static getStringByCombiningArray = ( argArrayOfStrings, argStringDelimiter = "" ) => {
        if ( argArrayOfStrings.length === 0 ) { return "" }
        return argArrayOfStrings.reduce( ( itemStringPrev, itemString ) => itemStringPrev + argStringDelimiter + itemString )
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
    static getStringFromArg = (arg) => {
        switch (typeof arg) {
            //
            // Reminder: symbols do *not* support `${}`
            //
            case "symbol": return arg.toString();
            default: return `${arg}`;
        }
    };

    /**
     * @param {[]} argIterable
     * @return string
     * */
    static getStringPrintableFromIterable = (argIterable) => {
        const arrayFromArg = Array.from(argIterable);
        if (arrayFromArg.length === 0) { return "[]"; }
        const arrayToReturn = new Array(arrayFromArg.length);
        for ( let itemIntIndex = 0, intLength = arrayFromArg.length; itemIntIndex < intLength; itemIntIndex++ ) {
            arrayToReturn[itemIntIndex] = helperStrings.getStringFromArg( arrayFromArg[itemIntIndex] );
        }
        return `[ ${arrayToReturn.reduce( (itemStringPrev, itemString) => itemStringPrev + ", " + itemString )} ]`;
    };
}













































