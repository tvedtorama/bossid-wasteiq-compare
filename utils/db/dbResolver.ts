import { IDataLoaders } from "./dataLoaders";

export interface IDBInfo {
	code: string
	url?: string
	apiKey?: string
	dataLoaders?: IDataLoaders
}

export type IDBTypes = "ALLOCATION" | "MAIN"
const ALLOCATION: IDBTypes = "ALLOCATION"
const MAIN: IDBTypes = "MAIN"

const mongoHost = process.env.MONGO_HOST || "127.0.0.1:27017"

export function getDbInfo(scenarioId: IDBTypes): Promise<IDBInfo> {
	// Note: when adding a new db, remember to also do prefix handling below
	// WARNING: URLS replaced in build procedures

	if (scenarioId === ALLOCATION)
		return Promise.resolve({
			code: ALLOCATION,
			url: `mongodb://${mongoHost}/allocation`,
			apiKey: ""
		})

	return Promise.resolve({
		code: MAIN,
		url: `mongodb://${mongoHost}/main`,
		apiKey: ""
	})
}

export function getAll(): Promise<IDBInfo[]> {
	return Promise.all([getDbInfo(MAIN), getDbInfo(ALLOCATION)]) as any as Promise<IDBInfo[]>
}

export const getDbPrefix = (dbInfo) => dbInfo.code === ALLOCATION ? "ALC" : "MNI"
export const getDbInfoFromPrefix = (prefix: string): Promise<IDBInfo> =>
	prefix.indexOf("ALC") === 0 ?
		getDbInfo(ALLOCATION) :
		getDbInfo(MAIN)
