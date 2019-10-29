import React from 'react';

const Repo = (props) => (
  <div>
    <a href={props.repo.html_url}>{props.repo.name}</a>
  </div>
)

export default Repo