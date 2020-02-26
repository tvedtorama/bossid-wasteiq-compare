import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { IRootValueRoot } from "./IRootValue";
import { terminalTestSchema } from "./terminalTestSchema";
import { TypedArgConfigMap } from "../../utils/commonSchema/TypedFieldConfigMap";
import { getWasteIQDriver, getBossIdDriver } from "../drivers";

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
							resolve: (store: ApiSupportSchema.ICoreStore, _1, _2, {rootValue}) => getWasteIQDriver()(store.getArgs(), rootValue),
						},
						wasteIQSecondary: {
							type: terminalTestSchema,
							resolve: (store: ApiSupportSchema.ICoreStore, _1, _2, {rootValue}) => getWasteIQDriver("SECONDARY")(store.getArgs(), rootValue),
						},
						bossID: {
							type: terminalTestSchema,
							resolve: (store: ApiSupportSchema.ICoreStore) => getBossIdDriver()(store.getArgs()),
						}
					})
				}),
				resolve: (_1, args: ApiSupportSchema.IStoreArgs, _3, {rootValue: {dataAccess}}: IRootValueRoot) => dataAccess.store(args)
			}
		})
	})
})
