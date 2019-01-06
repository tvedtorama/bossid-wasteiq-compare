import * as React from 'react'

export type ActionFromState<T> = Partial<T> & {
	type: string
}

export interface IModalState {
	showModal: boolean
	component: any
	caption: any
}

export type INotificationClass = "NOTIFICATION" | "DOCK_MESSAGE"

export interface INotificationStateInputArgs {
	content: string | React.ReactNode
	critical: boolean
	notificationClass: INotificationClass
	key: string
	dismissDelay: number
	isActive?: boolean
}

export interface INotificationState extends INotificationStateInputArgs {
	isActive: boolean
}

export interface IProjectInviteState extends IModalState {

}

export interface ILangCustState {
	langCode: string
	custTags: string[]
	overrides: string[]
}

export type IPendingActionDataStates = "STARTED" | "CMD_STORED"

export type AppModes = "NORMAL"

export interface IAuthProfile {
	name: string
	nickname: string
	imageUrl: string
	email: string
}

export interface IInitData {
	token?: string
	tokenData?: {
		authProfile?: IAuthProfile
		expiry?: number
	}
	expiryWarning?: boolean

	appMode?: AppModes
}

export interface IState {
	initData?: IInitData
	modal: IModalState
	notifications?: INotificationState[]
	langCust?: ILangCustState
	testResults?: Tests.ITestResult[]
}
