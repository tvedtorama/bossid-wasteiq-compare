

namespace Tests {
	interface ITestResultCore {
		wasteIQ: string
		bossID: string
	}

	interface ITestResult extends ITestResultCore {
		testName: string
		timestamp: number
		diffResult: string
	}
}