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
		]
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
