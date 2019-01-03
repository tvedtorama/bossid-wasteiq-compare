import { Api, IStore } from "../api";
import { GENERIC_PROCESS_START, GENERIC_PROCESS_COMPLETED } from "./genericProcess";
import { put, call } from "redux-saga/effects";
import { Action } from "redux";
import { flattenItems, theFakeRoot } from "./flattenItems";
import { pick } from "../../utils/objects";

export const START_DATA_GENERIC_PROCESS_KEY = "START_DATA"
export const FETCH_STORE_SUCCESS = "FETCH_STORE_SUCCESS"

export function fetchOrgSuccess(fullStore: Partial<IStore>): Action {
	return <Action>{
		type: FETCH_STORE_SUCCESS,
		org: <Partial<IStore>>(pick(fullStore, Api.storeFieldList)),
	}
}

export function* fetchStartData(api: Api, doneCallback: () => void): Iterator<any> {
	yield put({type: GENERIC_PROCESS_START, key: START_DATA_GENERIC_PROCESS_KEY})
	try {
		const x = yield call(() => api.getStartItems())
		yield put(fetchOrgSuccess(x.store))
		doneCallback()
	} finally {
		yield put({type: GENERIC_PROCESS_COMPLETED, key: START_DATA_GENERIC_PROCESS_KEY})
	}
}
