namespace ApiSupportSchema {
	export interface ICommonRootValue<TStore extends ICommonStore = ICommonStore> {
		dataAccess: ApiSupportSchema.ICommonSchemaArgs<TStore>
		user?: {sub: string}
		getCookieValue: (key: string) => string
		setCookieValue: (key: string, value: string) => void
		getFiles: () => {originalname: string, buffer: Buffer, mimetype: string, size: number}[]
		getLogs: () => any[]
	}

	export interface ICommonRootValueRoot {
		rootValue: ICommonRootValue
	}
}
