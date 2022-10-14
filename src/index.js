//
// Libraries - downloaded
//
import prettyPrinterForHumans from "pretty_printer_for_humans";
//
// Libraries - custom
//
import helperApp from "./helpersApp/helperApp.js";
import HelperBrowserSelenium from "./helpersNetworking/helpersBrowsers/helperBrowserSelenium.js";
import HelperBrowserPuppeteer from "./helpersNetworking/helpersBrowsers/helperBrowserPuppeteer.js";
import helperApiClientRest from "./helpersNetworking/helpersApiClients/helperApiClientRest.js";
import helperApiClientSoap from "./helpersNetworking/helpersApiClients/helperApiClientSoap.js";
import helperFiles from "./helpersDisk/helpersFiles/helperFiles.js";
import helperPaths from "./helpersDisk/helpersPaths/helperPaths.js";
import helperPathsProject from "./helpersDisk/helpersPaths/helperPathsProject.js";
import helperValidatorHtmlTags from "./helpersValidators/helperValidatorHtmlTags.js";
//
// Public
//
class helperExampleTasks {

    /***/
    static runApiRestRequest = async () => {

        const stringUrl = "http://localhost:8000/test403"

        const response = await helperApiClientRest.getResponse( {
            "method": "GET",
            "url": stringUrl,
        } )
        helperApiClientRest.printResponse( response )
    }

    /***/
    static runApiSoapRequest = async () => {

        console.log( "RAN: runApiSoapRequest()\n" )

        const stringUrl = "https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php"
        const stringXml = helperFiles.getStringFromFile( "data/examples/examplesInput/examplesInputSoap/zip-code-envelope.xml" )

        const stringUrlAction = "https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode"
        const objectHeaders = helperApiClientSoap.getObjectHeadersForSoapRequest( stringUrlAction )

        prettyPrinterForHumans.pprint(
            objectHeaders,
            {
                argStringNameToOutput: "objectHeaders",
                argStringTrailingSpace: "\n",
            }
        )

        const response = await helperApiClientSoap.getObjectResponseViaRequest(
            stringUrl,
            stringXml,
            objectHeaders,
        )
        helperApiClientSoap.printResponse( response )
    }

    /***/
    static runWebScrapePuppeteer = async () => {
        //
        // Defs
        //
        const stringUrl = "http://example.com"

        const stringXpath = "//div//h1"
        //
        // Validation
        //
        const err = helperValidatorHtmlTags.getErrorIfXpathDoesNotHaveOnlyStandardTasks( stringXpath )
        if ( err !== undefined ) { console.log( err ) }
        //
        // Web scrape
        //
        const helperBrowserPuppeteer = new HelperBrowserPuppeteer()

        const result = await helperBrowserPuppeteer.getArrayOfStringsViaXpath(
            stringUrl,
            stringXpath,
            ( ...arrayOfWebElements ) => arrayOfWebElements.map( itemWebElement => itemWebElement.innerText ),
        )
        //
        // Output
        //
        prettyPrinterForHumans.pprint(
            result,
            {
                argStringNameToOutput: "result (runCodeExternal)",
                argStringTrailingSpace: "\n",
            },
        )
    }

    /**
     * WARNING: Right now, the available driver is incompatible with current chrome
     * */
    static runWebScrapeSelenium = async () => {

        const stringUrl = "http://example.com"

        const stringXpath = "//div//h1"

        const helperBrowserSelenium = new HelperBrowserSelenium({})

        await helperBrowserSelenium.loadUrl( stringUrl )

        const arrayOfStringsLinks = helperBrowserSelenium.getArrayOfStringsLinks()

        prettyPrinterForHumans.pprint(
            arrayOfStringsLinks,
            {
                argStringNameToOutput: "arrayOfStringsLinks",
                argStringTrailingSpace: "\n",
            }
        )

    }

    /***/
    static runSubmitFormPuppeteer = async () => {

        const helperBrowserPuppeteer = new HelperBrowserPuppeteer()

        await helperBrowserPuppeteer.setUrl( "http://127.0.0.1:8080/testForm" )

        await helperBrowserPuppeteer.setValueForFieldsAtXpathsAndSubmitForm( {
            "//input" : "TEST_VALUES"
        } )
    }
}

const main = async () => {
    helperApp.printAppStart()

    //await helperExampleTasks.runApiRestRequest()
    //await helperExampleTasks.runApiSoapRequest()

    //await helperExampleTasks.runWebScrapePuppeteer()
    //await helperExampleTasks.runWebScrapeSelenium()

    //await helperExampleTasks.runSubmitFormPuppeteer()
}
main().then( () => helperApp.exitApp() )












































