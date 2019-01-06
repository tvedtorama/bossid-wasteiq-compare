import * as React from 'react'
import { runTest } from '../sagas/runner';
import { connect } from 'react-redux';

const methods = {
	runTest,
}

type IMangledProps = {} & typeof methods

export class TestListRaw extends React.Component<IMangledProps> {
	render() {
		return <div className="test-list">
			<a onClick={() => this.props.runTest("testx")}><span>Hei</span></a>
		</div>
	}
}

export const TestList = connect(x => ({}), methods)(TestListRaw)
