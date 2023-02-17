//
// Public
//
export default class helperStrings {
    //
    // Public
    //
    /**
     * @param {string[]} argArrayOfStrings
     * @param {string} argStringDelimiter
     * */
    static getStringByCombiningArray = (
        argArrayOfStrings,
        argStringDelimiter = ""
    ) =>
        argArrayOfStrings.length === 0
            ? ""
            : argArrayOfStrings.reduce(
                  (itemPrev, item) =>
                      (typeof itemPrev === "symbol"
                          ? itemPrev.toString()
                          : `${itemPrev}`) +
                      argStringDelimiter +
                      (typeof item === "symbol" ? item.toString() : `${item}`)
              );

    /**
     * This function is a less efficient version of getStringFromArgViaEnumDataType()
     * It exists to functions with simpler overhead like getValueAtPath()
     *
     * Javascript's `${}` doesn't work in *all* cases, so this function is necessary to compensate.
     *
     * @param {any} arg
     * @returns string
     * */
    static getStringFromArg = (arg) =>
        typeof arg === "symbol" ? arg.toString() : `${arg}`;

    /**
     * @param {any[]} argIterable
     * @return string
     * */
    static getStringPrintableFromIterable = (argIterable) => {
        const arrayFromArg = Array.from(argIterable);
        return arrayFromArg.length === 0
            ? "[]"
            : `[ ${arrayFromArg.reduce(
                  (itemPrev, item) =>
                      (typeof itemPrev === "symbol"
                          ? itemPrev.toString()
                          : `${itemPrev}`) +
                      ", " +
                      (typeof item === "symbol" ? item.toString() : `${item}`)
              )} ]`;
    };
}
