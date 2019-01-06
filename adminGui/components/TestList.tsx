import * as React from 'react'
import { runTest } from '../sagas/runner';
import { connect } from 'react-redux';
import { IState } from '../IState';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import 'react-gh-like-diff/lib/diff2html.min.css';

const methods = {
	runTest,
}

type IMangledProps = {results: IState["testResults"]} & typeof methods

export class TestListRaw extends React.Component<IMangledProps, {toggles: {[index: number]: boolean}}> {
	constructor(x) {
		super(x)

		this.state = {toggles: {}}
	}
	toggle(someId: number) {
		this.setState({toggles: {...this.state.toggles, [someId]: !this.state.toggles[someId]}})
	}
	render() {
		return <div className="test-list">
			<a onClick={() => this.props.runTest("testx")}><span>Hei</span></a>
			<ul>
				{this.props.results.map((r, i) =>
					<li key={i}>
						<div className={"test-result"}>
							<header>
								<span className={"timestamp"}>{new Date(r.timestamp).toISOString()}</span>
								<span className={"test-name"}>{r.testName}</span>
								<a onClick={() => this.toggle(r.timestamp)}>Toggle</a>
							</header>
							{
								this.state.toggles[r.timestamp] &&
									<ReactGhLikeDiff diffString={r.diffResult} />
							}
						</div>
					</li>)}
			</ul>
		</div>
	}
}

export const TestList = connect((x: IState) => ({results: x.testResults}), methods)(TestListRaw)
