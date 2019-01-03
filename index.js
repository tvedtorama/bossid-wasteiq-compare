require('dotenv').config()

const express = require('express')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const path = require('path')
const fs = require('fs')

const {ArgumentParser} = require('argparse');
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
});
parser.addArgument(
	[ '-w', '--webpack' ],
	{
		help: 'Build and refresh webpack bundle',
		action: "storeTrue",
		nargs: 0,
	});
	
	
const args = parser.parseArgs()
		
const app = express()

const serverApp = process.env["serverApp"] || "adminGUIServer"

app.disable('x-powered-by');
const viewsRootPath = fs.existsSync(path.join(__dirname, '/views')) ? path.join(__dirname, '/views') : path.join(__dirname, `/${serverApp}/views`)
app.engine('handlebars', exphbs({ 
	defaultLayout: 'main',
	layoutsDir: path.join(viewsRootPath, `/layouts`),
	partialsDir: viewsRootPath,
}))
app.set('view engine', 'handlebars')
app.set('views', viewsRootPath);
app.use(cookieParser())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


if (args["webpack"]) {
	var config = require('./webpack.config')(process.env);
	var webpack = require('webpack');
	var webpackMiddleware = require("webpack-dev-middleware");

	var compiler = webpack(config)

	app.use(webpackMiddleware(compiler, {
		publicPath: config.output.publicPath,
		hot: true,
		historyApiFallback: true,
	}))

	app.use(require("webpack-hot-middleware")(compiler));
}

const main = require(`./build/${serverApp}/main`)

// Tried to make an IMain for this, to use in the implementation - but it turned out to be virtually impossible to find a referenceable type for app.
main.default(app)

const port = parseInt(process.env["port"] || "3000")

app.listen(port, function (err, result) {
	if (err) {
	return console.log(err);
	}

	console.log(`Listening at http://*:${port}/`);
});	

