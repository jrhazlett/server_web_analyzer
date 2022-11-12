/*
# Provides xml-to-object conversions
# https://www.npmjs.com/package/xml-js
npm i xml-js
*/
//
// Libraries - downloaded
//
import { xml2js } from "xml-js";
//
// Public
//
export default class helperDataXml {
    //
    // Public
    //
    /**
     * @param {string} argStringXml
     * */
    static getObjectFromXml = ( argStringXml ) => { return xml2js( argStringXml ) }
}





















































