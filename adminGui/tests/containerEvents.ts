import { Api } from "../api";
import { Context } from "../../utils/clientApi";


export const containerEvents = async (api: Api, args: any) => {
	const result = await api.runQuery(`query($startTimeIso: String) {
		store(rootId: "S1", startTimeIso: $startTimeIso, endTimeIso: "2018-12-21T07:58:15.000Z") {
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
