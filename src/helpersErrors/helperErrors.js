//
// Class
//
class HelpersErrors {
    //
    // Public
    //
    /**
     * @param {Error} argError
     * @returns Error
     * */
    raiseError = ( argError ) => {
        if ( this.fieldBoolHaltAppOnError ) {
            console.log( argError )
            process.exit( 1 )
        }
        return argError
    }
    //
    // Setup
    //
    constructor() {
        this.fieldBoolHaltAppOnError = false
    }
}
//
// Public
//
let helperErrors
export default helperErrors = new HelpersErrors()

















































