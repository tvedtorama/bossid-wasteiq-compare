import {default as Axios} from 'axios'

import { signJwt } from "../../utils/security/jwt";
import { IRootValue } from "../schema/IRootValue";
import { flatten } from '../../utils/arrays';


export const createWasteIQDriver = () =>
	(args: ApiSupportSchema.IStoreArgs, rootValue: IRootValue) => <SourceContracts.ITerminalTest>{
		containerEvents: async () => {
			// WARNING: assumes the two systems audience and secure keys are the same
			const token = await signJwt(rootValue.user.sub, rootValue.user.sub)

			const url = process.env.GRAPHQL_URL || "http://127.0.0.1:3000/publicgraphql"

			const graphQlQuery = `query($startTimeIso: DateTime, $endTimeIso: DateTime) {
				store {
				  accessPoint(id: "CONTAINER_ROOT") {
					children {
					  events(startTimeIso: $startTimeIso, endTimeIso: $endTimeIso) {
						timestamp
						type
						fraction: property(key: "fraction")
						point {
						  point {
							id
							  tag: externalKey(key: "tag")
						  }
						}
					  }
					}
				  }
				}
			  }
			  `
			const variables = args

			const callIt = async () => {
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
			const result = await callIt()

			return flatten(result.store.accessPoint.children.filter(x => x.events).map(({tag, events}) => events.map(e => ({
				fraction: e.fraction,
				pointReference: tag,
				timestampIso: new Date(e.timestamp).toISOString(),
				type: e.type,
			}))))
/*			return rowsRaw.map(x => (<SourceContracts.IEventBase>{
			})) */
		}
	}
