import React, { Component } from 'react'
import { connect } from 'react-redux'
// import styles from './style.less'

export class Comp_6 extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <>{this.props.yield}66666</>
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

export default connect(mapStateToProps, mapDispatchToProps)(Comp_6)

