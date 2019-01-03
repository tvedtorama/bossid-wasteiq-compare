export interface ILangDB<T> {[index: string]: {[index: string]: T}}

const subExpMathches = function*(text: string) {
	const regex = /\{\{(.*?)\}\}/g;
	let result: RegExpExecArray = null
	while ((result = regex.exec(text)) !== null) {
		yield result[1]
	}
}

/** Searches for replaces within the text and then within the replaces */
export const getTextOverrideRecursive = (res: string, getter: (res: string) => string) => {
	const text = getter(res)
	const matches = [...new Set(subExpMathches(text))]
	return matches.reduce((x, y) => x.replace("{{" + y + "}}", getTextOverrideRecursive(y, getter) || y), text)
}

export const getConditionalStringOverride = (text: string, custTagList: string[], textDB: ILangDB<string>) => {
	const match = /^\{(.*)\}$/.exec(text)
	return match ? getStringOverride(match[1], custTagList, textDB) : text
}

/** Fetches a given str for the resource, including the common db maps
 *
 * Does not resolve {{x}} macros, wrap in @link getTextOverrideRecursive to get that.
 */
export const getStringOverride = (res: string, custTagList: string[], textDB: ILangDB<string>): string =>
	getOverride(["common", ...custTagList], textDB, res) || res

export const getOverride = function<T>(custTags: string[], map: ILangDB<T>, res: string): T {
	return custTags.reduce<T>((x, key) => {
			const dbx = map[key]
			const override = (dbx && dbx[res]) || x
			return override
		}, null)
}
