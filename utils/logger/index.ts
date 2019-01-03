import { EventEmitter } from "events";
import { ILog } from "./contract";

class LoggerBackend extends EventEmitter {
	push(x: ILog) {
		this.emit("push", x)
	}
}

/** Event emitter that raises a "push" event when new logs are pushed */
export const logsBackend = new LoggerBackend()

class Logger implements Partial<Console> {
	pushIt(message, params, level: string) {
		const timestamp = +new Date()
		logsBackend.push(<ILog>{level, timestamp, message, params, namespace: this._namespace})
	}

	error(message?: any, ...optionalParams: any[]): void {
		this.pushIt(message, optionalParams, "ERROR")
	}
	info(message?: any, ...optionalParams: any[]): void {
		this.pushIt(message, optionalParams, "INFO")
	}
	log(message?: any, ...optionalParams: any[]): void {
		this.pushIt(message, optionalParams, "LOG")
	}
	trace(message?: any, ...optionalParams: any[]): void {
		this.pushIt(message, optionalParams, "TRACE")
	}
	warn(message?: any, ...optionalParams: any[]): void {
		this.pushIt(message, optionalParams, "WARN")
	}

	constructor(private _namespace: string) {}
}

export default (namespace: string) => {
	return <Partial<Console>>new Logger(namespace)
}
