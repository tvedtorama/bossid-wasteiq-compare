namespace SourceContracts {
	interface ITerminalTest {
		containerEvents: () => Promise<SourceContracts.IEventBase[]>
	}
}