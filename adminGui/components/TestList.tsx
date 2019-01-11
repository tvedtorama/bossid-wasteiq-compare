import * as React from 'react'
import { runTest, ITestArgs, ITestCodes } from '../sagas/runner';
import { connect } from 'react-redux';
import { IState } from '../IState';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import {Button, Paper, TextField, withStyles, StyledComponentProps, StyleRulesCallback} from '@material-ui/core';
import 'react-gh-like-diff/lib/diff2html.min.css';
import { ButtonProps } from '@material-ui/core/Button';

const methods = {
	runTest,
}

type IMangledProps = {results: IState["testResults"]} & typeof methods & StyledComponentProps

const day = 24 * 3600 * 1000

const defaultStartDate = Math.floor(+new Date() / day) * day

const styles: StyleRulesCallback = theme => ({
	settings: {
		display: "flex",
		flexDirection: "row",
	},
	textField: {
		width: 200,
	},
});

interface IPropState {
	args: Partial<ITestArgs>
	valid: boolean
	toggles: {[index: number]: boolean}
}

export class TestListRaw extends React.Component<IMangledProps, IPropState> {
	constructor(x) {
		super(x)

		this.state = {
			toggles: {},
			args: {
				startTimeIso: new Date(defaultStartDate - day * 2).toISOString(),
				endTimeIso: new Date(defaultStartDate + day * 1).toISOString(),
			},
			valid: true,
		}
	}

	setDate(field: Extract<keyof ITestArgs, "startTimeIso" | "endTimeIso">, value: string) {
		const newArgs = {...this.state.args, [field]: `${value}T00:00:00.000Z`}
		// const validated = {...newArgs, valid: +new Date(newArgs.endTimeIso) > +new Date(newArgs.startTimeIso)}
		this.setState({args: newArgs, valid: +new Date(newArgs.endTimeIso) > +new Date(newArgs.startTimeIso)})
	}

	toggle(someId: number) {
		this.setState({toggles: {...this.state.toggles, [someId]: !this.state.toggles[someId]}})
	}
	render() {
		const {classes} = this.props
		const buttonProps = (testCode: ITestCodes): ButtonProps => ({
			variant: "contained",
			color: "primary",
			onClick: () => this.props.runTest(testCode, this.state.args),
			disabled: !this.state.valid,
		})
		return <div className="test-list">
			<Paper className={classes.settings + " settings"}>
				<TextField
					label="Start Time"
					onChange={(e) => this.setDate("startTimeIso", e.target.value)}
					type="date"
					value={this.state.args.startTimeIso.substr(0, 10)}
					className={classes.textField}
					InputLabelProps={{
						shrink: true,
					}} />
				<TextField
					onChange={(e) => this.setDate("endTimeIso", e.target.value)}
					label="End Time"
					type="date"
					value={this.state.args.endTimeIso.substr(0, 10)}
					className={classes.textField}
					InputLabelProps={{
						shrink: true,
					}} />

			</Paper>
			<Paper className="test-buttons">
				<Button {...buttonProps("containerEvents")}><span>Container Events</span></Button>
				<Button {...buttonProps("intervalTree S1")}><span>Interval Tree (T1)</span></Button>
				<Button {...buttonProps("intervalTree S2")}><span>Interval Tree (T2)</span></Button>
			</Paper>
			<Paper className="test-results">
				<ul>
					{this.props.results.map((r, i) =>
						<li key={i}>
							<div className={"test-result"}>
								<header>
									<span className={"timestamp"}>{new Date(r.timestamp).toISOString()}</span>
									<span className={"test-name"}>{r.testName}</span>
									<a onClick={() => this.toggle(r.timestamp)}>Show Diff</a>
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

export const TestList = withStyles(styles)(connect((x: IState) => ({results: x.testResults}), methods)(TestListRaw))
