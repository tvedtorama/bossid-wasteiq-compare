import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { IRootValueRoot } from "./IRootValue";
import { terminalTestSchema } from "./terminalTestSchema";
import { TypedArgConfigMap } from "../../utils/commonSchema/TypedFieldConfigMap";

const dummyImpl = (args: ApiSupportSchema.IStoreArgs) => (<SourceContracts.ITerminalTest>{
	containerEvents: async () => [
			{
				fraction: "10",
				timestampIso: new Date(Date.parse(args.startTimeIso) + 3600 * 1000).toISOString(),
				type: "EMPTY",
				pointReference: "abc123",
			}
		]
})


export const createSchema = () => new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: () => ({
			store: {
				args: <TypedArgConfigMap<ApiSupportSchema.IStoreArgs>>{
					rootId: {type: GraphQLString},
					startTimeIso: {type: GraphQLString},
					endTimeIso: {type: GraphQLString},
				},
				type: new GraphQLObjectType({
					name: 'Store',
					fields: () => ({
						user: {
							type: new GraphQLObjectType({
								name: "user",
								fields: () => ({
									name: {
										type: GraphQLString,
									}
								})
							})
						},
						wasteIQ: {
							type: terminalTestSchema,
							resolve: (store: ApiSupportSchema.ICoreStore) => dummyImpl(store.getArgs()),
						},
						bossID: {
							type: terminalTestSchema,
							resolve: (store: ApiSupportSchema.ICoreStore) => dummyImpl(store.getArgs()),
						}
					})
				}),
				resolve: (_1, args: ApiSupportSchema.IStoreArgs, _3, {rootValue: {dataAccess}}: IRootValueRoot) => dataAccess.store(args)
			}
		})
	})
})
