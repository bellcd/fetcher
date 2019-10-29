import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    }

  }

  componentDidMount() {
    $.ajax({
      url: `http://localhost:1128/repos`,
      method: 'GET',
      dataType: 'json',
      success: (repos) => {
        this.setState({
          repos
        });
      },
      error: (err) => {
        throw(err) // TODO: handle this error??
      }
    });
  }

  search (term) {
    console.log(`${term} was searched`);
    // TODO
    $.ajax({
      url: `http://localhost:1128/repos`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ term }),
      success: () => {
        console.log('data sent to server')
      },
      error: () => {
        console.log('error');
      }
    })
  }

  render () {
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos}/>
      <Search onSearch={this.search.bind(this)}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));