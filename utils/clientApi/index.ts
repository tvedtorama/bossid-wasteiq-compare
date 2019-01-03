import axios from 'axios'

import { takeRight } from '../arrays';

export interface IGetInviteDataReturnType {store: {invite: {title: string, type: "USER" | "ORG"}}}

export enum Context {
	USER_ONLY,
}

const shiftWithMinOneElement = (list: string[]) => takeRight(list, Math.max(1, list.length - 1))

/** Builds a rootXX {fields children {fields children {fields}}} type structure.  keys and content are rolled
 * out until levels surpass them, then the last element is reused.
 */
export const getRecursiveStruct = (keys: string[], content: string[], levels: number) =>
	`${keys[0]} {${content[0]} ${levels > 0 ? getRecursiveStruct(
		shiftWithMinOneElement(keys),
		shiftWithMinOneElement(content),
		levels - 1) : ""} }`


// Type also exists as Contracts.IProjectResourceProps
export interface IProjectResourceProps {
	name: string
	contact: string
	imageUri: string
}

interface IErrors {
	errors?: { message: string }[]
}


/** Semi hack to detect dev environment, where the core-api is assumed to run on a different port */
const isDevEnvironment = () => typeof window !== "undefined" && window.location.host.indexOf("localhost:") === 0

/** Base for client API across GUI and streams
 *
 * TODO: This does not throw on errors from graphQL, this is left to the called.  This does not make sense.
 */
export class ClientApiBase {
	// Check for dev environment, need a separate address, production should use "/" services will be handled by a reverse proxy
	private static _rootUrl = isDevEnvironment() ? "/" : "/"
	/** If not on the web, where "/" is used, set the global root url to use, ending in slash */
	public static setRootUrl(rootUrl: string) {
		ClientApiBase._rootUrl = rootUrl
	}

	constructor(private _token: string) { }

	protected getUrl = (context: Context = Context.USER_ONLY): string =>
		ClientApiBase._rootUrl + "comparegraphql"

	protected runQuery = <T = any>(query, context = Context.USER_ONLY, variables = {}) =>
		axios.post(this.getUrl(context), {
			query,
			token: this._token,
			variables: variables,
		}).then((x: { data: { data: any } & IErrors }) => (<T & IErrors>{ ...x.data.data, errors: x.data.errors }))

	protected _executer = query => this.runQuery(`{ store {${query} }}`)
}
