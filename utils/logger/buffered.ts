import { logsBackend } from './index';
import { ILog } from './contract';
import { last } from '../arrays';

/** The buffer! */
let logs: ILog[] = []

export interface ICheckout {
	logs: ILog[]
	commitTimestamp: number
}

/** Pick logs up until now, with a timestamp to use when commiting */
export const checkoutLogs = (): ICheckout =>
	logs.length ?
		{logs, commitTimestamp: last(logs).timestamp} :
		{logs: [], commitTimestamp: -1}

/** Clears / commits logs up until timestamp, so these are not included in future checkouts */
export const commitLogs = (timestamp) => {logs = logs.filter(x => x.timestamp > timestamp)}

/** Configure the log system to use a buffer for logs, which can be commited to the server from time to time */
export const setupBufferedLogs = () => {
	logsBackend.on("push", (x) => {
		logs.push(x)
	})
}
