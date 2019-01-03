import * as express from 'express'
import {join} from 'path'
import * as bodyParser from 'body-parser'

const bodyParserLimit = process.env.BODY_PARSER_LIMIT || "50mb"

export const expressSetup = (app: express.Express, router: express.Router, setupLogs = true) => {
	const appRoot = join(__dirname, "../../../")
	console.log("CurDir and appRoot: ", __dirname, appRoot)
	app.use("/static", express.static(appRoot + "dist"));
	app.use("/static", express.static(appRoot + "public/dist"));
	app.use("/img", express.static(appRoot + "public/img"));
	app.use("/doc", express.static(appRoot + "public/doc"));
	app.use("/bootstrap", express.static(appRoot + "node_modules/bootstrap"))

	// Notes on limit: https://stackoverflow.com/questions/19917401/error-request-entity-too-large
	app.use(bodyParser.json({limit: bodyParserLimit}));
	app.use(bodyParser.urlencoded({limit: bodyParserLimit, extended: true, parameterLimit: 50000}));

	app.use('/', router)

	console.log('start')
}