/*
To get this module working, install the following packages

# Enables raw api calls
# https://axios-http.com/docs/intro
npm i axios

# Enables actual soap requests
# https://www.npmjs.com/package/easy-soap-request
npm i easy-soap-request
*/
//
// Libraries - downloaded
//
import axios from "axios";
import fs from "fs";
import prettyPrinterForHumans from "pretty_printer_for_humans";
import soapRequest from "easy-soap-request";
//
// Libraries - custom
//
import helperDataXml from "../../helpersData/helperDataXml.js";
//
// Public
//
export default class helperApiClientSoap {
    //
    // Public - get
    //
    /**
     * @param {string} argStringUrl
     * @param {string} argStringXmlPayload
     * */
    static getWsoExample = async (argStringUrl, argStringXmlPayload) => {
        /*
        Example url and payload:
        http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso

        <?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <CountryIntPhoneCode xmlns="http://www.oorsprong.org/websamples.countryinfo">
                    <sCountryISOCode>IN</sCountryISOCode>
                </CountryIntPhoneCode>
            </soap:Body>
        </soap:Envelope>
        */
        const stringContentType = "text/xml; charset=utf-8";

        console.log(
            `Sending (${stringContentType})-style axios request to url: ${argStringUrl}...`
        );
        let response = await axios({
            data: argStringXmlPayload,
            headers: { "Content-Type": stringContentType },
            method: "POST",
            timeout: helperApiClientSoap._getIntSeconds(1),
            url: argStringUrl,
            validateStatus: (status) => true,
        });
        console.log(
            `Sending (${stringContentType})-style axios request to url: ${argStringUrl}...DONE\n`
        );
        return response;
    };

    /**
     * @param {string} argStringUrl
     * @param {string} argStringXmlForRequest
     * @param {Object} argObjectHeaders
     * */
    static getObjectResponseViaRequest = async (
        argStringUrl,
        argStringXmlForRequest,
        argObjectHeaders
    ) => {
        /*
        Response has at least the following major attributes:
        response.headers
        response.body
        response.statusCode

        Example url and xml for request:
        https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php

        <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ndf="https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl">
           <soapenv:Header/>
           <soapenv:Body>
              <ndf:LatLonListZipCode soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                 <zipCodeList xsi:type="dwml:zipCodeListType" xmlns:dwml="https://graphical.weather.gov/xml/DWMLgen/schema/DWML.xsd">75001</zipCodeList>
              </ndf:LatLonListZipCode>
           </soapenv:Body>
        </soapenv:Envelope>
        */
        console.log(`Sending soap request to url: ${argStringUrl}...`);
        //
        // Reminder: The object returned by soapRequest() is actually a wrapper for the actual response
        // This is the returned object's only attribute (verified via Object.keys())
        // Just unpack it before returning it
        //
        const { response } = await soapRequest({
            headers: argObjectHeaders,
            timeout: helperApiClientSoap._getIntSeconds(1),
            url: argStringUrl,
            xml: argStringXmlForRequest,
        });
        console.log(`Sending soap request to url: ${argStringUrl}...DONE\n`);
        return response;
    };

    /**
     * @param {Object} argResponse
     * */
    static getIntResponseCodeFromResponse = (argResponse) =>
        argResponse.statusCode;

    /**
     * @param {string} argStringPathFileXml
     * @returns Object
     * */
    static getObjectDataFromFileXML = (argStringPathFileXml) =>
        helperDataXml.getObjectFromXml(
            fs.readFileSync(argStringPathFileXml, "utf-8")
        );

    /**
     * @param {Object} argObjectResponse
     * */
    static getObjectDataFromResponse = (argObjectResponse) =>
        helperDataXml.getObjectFromXml(argObjectResponse.body);

    /**
     * @param {string} argStringUrlSoapAction
     * @returns Object
     * */
    static getObjectHeadersForSoapRequest = (argStringUrlSoapAction) => ({
        "Content-Type": "text/xml;charset=UTF-8",
        soapAction: argStringUrlSoapAction,
        "user-agent": "sampleTest",
    });

    /**
     * @param {Object} argObjectResponse
     * */
    static getStringXmlDataFromResponse = (argObjectResponse) =>
        argObjectResponse.body;
    //
    // Public - print
    //
    /**
     * This func intentionally prints the status code last so its always visible by the time everything
     * finishes printing.
     *
     * @param {Object} argResponse
     * @param {number} argIntDepthToPrint
     *
     * Default the print depth to 3 since the response bodies test to be pretty wordy
     * */
    static printResponse = (argResponse, argIntDepthToPrint = 3) => {
        //
        // Reminder: 'headers' is also a key available in argResponse
        //
        let { body, statusCode } = argResponse;
        prettyPrinterForHumans.pprint(helperDataXml.getObjectFromXml(body), {
            argStringNameToOutput: "body",
            argIntDepthToPrint: argIntDepthToPrint,
        });
        console.log(`statusCode = ${statusCode}\n`);
    };

    /**
     * @param {number} argIntSecs
     * */
    static _getIntSeconds = (argIntSecs) => argIntSecs * 1000;
}
