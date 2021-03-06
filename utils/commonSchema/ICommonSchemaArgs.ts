
namespace ApiSupportSchema {
	export interface ICommonStore {
		name: string
		user: Promise<any>
		getArgs(): ApiSupportSchema.IStoreArgs
	}

	export interface IStoreArgs {
		rootId: string
		startTimeIso: string
		endTimeIso: string
	}

	export interface ICommonSchemaArgs<TStore extends ICommonStore> {
		store: (args: IStoreArgs) => Promise<TStore>
	}
}