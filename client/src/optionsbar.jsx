const React = require('react');

let OptionsBar = ({ username, handleChange, limit, handleLimitChange, handleSearchForUser }) => {
  return (
    <div className="bar">
      <div>
        <label htmlFor="username">User to search for: </label>
        <input id="username" name="username" type="text" onChange={handleChange} value={username}></input>
      </div>
      <div>
        <label htmlFor="limit">Limit the number of displayed repos to: </label>
        <input id="limit" name="limit" type="number" min="1" max="100" onChange={handleLimitChange} value={limit}></input>
      </div>
      <button onClick={handleSearchForUser}>Get Repos</button>
    </div>
  );
}

export default OptionsBar;