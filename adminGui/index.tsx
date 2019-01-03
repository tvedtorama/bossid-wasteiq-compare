import {WebMain} from './components/WebMain';
import {createStore} from './createStore'
import {setupBufferedLogs} from '../utils/logger/buffered'
import { setToken } from './sagas/init';
import { runInitActions, render } from './commonInit';

setupBufferedLogs()

const initialReactProps = (window as any).initialReactProps

const store = createStore();

runInitActions(initialReactProps, store, [
		initialReactProps.jwt && setToken(initialReactProps.jwt)
	])

if (!store.getState().initData.token && window.location.href.indexOf("whoAreYouResponse") === -1)
	window.location.href = "/whoAreYou"

render(store, WebMain)

if (module.hot) {
	module.hot.accept('./components/WebMain', () => {
		const NextApp = require("./components/WebMain").WebMain;
		render(store, NextApp)
	})
	// module.hot.accept() This could also work, but not as well...
}
