import * as React from 'react'
import axios from 'axios'
const ReactMarkdown = require('react-markdown')

interface IProps {
	url: string
}

interface ICompState {
	content: string
}

/** Loads markdown from an URL and renders when done */
export class MarkdownLoader extends React.Component<IProps, ICompState> {
	async componentDidMount() {
		const result = await axios.get(this.props.url, {responseType: "text"})
		this.setState({content: result.data})
	}

	render() {
		if (!(this.state && this.state.content))
			return <div className="content-loading" />
		return <ReactMarkdown source={this.state.content} />
	}
}