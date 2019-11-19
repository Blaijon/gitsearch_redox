import React, { Component } from 'react'
import './SearchResult.css'

function TableRow(props){
    return (
        <div className="table-row" onClick={() => props.cbClick(props.user)}>
            <div className="table-col table-col-avatar">
                <img alt={props.user.login} className="avata-img" src={props.user.avatar_url} />
            </div>
            <div className="table-col table-col-name">{props.user.login}</div>
        </div>
    )
}

class SearchResult extends Component {

    render(){

        return (
            <div className="search-result-table">
                <div className="table-header">
                    <div className="table-row">
                        <div className="table-col table-col-avatar">Avatar</div>
                        <div className="table-col table-col-name">Name</div>
                    </div>
                </div>
                <div className="table-body">
                    {
                        this.props.results.map((user) => (<TableRow cbClick={() => this.props.cbClick(user) } key={user.id} user={user}></TableRow>))
                    }
                </div>
            </div>
        )
    }
}

export default SearchResult;
