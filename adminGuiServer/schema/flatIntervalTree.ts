import { GraphQLObjectType, GraphQLFloat, GraphQLString } from "graphql";
import { TypedFieldConfigMap } from "../../utils/commonSchema/TypedFieldConfigMap";

export const commonFields: TypedFieldConfigMap<SourceContracts.ITreeCommon> = {
	containerTimestampIso: {
		type: GraphQLString,
	},
	containerTag: {
		type: GraphQLString,
	},
	valveTimestampIso: {
		type: GraphQLString,
	},
	valveBossIdId: {
		type: GraphQLString,
	},
}


export const flatIntervalTree = new GraphQLObjectType({
	name: "FlatIntervalTree",
	fields: () => (<TypedFieldConfigMap<SourceContracts.IFlatIntervalTree>>{
		...commonFields,
		customerEventTimestampIso: {
			type: GraphQLString,
		},
		customerEventOperatorId: {
			type: GraphQLString,
		},
		customerEventIdentityIdentifier: {
			type: GraphQLString,
		},
		customerEventAgreementGuid: {
			type: GraphQLString,
		},
		customerEventValue: {
			type: GraphQLString,
		},
		fractionCode: {
			type: GraphQLString,
		},
		operationMode: {
			type: GraphQLString,
		}
	})
})