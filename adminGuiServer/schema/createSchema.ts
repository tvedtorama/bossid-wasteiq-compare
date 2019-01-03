import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { IRootValueRoot } from "./IRootValue";

export const createSchema = () => new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: () => ({
			store: {
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
					})
				}),
				resolve: (_1, _2, _3, {rootValue: {dataAccess}}: IRootValueRoot) => dataAccess.store()
			}
		})
	})
})
