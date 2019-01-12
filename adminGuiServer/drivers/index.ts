import { createBossIdDriver } from "./bossid";
import { createWasteIQDriver } from "./wasteiq";

const dummyImpl = (args: ApiSupportSchema.IStoreArgs) => (<SourceContracts.ITerminalTest>{
	containerEvents: async () => [
			{
				fraction: "10",
				timestampIso: new Date(Date.parse(args.startTimeIso) + 3600 * 1000).toISOString(),
				type: "EMPTY",
				pointReference: "abc123",
			}
		],
	intervalTree: async () => [
		{
			fractionCode: "9999",
			containerTimestampIso: "1922-12-31T10:00:00.991Z",
			valveTimestampIso:  "1922-12-31T11:00:00.991Z",
			containerTag: "ABC123",
			valveBossIdId: "C123",
		}
	],
	valveOperatorCount: async () => [{
		containerTimestampIso: "1922-12-31T10:00:00.991Z",
		valveTimestampIso:  "1922-12-31T11:00:00.991Z",
		containerTag: "ABC123",
		valveBossIdId: "C123",
	}]
})

const sqlClient = (() => {
	try {
		return require("msnodesqlv8")
	} catch {
		return null
	}
})();

export const getBossIdDriver = () => sqlClient ? createBossIdDriver(sqlClient) : dummyImpl
export const getWasteIQDriver = () => createWasteIQDriver()
