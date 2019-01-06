import * as React from 'react'
import { TestList } from './TestList';

// Note: Create a styles root React node that loads the styles and holds back other rendering until ready.  Styles and data will be loaded at parallel.
const sassModule = import(/* webpackChunkName: "styles" */ '../../sass/index.scss')

/**
 * This class is the root of a web application.  It was added mostly because it seemed that react-hot-loader seemed to require it.
 * Not sure if it did, not sure if it works at all at the moment.
 */
export class WebMain extends React.Component<{store: any}, {counter: number}> {
	constructor(props: {store: any}) {
		super(props)
	}

	render() {
		return <div className="all-of-the-world"><TestList /></div>
	}
}
