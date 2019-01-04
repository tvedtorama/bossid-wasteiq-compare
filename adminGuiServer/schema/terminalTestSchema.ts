import { GraphQLObjectType, GraphQLList, GraphQLFloat } from "graphql";
import { eventList } from "./eventList";
import { TypedFieldConfigMap } from "../../utils/commonSchema/TypedFieldConfigMap";

export const terminalTestSchema = new GraphQLObjectType({
	name: "TestSchema",
	fields: () => (<TypedFieldConfigMap<SourceContracts.ITerminalTest>>{
		containerEvents: {
			args: {
				x: {
					type: GraphQLFloat,
				}
			},
			type: new GraphQLList(eventList),
		}
	})
})