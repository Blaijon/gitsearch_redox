import React, { Component } from 'react'
import './SearchPage.css'
import SearchResult from './SearchResult'
import UserViewModal from './UserViewModal'
import axios from 'axios'
import { token } from '../global'
var instance;

var search_timer = null;
class SearchPage extends Component {

    constructor(props){
        super(props);

        this.state = {
            visible: false,
            keyword: '',
            sort: '',
            order: '',
            results: [],
            user: null
        }

        this.modalClose = this.modalClose.bind(this);
        this.userClick = this.userClick.bind(this);

        this.changeKeyword = this.changeKeyword.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeOrder = this.changeOrder.bind(this);

        this.search = this.search.bind(this);

        instance = this;
    }

    modalClose(){
        this.setState({
            visible: false
        })
    }

    changeKeyword(event){

        if(event.target.value !== ''){
            this.setState({
                keyword: event.target.value
            })

            if(search_timer !== null){
                clearTimeout(search_timer);
            }
            search_timer = setTimeout(function(){ instance.search();}, 300);
        }

    }

    changeSort(event){
        var newstate = {
            sort: event.target.value
        };

        if(event.target.value !== ''){
            if(this.state.order === ''){
                newstate['order'] = 'asc';
            }
        }
        this.setState(newstate);

        if(search_timer !== null){
            clearTimeout(search_timer);
        }
        search_timer = setTimeout(function(){ instance.search();}, 300);
    }

    changeOrder(event){
        this.setState({
            order: event.target.value
        })

        if(search_timer != null){
            clearTimeout(search_timer);
        }
        search_timer = setTimeout(function(){ instance.search();}, 300);
    }

    userClick(user){
        this.setState({
            user: user,
            visible: true
        })
    }

    search(){
        if(this.state.keyword === ''){
            this.inKeyword.focus();
            return;
        }

        var url = 'https://api.github.com/search/users?q=' + this.state.keyword + '&per_page=20';
        if(this.state.sort !== ''){
            url = url + '&sort=' + this.state.sort;

            if(this.state.order !== ''){
                url = url + '&order=' + this.state.order;
            }
        }

        var config = {
            headers: {'Authorization': "bearer " + token}
        };

        axios.get(url, config).then(res => {
            var data = res.data;
            instance.setState({
                results: data.items
            })
        })
    }

    render(){

        return (
            <div className="page-search">
                <div className="section-search">
                    <fieldset>
                        <legend>Search Area:</legend>
                        <div>
                            <input type="text" ref={(input) => this.inKeyword = input } value={this.state.keyword} onChange={this.changeKeyword}></input>
                        </div>
                        <div className="search-options">
                            <div>
                                <fieldset>
                                    <legend>Sort</legend>
                                    <select value={this.state.sort} onChange={this.changeSort}>
                                        <option value="">None</option>
                                        <option value="followers">Followers</option>
                                        <option value="repositories">Repositories</option>
                                        <option value="joined">Joined</option>
                                    </select>
                                </fieldset>
                            </div>
                            <div>
                                <fieldset>
                                    <legend>Order</legend>
                                    <select value={this.state.order} onChange={this.changeOrder} disabled={this.state.sort === '' ? true : false }>
                                        <option value="asc">ASC</option>
                                        <option value="desc">DESC</option>
                                    </select>
                                </fieldset>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="section-result">
                    <fieldset>
                        <legend>Search Result:</legend>
                        <SearchResult
                            results={this.state.results}
                            cbClick={(user) => this.userClick(user)}
                        ></SearchResult>
                    </fieldset>
                </div>
                <UserViewModal
                    visible={this.state.visible}
                    user={this.state.user}
                    cbClose={() => this.modalClose()}
                ></UserViewModal>
            </div>
        )
    }
}

export default SearchPage;
