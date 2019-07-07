import React, { Component } from 'react'
// import styles from './style.less'

export default class extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <>{this.props.yield}</>
    }
}
