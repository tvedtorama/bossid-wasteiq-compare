import { take, select, call, put } from "redux-saga/effects";
import { Api } from "../api";
import { IState } from "../IState";
import { containerEvents } from "../tests/containerEvents";
import { intervalTree } from "../tests/intervalTree";

const jsdiff = require("diff")

const tests = {
	"containerEvents": containerEvents,
	"intervalTree S1": (api, args) => intervalTree(api, {...args, rootId: "S1"}),
	"intervalTree S2": (api, args) => intervalTree(api, {...args, rootId: "S2"}),
}

export interface ITestArgs {
	startTimeIso: string
	endTimeIso: string
	rootId: string
}

export type ITestCodes = keyof typeof tests


interface IRunTest {
	type: "RUN_TEST"
	testCode: ITestCodes
	args: Partial<ITestArgs>
}


export const runTest = (testCode: ITestCodes, args: Partial<ITestArgs>): IRunTest => ({
	type: "RUN_TEST",
	testCode,
	args,
})

export const RUN_TEST: IRunTest["type"] = "RUN_TEST"

export interface IStoreTestResult {
	type: "STORE_TEST_RESULT"
	payload: Tests.ITestResult
}

const MAX_LENGTH_COMPARE_STRING = 40000 // 1000 * 40

const pretty = (a: any) => JSON.stringify(a, null, 2)
const prettyAndCut = (a: any, vp = pretty(a)) => vp.length <= MAX_LENGTH_COMPARE_STRING ? vp :
`${vp.substr(0, MAX_LENGTH_COMPARE_STRING)}
Clipped length: ${vp.length - MAX_LENGTH_COMPARE_STRING} characters`

export const testRunner = function*() {
	const state = <IState>(yield select())
	const api = new Api(state.initData.token)

	// Map of actions - each linking to a test runner.  Run the test, put the result in state, including diff result - render the result.  Open dialog with diff.

	while (true) {
		const testRequestAction: IRunTest = yield take(RUN_TEST)

		const defaultArgs: ITestArgs = {
			// Move to action
			startTimeIso: "2018-12-31T00:00:00.000Z",
			endTimeIso: "2019-01-02T00:00:00.000Z",
			rootId: "S2",
			...testRequestAction.args
		}

		const result: Tests.ITestResultCore = yield call(tests[testRequestAction.testCode], api, defaultArgs)
		// Compare key metrics first.
		// Run the test for each terminal, as long as the test supports it - and the user has not cancelled it
		//   Pass the list to the test - and allow the test to determine what to run.
		//     Ie, multiple output
		const diffResult = jsdiff.createTwoFilesPatch("BossID", "WasteIQ", prettyAndCut(result.bossID), prettyAndCut(result.wasteIQ))
		console.log("Diff Result", diffResult)

		yield put(<IStoreTestResult>{type: "STORE_TEST_RESULT", payload: {...result, diffResult, testName: testRequestAction.testCode, timestamp: +new Date()}})
	}
}
