import { fork } from 'redux-saga/effects'
import { init } from './init';
import { delay } from 'redux-saga';
import { testRunner } from './runner';

export const START_COMMAND_PROCESS = "START_COMMAND_PROCESS"

export const mainLoop = function*(): any {
	yield fork(init)

	yield delay(0) // Yield to allow the basic `init` to complete

	yield* testRunner()
}
