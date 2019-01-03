import { put, spawn } from "redux-saga/effects";
import { Action } from "redux";
import { IInitData } from "../IState";
import { Api } from "../api";
import { fetchStartData } from "../actions/getStartData";

export const INIT_INIT_DATA = "INIT_INIT_DATA"
export const INIT_SET_TOKEN = "INIT_SET_TOKEN"

export const setToken = (token: string) => (<Action & Partial<IInitData>>{type: INIT_SET_TOKEN, token})

// https://stackoverflow.com/a/15724300/2684980
const getCookie = (name: string) =>
	["; " + document.cookie].
		map(value => value.split("; " + name + "=")).
		map(parts =>
			(parts.length === 2) ? parts.pop().split(";").shift() : null)
	[0]

export function* init() {
	const token = getCookie("token")

	if (!token)
		return // Temp fix when token is not present (user not logged in)

	yield put({type: INIT_INIT_DATA, token})

	// ATW this is passed in through actions, and called when startdata is loaded.
	const whenLoadingIsDoneCallback = () => console.log("loading is done")

	if (!token)
		console.error("No token set, login first!")

	const api = new Api(token)

	// Use spawn to avoid crashes in the forked activities to take down this activity
	yield spawn(fetchStartData, api, whenLoadingIsDoneCallback)
}
