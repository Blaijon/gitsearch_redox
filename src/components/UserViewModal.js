import React, { Component } from 'react'
import './UserViewModal.css'
import { token } from '../global'
import axios from 'axios'



var instance = null;

class UserViewModal extends Component {

    constructor(props){
        super(props);

        this.state={
            user: props.user,
            visible: props.visible,
            followers: [],
            followings: [],
            repos: []
        }

        instance = this;

        this.loadData = this.loadData.bind(this);
    }

    componentDidUpdate(prevProps) {

        if(this.props.user !== null){
            if(prevProps.user === null || this.props.user.id !== prevProps.user.id){
                this.loadData();
            }

        }

        if(this.props.visible !== prevProps.visible){
            this.setState({
                followers: [],
                followings: [],
                repos: []
            })
        }
    }

    loadData(){
        var config = {
            headers: {'Authorization': "bearer " + token}
        };

        var url = '';
        url = this.props.user.followers_url;
        if(url !== ''){
            axios.get(url, config).then(res => {
                instance.setState({
                    followers: res.data
                })
            })
        }

        url = 'https://api.github.com/users/' + this.props.user.login + "/following";
        if(url !== ''){
            axios.get(url, config).then(res => {
                instance.setState({
                    followings: res.data
                })
            })
        }

        url = this.props.user.repos_url;
        if(url !== ''){
            axios.get(url, config).then(res => {
                var repos = res.data;

                if(repos.length > 5){
                    repos = repos.slice(0, 5);
                }

                instance.setState({
                    repos: repos
                })
            })
        }
    }

    render(){

        var modal_class_name = "user-view-modal";
        if(!this.props.visible){
            modal_class_name = "user-view-modal modal--hidden";
        }

        return (
            <div className={modal_class_name}>
                <div className="modal-wrap">
                    <span className="modal-close" onClick={() => this.props.cbClose()}>&times;</span>
                    <div className="modal-container">
                        <div className="user-info">
                            <img alt={this.props.user !== null ? this.props.user.login : "user_avata"} className="user-avata" src={this.props.user !== null ? this.props.user.avatar_url : null}></img>
                            <a rel="noopener noreferrer" target="_blank" href={this.props.user !== null ? this.props.user.html_url : null} className="user-name">{this.props.user != null ? this.props.user.login : null}</a>
                        </div>
                        <div className="user-follows-info">
                            <div className="user-follows-info-col">
                                <fieldset>
                                    <legend>Followers({this.state.followers.length}):</legend>
                                    <div className="users-info-list">
                                    {
                                        this.state.followers.map((follower) => <div key={follower.id}>{follower.login}</div>)
                                    }
                                    </div>
                                </fieldset>
                            </div>
                            <div className="user-follows-info-col">
                                <fieldset>
                                    <legend>Following({this.state.followings.length}):</legend>
                                    <div className="users-info-list">
                                    {
                                        this.state.followings.map((following) => <div key={following.id}>{following.login}</div>)
                                    }
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="user-repos">
                            <fieldset>
                                <legend>Repositories:</legend>
                                <div className="users-info-list">
                                {
                                    this.state.repos.map((repo) => <div key={repo.id}>{repo.name}</div>)
                                }
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserViewModal;
