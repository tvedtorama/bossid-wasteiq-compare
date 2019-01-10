import * as React from 'react'
import { runTest } from '../sagas/runner';
import { connect } from 'react-redux';
import { IState } from '../IState';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import {Button, Paper} from '@material-ui/core';
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
			<Paper className="test-buttons">
				<Button onClick={() => this.props.runTest("containerEvents")} variant="contained" color="primary"><span>Container Events</span></Button>
				<Button onClick={() => this.props.runTest("intervalTree S1")} variant="contained" color="primary"><span>Interval Tree (T1)</span></Button>
				<Button onClick={() => this.props.runTest("intervalTree S2")} variant="contained" color="primary"><span>Interval Tree (T2)</span></Button>
			</Paper>
			<Paper className="test-results">
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
			</Paper>
		</div>
	}
}

export const TestList = connect((x: IState) => ({results: x.testResults}), methods)(TestListRaw)
