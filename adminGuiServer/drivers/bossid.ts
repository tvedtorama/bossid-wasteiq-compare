import { EventEmitter } from "events";

/*import { SqlClient } from "msnodesqlv8";
 
const sql: SqlClient = require("msnodesqlv8"); */

interface SqlClient {
	query: (connStr, query: string, cb: (err: any, rows: any[], more: boolean) => void) => EventEmitter
}

const {connectionString} = require.main.require("./connectionString")

const query = (startTimeIso: string, endTimeIso: string) => `select Merkelapp, HendelseDato, TommeReferanse, FT.FraksjonID
FROM [dbo].[TommeHendelseContainerBossID] THC
INNER JOIN [BossID].[dbo].[FraksjonsType] FT ON THC.IDFraksjon = FT.IDFraksjon
WHERE (HendelseDato >= '${startTimeIso || "2000-01-01T00:00Z"}' AND HendelseDato < '${endTimeIso || "2100-01-01T00:00Z"}')
ORDER BY HendelseDato`;

export const createBossIdDriver = (sql: SqlClient) =>
	(args: ApiSupportSchema.IStoreArgs) => <SourceContracts.ITerminalTest>{
		containerEvents: async () => {
			const rowsRaw: any[] = await new Promise((acc, rej) => {
					sql.query(connectionString, query(args.startTimeIso, args.endTimeIso), (err, rows) => {
						if (err) {
							rej(err)
						} else {
							acc(rows)
						}
					})
				})
			return rowsRaw.map(x => (<SourceContracts.IEventBase>{
				fraction: x.FraksjonID,
				pointReference: x.Merkelapp,
				timestampIso: (<Date>x.HendelseDato).toISOString(),
				type: "OUT",
			}))
		}
	}
