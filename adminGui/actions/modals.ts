import {Action} from 'redux'
import * as React from 'react'

export const SHOW_MODAL = "SHOW_MODAL"
export const HIDE_MODAL = 'HIDE_MODAL'

export interface IShowModal extends Action {
	component: React.ReactNode
	caption: string | React.ReactNode
}

export interface IShowModalDelegate {
	(caption: string | React.ReactNode, component: React.ReactNode) : IShowModal	
}

export interface IHideModalDelegate {
	(): Action
}

const showModal: IShowModalDelegate = (caption, component) => {
	return {
		type: SHOW_MODAL,
		component,
		caption,
	}
}

const hideModal: IHideModalDelegate = function (): Action {
	return {type: HIDE_MODAL}
}

export {showModal, hideModal}
