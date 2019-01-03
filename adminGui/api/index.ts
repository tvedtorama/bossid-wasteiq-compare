import * as Snippets from '../../utils/clientApi/commonGraphQlSnippets'
const memoize = require('lodash.memoize')

import { ClientApiBase, IProjectResourceProps, IGetInviteDataReturnType, getRecursiveStruct, Context } from '../../utils/clientApi/index';

export { IProjectResourceProps, IGetInviteDataReturnType }

export interface IStore {
	nothingHereRightNow: string
}

export const storeFieldList: (keyof IStore)[] = []
export const storeFields = storeFieldList.join()

export class Api extends ClientApiBase {
	public static storeFieldList = storeFieldList

	getStartItems(): Promise<any> {
		return this.runQuery(Snippets.loadStore(`
						${storeFields},
						${Snippets.userQuery(true)},
						${""}
					`))
	}
}
