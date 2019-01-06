import { IStoreTestResult } from "../sagas/runner";


export const testResults = (state: Tests.ITestResult[] = [], action: {type: "OTHER"} | IStoreTestResult) =>
	action.type === "STORE_TEST_RESULT" ?
		[...state, action.payload]
	: state

