import {IModalState} from '../IState'
import {Action} from 'redux'
import {SHOW_MODAL, IShowModal, HIDE_MODAL} from '../actions/modals'

export function modal(state: IModalState = {showModal: false, component: null, caption: ''}, action: Action) : IModalState {
	if (action.type === HIDE_MODAL) {
		return {showModal: false, component: null, caption: ''}
	}

	if (action.type === SHOW_MODAL) {
		const act = action as IShowModal
		return {showModal: true, component: act.component, caption: act.caption} // Let the reducer fetch the react component?
	}
	return state
}