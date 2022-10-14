//
// Libraries - downloaded
//
import fs from 'fs'
//
// Public
//
export default class helperDocker {
    //
    // Public - logic
    //
    static logicIsRunningInDocker = () => fs.existsSync( "/.dockerenv" )

}
















































