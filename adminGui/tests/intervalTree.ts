import { Api } from "../api";
import { Context } from "../../utils/clientApi";


export const intervalTree = async (api: Api, args: any) => {
	const result = await api.runQuery(`query($rootId: String, $startTimeIso: String, $endTimeIso: String) {
		store(rootId: $rootId, startTimeIso: $startTimeIso, endTimeIso: $endTimeIso) {
		  bossID {
			intervalTree {
				containerTimestampIso
				containerTag
				valveTimestampIso
				valveBossIdId
				customerEventTimestampIso
				customerEventOperatorId
				customerEventIdentityIdentifier
				customerEventAgreementGuid
				customerEventValue
				fractionCode
			}
		  }
		  wasteIQ {
			intervalTree {
				containerTimestampIso
				containerTag
				valveTimestampIso
				valveBossIdId
				customerEventTimestampIso
				customerEventOperatorId
				customerEventIdentityIdentifier
				customerEventAgreementGuid
				customerEventValue
				fractionCode
			}
		  }
		}
	  }`, Context.USER_ONLY, args)

	return <Tests.ITestResultCore>result.store
}
