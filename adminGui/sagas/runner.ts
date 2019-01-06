import { take, select, call } from "redux-saga/effects";
import { Api } from "../api";
import { IState } from "../IState";
import { containerEvents } from "../tests/containerEvents";

const jsdiff = require("diff")

const tests = {
	"testx": containerEvents
}

interface IRunTest {
	type: "RUN_TEST"
	testCode: keyof typeof tests
}

export const runTest = (testCode: IRunTest["testCode"]): IRunTest => ({
	type: "RUN_TEST",
	testCode,
})

export const RUN_TEST: IRunTest["type"] = "RUN_TEST"

const pretty = (a: any) => JSON.stringify(a, null, 2)

export const testRunner = function*() {
	const state = <IState>(yield select())
	const api = new Api(state.initData.token)

	// Map of actions - each linking to a test runner.  Run the test, put the result in state, including diff result - render the result.  Open dialog with diff.

	while (true) {
		yield take(RUN_TEST)

		const args = {
			// Move to action
			startTimeIso: "2018-11-01T07:51:15.000Z",
			endTimeIso: "2018-12-22T07:51:15.000Z"
		}

		const result: Tests.ITestResultCore = yield call(containerEvents, api, args)
		const diffResult = jsdiff.createTwoFilesPatch("BossID", "WasteIQ", pretty(result.bossID), pretty(result.wasteIQ))
		console.log("Diff Result", diffResult)
	}
}