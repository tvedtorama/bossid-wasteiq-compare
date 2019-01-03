import {withRouter} from 'react-router'
import * as React from 'react'

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

// Inserts the router's path as a "path" prop.  Code based on something copied from React-router's withRouter function
export function withPath(WrappedComponent): React.ClassicComponentClass<any> {
	const WithPath = (props) => <WrappedComponent {...props} path={(props.routes || []).filter(x => x.path).reduce((x, y) => x + y.path, '')} />

	let wrappedAny = WithPath as any
	wrappedAny.displayName = `withPath(${getDisplayName(WrappedComponent)})`
	wrappedAny.WrappedComponent = WrappedComponent

	const hoistStatics = require('hoist-non-react-statics') // Import moved here as there are weird issues with Safari and module variables.

	return withRouter(hoistStatics(WithPath, WrappedComponent))
}
