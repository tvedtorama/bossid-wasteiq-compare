import { EventEmitter } from "events";

interface SqlClient {
	query: (connStr, query: string, cb: (err: any, rows: any[], more: boolean) => void) => EventEmitter
}

const {connectionString} = require.main.require("./connectionString")

const containerEventsQuery = (startTimeIso: string, endTimeIso: string) => `select Merkelapp, HendelseDato, TommeReferanse, FT.FraksjonID
FROM [dbo].[TommeHendelseContainerBossID] THC
INNER JOIN [BossID].[dbo].[FraksjonsType] FT ON THC.IDFraksjon = FT.IDFraksjon
WHERE (HendelseDato >= '${startTimeIso || "2000-01-01T00:00Z"}' AND HendelseDato < '${endTimeIso || "2100-01-01T00:00Z"}')
ORDER BY HendelseDato`;

const intervalTreeQuery = (startTimeIso: string, endTimeIso: string) => `SELECT TH_C.HendelseDato ContainerTimestamp, FT.FraksjonID,
	TE_C.Merkelapp Tag, TH_E.HendelseDato ValveTimestamp,
	TE_E.IDPunktBarn ValveBossIdId,
	KH.HendelseTidspunkt CustomerTimestamp, KH.IDKundeAktor, KH.Rfid, KH.Verdi, KE.GUIDAvtale
FROM [BossID].[dbo].[KundeHendelserContainer] KHC
INNER JOIN [BossID].[dbo].[TommeHendelser] TH_C on TH_C.IDTommeHendelse = KHC.IDTommeHendelse
INNER JOIN [BossID].[dbo].[TommeHendelser] TH_E ON TH_E.IDTommeHendelse = KHC.IDTommeHendelseEnhet
INNER JOIN [BossID].[dbo].[TommeEnhet] TE_C ON TE_C.IDTommeEnhet = TH_C.IDTommeEnhet
INNER JOIN [BossID].[dbo].[TommeEnhet] TE_E ON TE_E.IDTommeEnhet = TH_E.IDTommeEnhet
INNER JOIN [BossID].[dbo].[FraksjonsType] FT ON TH_C.IDFraksjon = FT.IDFraksjon
LEFT OUTER JOIN [BossID].[dbo].[KundeHendelserEnhet] KHE ON KHE.IDTommeHendelse = KHC.IDTommeHendelseEnhet
LEFT OUTER JOIN [BossID].[dbo].[KundeHendelser] KH ON KH.IDKundeHendelse = KHE.IDKundeHendelse
LEFT OUTER JOIN [BossID].[dbo].[KundeEnhet] KE ON KE.IDKundeEnhet = KH.IDKundeEnhet
WHERE (TH_C.HendelseDato >= '${startTimeIso || "2000-01-01T00:00Z"}' AND TH_C.HendelseDato < '${endTimeIso || "2100-01-01T00:00Z"}')
ORDER BY TH_C.HendelseDato`;


const createRowsQuery = (sql: SqlClient) =>
	(queryStr: string): Promise<any[]> => new Promise((acc, rej) => {
	sql.query(connectionString, queryStr, (err, rows) => {
		if (err) {
			rej(err)
		} else {
			acc(rows)
		}
	})
})

const convertAndFormatTimestamp = (timestamp: Date) => timestamp && new Date(+timestamp - 3600000).toISOString()

export const createBossIdDriver = (sql: SqlClient, rowsQuery = createRowsQuery(sql)) =>
	(args: ApiSupportSchema.IStoreArgs) => <SourceContracts.ITerminalTest>{
		containerEvents: async () => {
			const rowsRaw: any[] = await rowsQuery(containerEventsQuery(args.startTimeIso, args.endTimeIso))
			return rowsRaw.map(x => (<SourceContracts.IEventBase>{
				fraction: x.FraksjonID,
				pointReference: x.Merkelapp,
				timestampIso: convertAndFormatTimestamp(x.HendelseDato),
				type: "OUT",
			}))
		},
		intervalTree: async () => {
			const rowsRaw: any[] = await rowsQuery(intervalTreeQuery(args.startTimeIso, args.endTimeIso))
			return rowsRaw.map(x => (<SourceContracts.IFlatIntervalTree>{
				containerTimestampIso: convertAndFormatTimestamp(x.ContainerTimestamp),
				containerTag: x.Tag,
				fractionCode: x.FraksjonID,
				valveBossIdId: 'C' + x.ValveBossIdId,
				valveTimestampIso: convertAndFormatTimestamp(x.ValveTimestamp),
				customerEventTimestampIso: convertAndFormatTimestamp(x.CustomerTimestamp),
				customerEventValue: x.Verdi,
				customerEventAgreementGuid: x.GUIDAvtale,
				customerEventIdentityIdentifier: x.Rfid,
				customerEventOperatorId: x.IDKundeAktor,
			}))
		}
	}
