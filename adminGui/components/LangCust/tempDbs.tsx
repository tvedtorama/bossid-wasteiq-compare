import * as React from 'react'
import {MagicLabel} from './MagicLabel'
import { MarkdownLoader } from './MarkdownLoader';
const ReactMarkdown = require('react-markdown')

// This file should be replaced by a dynamic service

const magicLabel = (source: string, lcustClass?: React.ComponentClass<any>) => <MagicLabel source={source} lcustClass={lcustClass} />;

const arg0Replace = /\{arg0\}/g
const arg1Replace = /\{arg1\}/g

type ICProps = {text: string, arg0, arg1}

const commonMarkdownWithReplace = (props: ICProps) => <ReactMarkdown source={props.text.replace(arg0Replace, props.arg0).replace(arg1Replace, props.arg1)} linkTarget={"_blank"} />
const CMWR = commonMarkdownWithReplace

interface IRouteLabelProps {text: string, routeAdd: string}

const componentDB: {[index: string]: {[index: string]: React.ComponentClass<any> | React.StatelessComponent<any>}} = {
	'common': {
		'CriticalError': props => <div><span>{props.text}</span>{magicLabel(props.content)}<a href="/"><span>{props.resolver("ClickToReload")}</span></a></div>,
		'DockAcceptWarning': props => <div className={"dock-warning-content"}><ReactMarkdown source={props.resolver(props.arg0)} linkTarget={"_blank"}/><a className="btn" onClick={e => props.dispatch({type: props.arg1, key: props.arg2})}><div className="glyphicon icon"/><span>{props.resolver('AcceptAndDismiss')}</span></a></div>,
		'TermsText': props => <MarkdownLoader url="/doc/terms.md"/>, // Note: read url from props.text to support multiple language versions
		'PrivacyText': props => <MarkdownLoader url="/doc/privacy.md"/>, // Note: read url from props.text to support multiple language versions
		'VALIDATION_MIN_CHARACTERS': CMWR,
	},
	'LANG_en': {
	},
	'LANG_no': {
	}
}

// TODO: Some simple "grammar" formulas would be nice {{Project, Capitalize}} {{Project, Plural}}, german nouns should always be capitalized - so they are so in the source.

const textDB: {[index: string]: {[index: string]: string}} = {
	'common': {
		'LoginToken': 'Token',
		'NewLine': `

`,
		'AHHeaderTitle': `![](/img/content_logo.png)`,
		'AHHeaderSubtitle': "{{ProductName}}",
	},
	'LANG_en': {
		'WizardEditNext': '<< Save',
		'WizardEditPrev': '<< {{Cancel}}',
		'WizardNext': 'Next >>',
		'WizardPrev': '<< Previous',
	},
	'LANG_no': {
		'WizardEditNext': '<< Lagre',
		'WizardEditPrev': '<< {{Cancel}}',
		'WizardNext': 'Neste >>',
		'WizardPrev': '<< Forrige',
		'YesNoYes': 'Ja',
		'YesNoNo': 'Nei',
	},
	'DUMMY_OVERRIDES_no': {
		'Reason': 'Årsak',
		'Organization': 'Org.',
	},
	'ACTIVITY_en': {
	}
}

export {componentDB, textDB}
