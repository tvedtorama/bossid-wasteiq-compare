

/** "Native" impl of Lodash groupBy, for arrays.  Look at the cool default argument and the comma in the paranthesis!!!!
 *
 * This was added to reduce dependencies on lodash, and to have some group functionality that can be refactoed to sharable logic.
 *
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_groupby
 */
export const groupBy = <T, Y>(a: T[], func: (v: T) => Y): {[index: string]: T[], [index: number]: T[]} =>
	a.reduce((r, v, _i, _a, k = func(v)) => ((r[k] || (r[k] = [])).push(v), r), {})

/** "Native" impl of lodash flatten.  Typing might be more restrictive than the actual logic */
export const flatten = <T>(arr: (T[] | T)[]) => arr.reduce<T[]>((a, b) => a.concat(b), [])

export const isEmpty = (arr: {length: number}) => !arr || arr.length === 0

export const takeRight = <T = any>(arr: T[], n: number) => arr.slice(arr.length - n)

export const last = <T = any>(arr: T[]) => arr[arr.length - 1]

export const range = (start: number, count: number) => count > 0 ? [...Array(count).keys()].map(i => i + start) : []

export const intersection = <T>(arrays: T[][]): T[] =>
	arrays.reduce((a, b) =>
		a.filter(value =>
			b.indexOf(value) > -1))

export const sortByCompare = (key: string | number | symbol) =>
	(a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0)