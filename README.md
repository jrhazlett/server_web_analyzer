--WORK IN PROGRESS--
--WORK IN PROGRESS--
--WORK IN PROGRESS--
--WORK IN PROGRESS--
# Server web analyzer

This is a sort of 'toolkit' client which supports multiple api interaction types. Its definitely
not meant to be a self-running npm package, but is instead meant to provide an established framework
which can provide a generally stable-ish 'out of the box' execution without significant changes.

The general thought process is: I personally jump between languages a lot, and javascript / nodejs
has been the key language lately. These wrappers are generally here to provide working examples,
settings which avoid the pitfalls (from an outsider's perspective) of each library's default config.

## Updates

### 02/19/23

- Removed selenium since its mostly redundant to puppeteer and doesn't reliably stays 'aligned' with
web driver versions.
- Reworked to accommodate upgraded puppeteer library.
- Fixed bad function calls.
- Streamlined the puppeteer code to do more with less.
- Re-added curly braces to functions to support inserting debugging code if necessary.
- Updated type notations for functions, so they match other repos / libraries.

## Files

src/index.js: This contains examples of how to run the corresponding wrappers.

## Libraries

## axios

Wrapper: src/helpersNetworking/helpersApiClients/helperApiClientRest.js

### Notes

-   Doesn't throw errors on >=400 codes
-   Includes common headers as callable functions (will likely update these as needed)

## express

Wrapper: src/helpersNetworking/helpersServers/helperServerExpress.js

## puppeteer

Wrapper: src/helpersNetworking/helpersBrowsers/helperBrowserPuppeteer.js

### Notes

-   This has validation which checks for xpaths that caused issues during execution
-   Checks for tag misspellings

## selenium (NOTE: As of right now, the available driver version is incompatible with the latest chrome)

src/helpersNetworking/helpersBrowsers/helperBrowserSelenium.js

## soap

Wrapper: src/helpersNetworking/helpersApiClients/helperApiClientSoap.js

### Notes

-   Includes example soap calls
-   Includes example xml packages

    --WORK IN PROGRESS--
- --WORK IN PROGRESS--
- --WORK IN PROGRESS--
