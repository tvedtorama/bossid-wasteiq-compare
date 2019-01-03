import { fork } from 'redux-saga/effects'
import { init } from './init';
import { delay } from 'redux-saga';

export const START_COMMAND_PROCESS = "START_COMMAND_PROCESS"

export const mainLoop = function*(): any {
	yield fork(init)

	yield delay(0) // Yield to allow the basic `init` to complete

	console.log("MAIN LOOP HAS LEFT THE BUILDING")
}
