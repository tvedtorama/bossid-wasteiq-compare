
namespace ApiSupportSchema {
	export interface ICommonStore {
		name: string
		user: Promise<any>
	}

	export interface ICommonSchemaArgs<TStore extends ICommonStore> {
		store: () => Promise<TStore>
	}
}