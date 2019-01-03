import {enableDataLoaders} from '../../utils/db/dataLoaders'
import {getDbInfo, IDBInfo, IDBTypes} from '../../utils/db/dbResolver'

export {IDBInfo}

export const initDbInfoAndSetupDataLoaders = (scenarioId: IDBTypes) =>
	getDbInfo(scenarioId).
		then(dbInfo => enableDataLoaders(dbInfo,
					cb => {
						// hook up cache cleaning initiatives (on events)
					}))