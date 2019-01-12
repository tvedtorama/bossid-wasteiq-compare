import { Api } from "../api";
import { Context } from "../../utils/clientApi";

export const operatorTree = async (api: Api, args: any) => {
	const result = await api.runQuery(`query($rootId: String, $startTimeIso: String, $endTimeIso: String) {
			store(rootId: $rootId, startTimeIso: $startTimeIso, endTimeIso: $endTimeIso) {
				bossID {
					valveOperatorCount {
						containerTimestampIso
						containerTag
						valveTimestampIso
						valveBossIdId
						count
						operatorId
					}
				}
				wasteIQ {
					valveOperatorCount {
						containerTimestampIso
						containerTag
						valveTimestampIso
						valveBossIdId
						count
						operatorId
					}
		  		}
			}
		}`, Context.USER_ONLY, args)

	return <Tests.ITestResultCore>result.store
}
