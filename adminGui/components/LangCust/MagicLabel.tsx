import * as React from 'react'
import {IState} from '../../IState'
import {connect} from 'react-redux'
import {LCust, ICustomPropsProps, ILCustResProp} from './LangCust' // Somewhat evil dependcy here, for convenience - should perhaps have a React context value for this or something
import { fromPairs, omit } from '../../../utils/objects';
import { takeRight } from '../../../utils/arrays';
const ReactMarkdown = require('react-markdown')

const systemNameRegex = /heipaadeg/

// The MagicLabel component shows MarkDown, {RESOURCE_ID} (res), {"LANG_code":"Markdown"} (json)

const semiJsonRegex = /^\{".+":\s*".+"\}$/
const resourceStrRegex = systemNameRegex // Resource format: {RES_ID}

const regexMap = [
	str => semiJsonRegex.test(str) ? "JSON" : null,
	str => [resourceStrRegex.exec(str)].filter(x => x).map(x => "RES:" + x[1])[0],
	str => "MD!" // put something here to avoid mixups with input text containing RES: or JSON
]

const resolveJson = (json: string, custTags: string[]): JSX.Element =>
	[JSON.parse(json)].
	map(pjs => custTags.reduce((x, y) => x || pjs[y], null)).  // It might be a good idea to reverse the OR here, so a COMMON Tag can be used, see also below
	map(str => <ReactMarkdown source={str} />)[0] || <div className="json-did-not-resolve-lang"/>

const composeResArgs = (resStr: string): ICustomPropsProps & ILCustResProp =>
	[resStr.split(',')].
				map(splits => ({res: splits[0], ...fromPairs(takeRight(splits, splits.length - 1).map((x, i) => [`arg${i}`, x]) as [string, string][])})).
				map(props =>
	({
		customProps: omit(props, ["res"]),
		res: props.res,
	}))[0]

interface IProps {source: string, lcustClass?: React.ComponentClass<any>}
interface IMangledProps {custTags?: string[]}

const MagicLabelRaw = (props: IProps & IMangledProps) =>
[
	regexMap.reduce((x, y) => x || y(props.source), null as string)
].map(parsed =>
	parsed === "JSON" ?
		resolveJson(props.source, props.custTags) :
		parsed.indexOf("RES:") === 0 ? React.createElement(props.lcustClass || LCust, composeResArgs(parsed.substr(4))) :
	<ReactMarkdown source={props.source}/>)[0]

const mapStateToProps = (state: IState, ownProps: any): IMangledProps =>
	({custTags: state.langCust.custTags}) // Note: skiped the "common" part

/** Parses the *source* prop as text, a resource, or multi language json.
 *
 * Use ReactMarkdown directly when you just want to render markdown.
 *
 * JSON format: {"LANG_no": "hei du", "LANG_en": "hello you"}
 * RES format: {NavHome}
 * Plain markdown: any string that's not a json
 */
export const MagicLabel = connect(mapStateToProps)(MagicLabelRaw) as React.ComponentType<IProps>
