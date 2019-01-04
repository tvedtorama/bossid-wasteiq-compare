
namespace ApiSupportSchema {

	export interface IGenericIdArgs {
		id: string
	}

	export interface ICoreStore extends ICommonStore {
		getArgs(): ApiSupportSchema.IStoreArgs
	}

	export interface ISchemaArgs extends ICommonSchemaArgs<ICoreStore> {
	}

}
