import React from 'react';
import ReactDOM from 'react-dom';
import Repos from './repos.jsx';
import $ from 'jquery';

import OptionsBar from './optionsbar.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    let url;
    if (process.env.API_URL) {
      url = `${process.env.API_URL}${process.env.API_PORT ? `:${process.env.API_PORT}` : ''}`;
    } else {
      url = `https://infinite-dusk-78362.herokuapp.com`;
    }

    this.state = {
      username: '',
      limit: 10,
      url: url,
      repos: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.searchForUser = this.searchForUser.bind(this);
    this.fetchRepos = this.fetchRepos.bind(this);
  }

  handleChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleLimitChange(e) {
    this.setState({
      limit: e.target.value
    });
  }

  componentDidMount() {
    this.fetchRepos();
    console.log('this.state.url: ', this.state.url);
    console.log('process: ', process);
    console.log('process.env.API_URL: ', process.env.API_URL);
    console.log('process.env.API_PORT: ', process.env.API_PORT);
  }

  fetchRepos() {
    $.ajax({
      url: `${this.state.url}/repos`,
      method: 'GET',
      data: { limit: this.state.limit },
      dataType: 'json',
      success: (res) => {
        this.setState({
          repos: res
        })
      },
      error: (err) => {
        console.log(`error: ${err}`)
      }
    })
  }

  searchForUser() {
    $.ajax({
      url: `${this.state.url}/repos`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ username: this.state.username }),
      success: (res) => {
        console.log('username search successfully sent.')
        this.fetchRepos();
      },
      error: (err) => {
        if (err) { console.log(err); }
      }
    })
  }

  render() {
    return (
      <>
        <h1>Fetcher</h1>
        <h2>(It fetches info about Github Repos)</h2>
        <OptionsBar
          username={this.state.username}
          handleChange={this.handleChange}
          limit={this.state.limit}
          handleLimitChange={this.handleLimitChange}
          handleSearchForUser={this.searchForUser}
        >
        </OptionsBar>
        <Repos repos={this.state.repos}></Repos>
      </>
    )
  }
}

ReactDOM.render(<App></App>, document.getElementById('root'));