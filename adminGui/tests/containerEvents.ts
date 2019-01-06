import { Api } from "../api";
import { Context } from "../../utils/clientApi";


export const containerEvents = async (api: Api, args: any) => {
	const result = await api.runQuery(`query($rootId: String, $startTimeIso: String, $endTimeIso: String) {
		store(rootId: $rootId, startTimeIso: $startTimeIso, endTimeIso: $endTimeIso) {
		  bossID {
			containerEvents {
			  timestampIso
			  type
			  fraction
			  pointReference
			}
		  }
		  wasteIQ {
			containerEvents {
			  timestampIso
			  type
			  fraction
			  pointReference
			}
		  }
		}
	  }`, Context.USER_ONLY, args)

	return <Tests.ITestResultCore>result.store
}
