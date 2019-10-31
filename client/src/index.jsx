import React from 'react';
import ReactDOM from 'react-dom';
import Repos from './repos.jsx';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      repos: [

      ]
    }

    this.handleChange = this.handleChange.bind(this);
    this.getRepos = this.getRepos.bind(this);
  }

  handleChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  getRepos() {
    // TODO: ...
    $.ajax({
      url: `http://localhost:1128/repos`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ username: this.state.username }),
      success: (res) => {
        console.log('username search successfully sent.')
      },
      error: (err) => {
        if (err) { console.log(err); }
      }
    })
  }

  render() {
    return (
      <>
        <div>GitHub Repos</div>
        <Repos repos={this.state.repos}></Repos>
        <div>
          <label htmlFor="username">User to search for</label>
          <input id="username" name="username" type="text" onChange={this.handleChange}></input>
        </div>
        <button onClick={this.getRepos}>Get Repos</button>
      </>
    )
  }
}

ReactDOM.render(<App></App>, document.getElementById('root'));