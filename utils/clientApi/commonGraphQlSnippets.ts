
export const loadStore = (children: string, args: string = "") => `query${args.length ? "(" + args + ")" : ""} { store { ${children} }}`

export const userQuery = (resource: boolean = false) => `user {name}` // `user {name, ${resource ? userResourceQueryResourcePart + ',' : ''} scenarioList {name, id, orgType}}`

