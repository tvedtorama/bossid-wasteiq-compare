import {default as Axios} from 'axios'

import { signJwt } from "../../utils/security/jwt";
import { IRootValue } from "../schema/IRootValue";
import { flatten, sortByCompare } from '../../utils/arrays';

const url = process.env.GRAPHQL_URL || "http://127.0.0.1:3000/publicgraphql"

const callIt = async (graphQlQuery: string, args: ApiSupportSchema.IStoreArgs, rootValue: IRootValue): Promise<{store: any}> => {
	const variables = args
			// WARNING: assumes the two systems audience and secure keys are the same
			const token = await signJwt(rootValue.user.sub, rootValue.user.sub)
	try {
		const result = await Axios.post(url, {
			query: graphQlQuery,
			token,
			variables,
		})
		if (result.status !== 200)
			throw new Error(`Invalid status ${result.status} ${result.statusText}`)
		// console.log("result", result.data.data)
		return result.data.data
	} catch (err) {
		console.error("Error calling graphQL", err)
		throw err
	}
}


export const createWasteIQDriver = () =>
	(args: ApiSupportSchema.IStoreArgs, rootValue: IRootValue) => <SourceContracts.ITerminalTest>{
		containerEvents: async () => {
			const graphQlQuery = `query($startTimeIso: DateTime, $endTimeIso: DateTime) {
					store {
						accessPoint(id: "CONTAINER_ROOT") {
							children {
								id
								tag: externalKey(key: "tag")
								events(startTimeIso: $startTimeIso, endTimeIso: $endTimeIso) {
									timestamp
									type
									fraction: property(key: "fraction")
								}
							}
						}
					}
				}`


			const result = await callIt(graphQlQuery, args, rootValue)

			// Move called to separate function and ADD SORTING

			return flatten<{block, timestamp}>(result.store.accessPoint.children.filter(x => x.events).map(({tag, events}) => events.map(e => ({
				block: {
					fraction: e.fraction,
					pointReference: tag,
					timestampIso: new Date(e.timestamp).toISOString(),
					type: e.type,
				},
				timestamp: e.timestamp,
			})))).concat().sort(sortByCompare("timestamp")).map(x => x.block)
		},
		intervalTree: async () => {
			return []
		}
	}
