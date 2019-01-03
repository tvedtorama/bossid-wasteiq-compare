import {Action} from 'redux'
import {IInitData} from '../IState'

import {INIT_INIT_DATA, INIT_SET_TOKEN} from '../sagas/init'

export const initData = (state: IInitData = {}, action: Action) =>
	[INIT_INIT_DATA, INIT_SET_TOKEN]. // These action types are assumed to merge right into the IInitData state
		filter(x => x === action.type).
		map(() => action).
		map(({type, ...rest}) => rest).
		map(restAction => ({...state, ...restAction}))
		[0] || state