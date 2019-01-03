export interface ILog {
	timestamp: number
	namespace: string
	level: string
	message: any
	params: any
}
