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
    this.updateTop25Repos();
  }

  // TODO: why does this function not need to be bound? (setState call inside it ...)
  updateTop25Repos() {
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
      dataType: 'text', // TODO: why does success() not fire when this is set to json??
      success: () => {
        console.log('data successfully sent to server');
        this.updateTop25Repos(); // TODO: this seems to cause a brief flash, visible to the end user. How do I prevent this ??
      },
      error: (err) => {
        console.log(err);
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