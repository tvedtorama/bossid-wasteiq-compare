import { GraphQLObjectType, GraphQLFloat, GraphQLString } from "graphql";
import { TypedFieldConfigMap } from "../../utils/commonSchema/TypedFieldConfigMap";

export const eventList = new GraphQLObjectType({
	name: "EventList",
	fields: () => (<TypedFieldConfigMap<SourceContracts.IEventBase>>{
		timestampIso: {
			type: GraphQLString,
		},
		type: {
			type: GraphQLString,
		},
		fraction: {
			type: GraphQLString,
		}
	})
})