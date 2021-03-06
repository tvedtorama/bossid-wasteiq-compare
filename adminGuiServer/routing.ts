import * as express from 'express'
import { setupGraphQLEndpoint } from '../utils/expressHandlers/graphQLEndpoint';
import { createCommonDataAccess, createTheStore } from '../utils/loaders';
import { createSchema } from './schema/createSchema';

export const router = express.Router()

const getLang = (req) => (req.headers['accept-language'] || '').indexOf('nb') === 0 ? 'no' : 'en'

const renderMain = (req: express.Request, res: express.Response, initialState = {}) =>
	res.render('home', {
		title: "Admin GUI",
		html: '<div class="loading-root" ></div>',
		initialState: JSON.stringify({
				lang: getLang(req),
				...initialState
			})
})

const CHAT_USER_COOKIE = "admin-gui-user"
const CHAT_USER_SET_COOKIE = "getCTUser"

const askBrowserNotToCache = (res: express.Response) => {
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
	res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
	res.setHeader("Expires", "0"); // Proxies.
}

const setCookie = (newIdentity: string, res: express.Response) => {
	res.cookie(CHAT_USER_COOKIE, newIdentity, { httpOnly: true }) // Note: Should also be secure: true - hijacking this cookie will enable other users to see the chat
	res.cookie(CHAT_USER_SET_COOKIE, "yes")
}

router.use(/\/(someDefaultRoute|someOtherRoute)?$/, async (req, res: express.Response) => {
	const jwt = null // Very confusing, as this is currently set in the GUI after the cookie.  await signJwt("CTF", identity)
	renderMain(req, res, {jwt})
})

const apiUrlPath = "/comparegraphql"
const schema = createSchema()

export const dataAccess = () => <ApiSupportSchema.ISchemaArgs>
	createCommonDataAccess(
		args => createTheStore(args),
		dbInfoPromise => ({}),
	)

setupGraphQLEndpoint(apiUrlPath, schema, dataAccess, router)
