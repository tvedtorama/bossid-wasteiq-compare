import {default as Axios} from 'axios'

import { signJwt } from "../../utils/security/jwt";
import { IRootValue } from "../schema/IRootValue";
import { flatten, sortByCompare } from '../../utils/arrays';
import { parseTree, parseOperatorTree } from './wasteIQHelpers/parseTree';
import { flatMap, orderBy, thenBy } from '@reactivex/ix-es5-cjs/iterable/pipe/index';
import { Iterable } from '@reactivex/ix-es5-cjs';

const url = process.env.GRAPHQL_URL || "http://127.0.0.1:3000/publicgraphql"

const callIt = async <T extends ApiSupportSchema.IStoreArgs>(graphQlQuery: string, args: T, rootValue: IRootValue): Promise<{store: any}> => {
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

			/** "Vacuum system" specific interval event tree layout, as opposed to more plain inlet/container arrangement */
			const intervalTreeEnvac = (eventStruct) => `query($rootId: String, $startTimeIso: DateTime, $endTimeIso: DateTime, $fractionFilter: KeyValueInput) {
				store {
					terminal: accessPoint(id: $rootId) {
						intervalEventTree(startTimeIso: $startTimeIso, endTimeIso: $endTimeIso, intervalStartEventType: "EMPTY", intervalEndEventType: "EMPTY",
							requiredProperties: [$fractionFilter]) {
								list {
									startTime
									endTime
									endEvent {
										parent {
											point {
												point {
													tag: externalKey(key: "tag")
												}
											}
										}
									}
									point {
										id
									}
									intervalEventTree(intervalStartEventType: "EMPTY", intervalEndEventType: "EMPTY", skipLevels: 1,
										requiredProperties: [$fractionFilter]) {
										list {
										point {
											id
										}
										startTime
										endTime
										intervalEventTree {
											${eventStruct}
										}
									}
								}
							}
						}
					}
				}
			}`


export const createWasteIQDriver = () =>
	(args: ApiSupportSchema.IStoreArgs, rootValue: IRootValue) => <SourceContracts.ITerminalTest>{
		containerEvents: async () => {
			// Note: Uses 'child events' to find terminal/root relation client side.
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
									children { 
										point {
											id
										}
									}	
								}
							}
						}
					}
				}`


			const result = await callIt(graphQlQuery, args, rootValue)

			// Move called to separate function and ADD SORTING

			return flatten<{block, timestamp, rootId}>(result.store.accessPoint.children.filter(x => x.events).map(({tag, events}) => events.map(e => ({
				block: {
					fraction: e.fraction,
					pointReference: tag,
					timestampIso: new Date(e.timestamp).toISOString(),
					type: e.type,
				},
				timestamp: e.timestamp,
				rootId: (e.children || []).map(c => c.point.id)[0],
			})))).
			filter(x => x.rootId === args.rootId).concat().sort(sortByCompare("timestamp")).map(x => x.block)
		},
		intervalTree: async () => {
			const query = intervalTreeEnvac(`events {
				point {
					id
				}
				customer {
					customer {
						name
						aggreementGuid: externalKey(key: "PAAvtaleGUID")
					}
				}
				timestamp
				operatorId: property(key: "operatorId")
				value: property(key: "weight")
				srcIdentityId: property(key: "srcIdentityId")
				operationMode: property(key: "hatchOrOperationType")
			}`)

			const fractions = ["9999", "1299"]


			const results = await Promise.all(fractions.map(fraction => callIt(query, {...args, fractionFilter: {key: "fraction", value: fraction}}, rootValue).
					then(result => parseTree(result.store.terminal.intervalEventTree.list, fraction))))
			const parsed = Iterable.from(results).pipe(
				flatMap(x => x),
				orderBy(x => x.valveTimestampIso),
				thenBy(x => x.customerEventTimestampIso),
			)

			return [...parsed]
		},
		valveOperatorCount: async () => {
			const query = intervalTreeEnvac(`eventsAggregate(aggKey: "properties.operatorId") {
				groupBy {
				  aggKey {
					keyValue {
					  key
					  aggregate {
						count
					  }
					}
				  }
				}
			  }`)

			const fractions = ["9999", "1299"]


			const results = await Promise.all(fractions.map(fraction => callIt(query, {...args, fractionFilter: {key: "fraction", value: fraction}}, rootValue).
					then(result => parseOperatorTree(result.store.terminal.intervalEventTree.list, fraction))))
			const parsed = Iterable.from(results).pipe(
				flatMap(x => x),
				orderBy(x => x.valveTimestampIso),
			)

			return [...parsed]
		},
	}
