const React = require('react');

let OptionsBar = ({ handleChange, handlesearchForUser }) => {
  return (
    <div className="bar">
      <div>
        <label htmlFor="username">User to search for</label>
        <input id="username" name="username" type="text" onChange={handleChange}></input>
      </div>
      <button onClick={handlesearchForUser}>Get Repos</button>
    </div>
  );
}

export default OptionsBar;