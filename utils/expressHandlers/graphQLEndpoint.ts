import { GraphQLSchema, GraphQLObjectType } from "graphql";
import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import { jwtCheck } from "../security/jwt";

const multer = require('multer')
const graphQlUploads = multer()

type IGraphQlReqType = express.Request & {files: any[], logs: {logs: any[]}}

const commonRootValue = (req: IGraphQlReqType) => (<Pick<ApiSupportSchema.ICommonRootValue, "getFiles" | "getLogs">>{
	getFiles: () => req.files || [],
	getLogs: () => req.body.logs ? JSON.parse(req.body.logs) : [],
})

export const setupGraphQLEndpoint = function<TRootValue extends ApiSupportSchema.ICommonRootValue & {dataAccess: TDataAccess}, TDataAccess>(apiUrlPath: string, schema: GraphQLSchema, dataAccess: () => TDataAccess, router: express.Router) {
	// Warning: We will accept any file upload, regardless of the jwt - should attempt to fetch the jwt first?
	// Warning: We are using memory buffers for file upload, which will quickly break.
	// TODO: move the token to the headers, and then verify it first - then **stream** the files directly
	//   to backend (restdb) storage, returning only the key on the req object.
	router.use(apiUrlPath, graphQlUploads.any(), (req, res, next) => {
		next()
	})

	router.use(apiUrlPath, jwtCheck, (req, res, next) => {
		next()
	})

	router.use(apiUrlPath, graphqlHTTP((req: IGraphQlReqType, res) =>
		(<graphqlHTTP.OptionsResult>{
			schema,
			graphiql: true,
			rootValue: <TRootValue>{
				user: req.user,
				dataAccess: dataAccess(),
				getCookieValue: ((key) => req.cookies[key]),
				setCookieValue: ((key, value) => res.cookie(key, value)),
				...<any>commonRootValue(req),  // No idea why this <any> cast is required here - type should be just fine, might be issue with generics functions.
			},
		})))
}

/** Creates a serviceInfo endpoint for querying the name and version of the API.  Will not work great in a service swarm, as all will have the same endpoint address */
export const setupServiceInfoGraphQLEndpoint = (serviceInfo: GraphQLObjectType, router: express.Router) =>
	router.use("/serviceInfo", graphqlHTTP((req: IGraphQlReqType, res) =>
	(<graphqlHTTP.OptionsResult>{
		schema: new GraphQLSchema({
			query: new GraphQLObjectType({
				name: "serviceInfoRoot",
				fields: () => ({
					serviceInfo: {
						type: serviceInfo,
						resolve: () => ({})
					}
				})
			})
		}),
		graphiql: true,
	})))
