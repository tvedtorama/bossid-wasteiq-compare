

export const fromPairs = (arr: any[][]) => arr.reduce((acc, val) => (acc[val[0]] = val[1], acc), {})

export const omit = <T>(item: T, elms: (keyof T)[]): Partial<T> => Object.keys(item).filter(x => elms.indexOf(x as keyof T) === -1).reduce((x, y) => ({...x, [y]: item[y]}), {})

export const pick = <T extends object, U extends keyof T>(item: T, paths: Array<U>): Pick<T, U> => paths.filter(p => p in item).reduce((x, y) => ({...x, [y]: item[y]}), {}) as Pick<T, U>