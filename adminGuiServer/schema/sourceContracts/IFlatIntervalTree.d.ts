namespace SourceContracts {
	interface IFlatIntervalTree {
		containerTimestampIso: string
		containerTag: string
		fractionCode: string
		valveTimestampIso: string
		valveBossIdId: string
		customerEventTimestampIso?: string
		customerEventOperatorId?: string
		customerEventIdentityIdentifier?: string
		customerEventValue?: string
		customerEventAgreementGuid?: string
	}
}
