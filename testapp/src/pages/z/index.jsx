import React, { Component } from 'react'
import { connect } from 'react-redux'
// import styles from './style.less'

export class Z extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <>{this.props.yield}</>
    }
}

const mapStateToProps = () => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return  {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Z)

