namespace SourceContracts {
	interface ITerminalTest {
		containerEvents: () => Promise<SourceContracts.IEventBase[]>
		intervalTree: () => Promise<SourceContracts.IFlatIntervalTree[]>
		valveOperatorCount: () => Promise<SourceContracts.IFlatOperatorTree[]>
	}
}