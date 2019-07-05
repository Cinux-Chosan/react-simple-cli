import React from 'react'
import { connect } from 'react-redux'
export class Home extends React.Component {
    render() {
        return <div>
        {this.props.data}
            {this.props.yield}
        </div>
    }
}

const mapStateToProps = ({ data }) => ({ data })

export default connect(mapStateToProps)(Home)