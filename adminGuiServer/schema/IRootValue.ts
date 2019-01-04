/// <reference path="../../utils/commonSchema/ICommonRootValue.ts" />
/// <reference path="./ISchemaArgs.d.ts" />

export interface IRootValue extends ApiSupportSchema.ICommonRootValue {
	dataAccess: ApiSupportSchema.ISchemaArgs
}

export interface IRootValueRoot {
	rootValue: IRootValue
}
