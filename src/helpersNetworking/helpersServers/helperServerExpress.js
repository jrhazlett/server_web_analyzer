/*
npm i express
*/
//
// Libraries - downloaded
//
import express from "express"
//
// Globals
//
class enumRestMethods {

    static methodDelete = "delete"
    static methodGet = "get"
    static methodPost = "post"
    static methodPut = "put"
}
//
// Public
//
export default class HelperServerExpress {
    //
    // Public
    //
    static fieldEnumRestMethods = enumRestMethods
    //
    // Public - add
    //
    /**
     * @param {string} argEnumRestMethod
     * @param {string} argStringRoute
     * @param {Function} argCallbackWithReqAndRes
     * @returns Error | null
     * */
    addCallbackToRouter( argEnumRestMethod, argStringRoute, argCallbackWithReqAndRes ) {

        console.log( `Setting command: ${argEnumRestMethod} for route: ${argStringRoute}...` )

        const arrayOfStringKeys = Object.keys( this.fieldServer )
        if ( arrayOfStringKeys.includes( argEnumRestMethod ) ) {

            this.fieldServer[ argEnumRestMethod ](
                argStringRoute,
                ( req, res ) => argCallbackWithReqAndRes( req, res )
            )
            return null

        } else { return Error( `Failed to set command: ${argEnumRestMethod} for route: ${argStringRoute}` ) }

    }

    //
    // Public - run
    //
    /**
     * @returns this
     * */
    runServer() {
        this.fieldServer.listen(
            this.fieldIntPort,
            () => console.log( `Server listening on port: ${this.fieldIntPort}` ),
        )
        return this
    }
    //
    // Public - set
    //
    /**
     * This can be set at any time before running the server
     *
     * @param {number} argIntPort
     * @returns this
     * */
    setPort( argIntPort ) {
        this.fieldIntPort = argIntPort
        return this
    }
    //
    // Setup
    //
    constructor() {
        this.fieldIntPort = 8001
        this.fieldServer = express()
    }
}





















/*
    addCallbackToRouter( argEnumRestType: string, argStringRoute: string, argCallbackWithReqAndRes: Function ): null | Error {

        console.log( `Setting ${argEnumRestType} for route: ${argStringRoute}...` )

        this.fieldServer[ argEnumRestType ](
            argStringRoute,
            ( req: Request, res: Response ) => argCallbackWithReqAndRes( req, res )
        )

        switch ( argEnumRestType ) {

            case enumRestTypes.typeDelete:

                this.fieldServer.delete(
                    argStringRoute,
                    ( req, res ) => argCallbackWithReqAndRes( req, res )
                )
                return null

            case enumRestTypes.typeGet:

                this.fieldServer.get(
                    argStringRoute,
                    ( req, res ) => argCallbackWithReqAndRes( req, res )
                )
                return null

            case enumRestTypes.typePost:

                this.fieldServer.post(
                    argStringRoute,
                    ( req, res ) => argCallbackWithReqAndRes( req, res )
                )
                return null

            case enumRestTypes.typePut:

                this.fieldServer.put(
                    argStringRoute,
                    ( req, res ) => argCallbackWithReqAndRes( req, res, )
                )
                return null

            default: return Error( `Failed to set ${argEnumRestType} comment for route: ${argStringRoute}` )

        }

    }
*/


























