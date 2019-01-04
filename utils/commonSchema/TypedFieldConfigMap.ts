import { GraphQLFieldConfig, GraphQLArgumentConfig, GraphQLInputField } from "graphql";

export type TypedFieldConfigMap<T, TContext = any> = {
	[P in keyof T]: GraphQLFieldConfig<T, TContext>
}

export type TypedArgConfigMap<T> = {
	[P in keyof T]: GraphQLArgumentConfig
}

export type TypedInputFieldConfigMap<T, TContext = any> = {
	[P in keyof T]: GraphQLInputField
}
