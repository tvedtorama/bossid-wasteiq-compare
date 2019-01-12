
import { GraphQLObjectType, GraphQLFloat, GraphQLString, GraphQLInt } from "graphql";
import { TypedFieldConfigMap } from "../../utils/commonSchema/TypedFieldConfigMap";
import { commonFields } from "./flatIntervalTree";

export const flatOperatorTree = new GraphQLObjectType({
	name: "FlatOperatorTree",
	fields: () => (<TypedFieldConfigMap<SourceContracts.IFlatOperatorTree>>{
		...commonFields,
		count: {
			type: GraphQLInt,
		},
		operatorId: {
			type: GraphQLString,
		}
	})
})