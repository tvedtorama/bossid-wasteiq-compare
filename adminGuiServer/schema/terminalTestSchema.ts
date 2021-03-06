import { GraphQLObjectType, GraphQLList, GraphQLFloat } from "graphql";
import { eventList } from "./eventList";
import { TypedFieldConfigMap } from "../../utils/commonSchema/TypedFieldConfigMap";
import { flatIntervalTree } from "./flatIntervalTree";
import { flatOperatorTree } from "./flatOperatorTree";

export const terminalTestSchema = new GraphQLObjectType({
	name: "TestSchema",
	fields: () => (<TypedFieldConfigMap<SourceContracts.ITerminalTest>>{
		containerEvents: {
			type: new GraphQLList(eventList),
		},
		intervalTree: {
			type: new GraphQLList(flatIntervalTree),
		},
		valveOperatorCount: {
			type: new GraphQLList(flatOperatorTree)
		}
	})
})