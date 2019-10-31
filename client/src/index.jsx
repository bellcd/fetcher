import React from 'react';
import ReactDOM from 'react-dom';
import Repos from './repos.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      repos: [

      ]
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  searchForUsername() {
    // TODO: ...
  }

  render() {
    return (
      <>
        <div>GitHub Repos</div>
        <Repos repos={this.state.repos}></Repos>
        <div>
          <label for="username">User to search for</label>
          <input id="username" name="username" type="text" onChange={this.handleChange}></input>
        </div>
      </>
    )
  }
}

ReactDOM.render(<App></App>, document.getElementById('root'));