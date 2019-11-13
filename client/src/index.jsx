import React from 'react';
import ReactDOM from 'react-dom';
import Repos from './repos.jsx';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);

    let url;
    if (process.env.API_URL) {
      url = `${process.env.API_URL}${process.env.API_PORT ? `:${process.env.API_PORT}` : ''}`;
    } else {
      url = `https://infinite-dusk-78362.herokuapp.com/`;
    }

    this.state = {
      username: '',
      url: url,
      repos: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.searchForUser = this.searchForUser.bind(this);
    this.fetchRepos = this.fetchRepos.bind(this);
  }

  handleChange(e) {
    this.setState({
      username: e.target.value
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
        <div>Fetching GitHub Repos</div>
        <Repos repos={this.state.repos}></Repos>
        <div>
          <label htmlFor="username">User to search for</label>
          <input id="username" name="username" type="text" onChange={this.handleChange}></input>
        </div>
        <button onClick={this.searchForUser}>Get Repos</button>
      </>
    )
  }
}

ReactDOM.render(<App></App>, document.getElementById('root'));