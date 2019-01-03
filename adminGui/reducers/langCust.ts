import {Action} from 'redux'
import {ILangCustState} from '../IState'
import {SELECT_LANGUAGE, ISelectLanguage, ADD_OVERRIDE, IAddOverride} from '../actions/langCust'

function getLangOverride(lang: string, overrides: string[]): string[] {
	return overrides.map(x => x + "_" + lang)
}

export function langCust(state: ILangCustState = {langCode: 'en', custTags: ['LANG_en'], overrides: ['LANG']}, action: Action): ILangCustState {
	if (action.type === SELECT_LANGUAGE) {
		const a = <ISelectLanguage>action

		return Object.assign({}, state, {
			langCode: a.lang,
			custTags: getLangOverride(a.lang, state.overrides)
		})
	}
	if (action.type === ADD_OVERRIDE) {
		const a = <IAddOverride>action

		const overrides = [...state.overrides, a.override]
		return Object.assign({}, state, {
			overrides,
			custTags: getLangOverride(state.langCode, overrides),
		})
	}
	return state
}