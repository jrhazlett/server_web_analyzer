//
// Class
//
class HelpersErrors {
    //
    // Public
    //
    /**
     * @param {Error} argError
     * @returns {Error}
     * */
    raiseError = (argError) => {
        if (this.fieldBoolHaltAppOnError) {
            throw argError;
        }
        return argError;
    };
    //
    // Setup
    //
    /***/
    constructor() {
        this.fieldBoolHaltAppOnError = false;
    }
}
//
// Public
//
let helperErrors;
export default helperErrors = new HelpersErrors();
