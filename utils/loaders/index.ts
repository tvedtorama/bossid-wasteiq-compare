/// <reference path="../commonSchema/ICommonSchemaArgs.ts" />

import * as _ from 'lodash'
import { initDbInfoAndSetupDataLoaders, IDBInfo } from './initDbInfo';


export interface IJwtUser {
	// Sub for "Subject" - this is assumed to contain the unqiue identifier of the account.
	sub: string
}

/* const serviceProvider = <IServiceProvider>{
	url: "https://shop2win/somewhere",
	label: "Namdal Ressurs Inc",
} */


export const createTheStore = async (dbInfo) => ({
	name: "This is my name",
	// Note: User should be provided by the jwt, ATW this is not conveyed in here.
	user: Promise.resolve({name: "The User's name"}),
})

export const createCommonDataAccess = function<U extends object>(getStore: (mainDbInfo: IDBInfo) => any, getAdditionals: (mainDbInfoPromise: Promise<IDBInfo>) => U) {
	return [initDbInfoAndSetupDataLoaders("MAIN")].map(dbInfo =>
		<ApiSupportSchema.ICommonSchemaArgs<ApiSupportSchema.ICommonStore> & U>({
			store: () => dbInfo.then(dbInfo => getStore(dbInfo)),
			...<object>getAdditionals(dbInfo)
		})
	)[0]
}
