
namespace ApiSupportSchema {

	export interface IGenericIdArgs {
		id: string
	}

	export interface ICoreStore extends ICommonStore {
	}

	export interface ISchemaArgs extends ICommonSchemaArgs<ICoreStore> {
	}

}
