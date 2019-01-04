namespace SourceContracts {
	interface ITerminalTest {
		containerEvents: (x) => Promise<SourceContracts.IEventBase[]>
	}
}