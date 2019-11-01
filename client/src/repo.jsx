import React from 'react';

const Repo = ({ repo }) => {
  console.log('repo: ', repo);
  return (
    <div>{repo.name}</div>
  );
}

export default Repo;