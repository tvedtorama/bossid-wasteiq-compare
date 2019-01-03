import * as React from 'react'
import {connect} from 'react-redux'
import {IState} from '../../IState'
import {withPath} from './PathProvider'
import {componentDB, textDB} from './tempDbs'
import { getOverride, getStringOverride as getStringOverride_impl, getConditionalStringOverride as getConditionalStringOverride_impl, getTextOverrideRecursive} from '../../../utils/language/index';
import { isEmpty } from '../../../utils/arrays';
import { kebabCase } from '../../../utils/string';
const ReactMarkdown = require('react-markdown')

export interface ICustomPropsProps {
	customProps?: any
}
export interface ILCustResProp {
	res: string
}

export interface IProps extends ICustomPropsProps, ILCustResProp {
	className?: string
	path?: string
	markdown?: boolean
	markdownLinkTarget?: "_blank"
}

interface IMangledProps {
	custTags?: string[]
	dispatch?: (x) => any
}

export const getConditionalStringOverride = (text: string, state: IState) =>
	getConditionalStringOverride_impl(text, state.langCust.custTags, textDB)

/** Fetches a given str for the resource, including the common db maps
 *
 * Does not resolve {{x}} macros, wrap in @link getTextOverrideRecursive to get that.
 */
export const getStringOverride = (res: string, state: IState): string =>
	getStringOverride_impl(res, state.langCust.custTags, textDB)


class LangCustRaw extends React.Component<IProps & IMangledProps, {toolTipVisible: boolean}> {

	getOverride<T>(map: {[index: string]: {[index: string]: T}}, res: string): T {
		return getOverride<T>(this.props.custTags, map, res)
	}

	fullPathRes = res => this.props.path + "." + res
	fullPath = () => this.fullPathRes(this.props.res)
	textResolver = res => this.getOverride(textDB, this.fullPathRes(res)) || this.getOverride(textDB, res) || res
	textOverride = res => getTextOverrideRecursive(res, x => this.textResolver(x))

	render() {
		// Performance: The final component could be cached based on this.fullPath()
		// Text smartness: Use the natural lanuage componet to determine prefix and perhaps capitalization on macro words (then cache the result)

		const {res, children, dispatch} = this.props

		const compOverride = this.getOverride(componentDB, this.fullPath()) || this.getOverride(componentDB, res)

		const childList: React.ReactNode[] = Array.isArray(children) ? children : (children ? [children] : [])
		const commonProps = () => ({
			className: (this.props.className || '') + ' ' + kebabCase(res) // Use res in kebab case as class name as default, to allow the rendered html to be linked to its res-string, and because it might be a good default
		})
		const containerType = (text) => isEmpty(childList) ?
			(this.props.markdown ?
				<ReactMarkdown source={text} {...commonProps()} {...(this.props.markdownLinkTarget ? {linkTarget: this.props.markdownLinkTarget} : {})}/> :
				<span {...commonProps()}>{text}</span>) :
			<label {...commonProps()}>{text}{...childList}</label>

		const comp = compOverride ? React.createElement(compOverride as React.ComponentClass<any>, {  // Reason for cast requirement unknown
				text: this.textOverride(res),
				resolver: this.textOverride,
				lcustClass: LCust,
				dispatch,
				...this.props.customProps,
			}) :
			containerType(this.textOverride(res))

		// onClick={() => this.setState({toolTipVisible: !this.state.toolTipVisible})} />
		const toolTip = [res + "_ToolTip"].map(tres => ({text: this.textOverride(tres), tres})).
					filter(({tres, text}) => text !== tres).map(x => x.text)[0]
		return toolTip ? <div className="tooltip-lang-cust">
				{comp}
				<a className="glyphicon icon" />
				<div className="tooltip-container">
					<div className="tool-tip">
						<ReactMarkdown source={toolTip} />
					</div>
				</div>
			</div> : comp
	}
}

function mapStateToProps(state: IState, ownProps: IProps) {
	return {custTags: ['common', ...state.langCust.custTags]} as IMangledProps
}

export const LCust = withPath(connect(mapStateToProps, {dispatch: x => x})(LangCustRaw)) as React.ComponentClass<IProps>
