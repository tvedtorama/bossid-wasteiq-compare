const words = require('lodash.words');

export const cheapHash = function(input: string | {}) {
	const str = typeof input === "string"  ? input : JSON.stringify(input)
	let hash = 0;
	if (str.length === 0) return hash;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

export const kebabCase = (str: string) => (
	words(`${str}`.replace(/['\u2019]/g, '')).reduce((result, word, index) => (
	result + (index ? '-' : '') + word.toLowerCase()
	), '')
)

export const upperFirst = (str: string) => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`
export const lowerFirst = (str: string) => `${str.slice(0, 1).toLowerCase()}${str.slice(1)}`