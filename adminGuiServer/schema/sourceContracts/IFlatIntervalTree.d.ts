namespace SourceContracts {
	interface ITreeCommon {
		containerTimestampIso: string
		containerTag: string
		valveTimestampIso: string
		valveBossIdId: string
	}

	interface IFlatIntervalTree extends ITreeCommon{
		fractionCode: string
		customerEventTimestampIso?: string
		customerEventOperatorId?: string
		customerEventIdentityIdentifier?: string
		customerEventValue?: string
		customerEventAgreementGuid?: string
	}
}
