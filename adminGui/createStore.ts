import {IState} from './IState'
import {createStore as reduxCreateStore, applyMiddleware, Store, compose} from 'redux'
import {default as reducer} from './reducers'
import {default as createSagaMiddleware} from 'redux-saga'
import {actionCreators} from './utils/devToolsActionCreators'

import {mainLoop} from './sagas/mainLoop'

export function createStore(): Store<IState> {
	const windowMod = window as any
	const sagaMiddleware = createSagaMiddleware()
	const store = reduxCreateStore<IState, any, any, any>(reducer,
			compose(applyMiddleware(sagaMiddleware), windowMod.__REDUX_DEVTOOLS_EXTENSION__ ? windowMod.__REDUX_DEVTOOLS_EXTENSION__({actionCreators}) : f => f) as any)

	sagaMiddleware.run(mainLoop)

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextReducer = require('./reducers').default
			store.replaceReducer(nextReducer)
		})
	}

	return store
}
