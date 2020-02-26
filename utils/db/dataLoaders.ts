import {IDBInfo} from './dbResolver'

export interface IDataLoader {
	load(id): Promise<any[]>
	clear(id): void
}

export interface IDataLoaders {
	getDataLoader(key): IDataLoader
	createDataLoader(key, batchLoadFn: (id: any[]) => Promise<any[][]>): IDataLoader
}

const dlMap: {[index: string]: IDataLoader} = {}
let DataLoader = null

export function initDataLoaders() {
	DataLoader = require("dataloader")
}

// Deletes the stored dataloaders, does not clear the data loaders' cache - which should be done conditionally later (TODO)
const clearAllCache = () => Object.keys(dlMap).forEach(x => delete dlMap[x])
const clearAllCacheFromExtEvent = (eventObject) => {
	console.log("Clear cache from extenal events")
	clearAllCache()
}

export function getDataLoaders(registerEvents?: (cb) => void) {
	if (!DataLoader)
		initDataLoaders()

	setTimeout(() => clearAllCache(), 5000) // TODO: Highly temporary

	if (registerEvents)
		registerEvents(clearAllCacheFromExtEvent)

	return <IDataLoaders>{
		getDataLoader: (key) => {
			return dlMap[key]
		},
		createDataLoader: (key, batchLoadFn) => {
			const dl = new DataLoader(batchLoadFn)
// 			console.log("data loader created", key)
			dlMap[key] = dl
			return dl
		},
	}
}

export const enableDataLoaders = (dbInfo: IDBInfo, registerEvents?: (cb) => void) =>
	<IDBInfo>{...dbInfo, dataLoaders: getDataLoaders(registerEvents)}
