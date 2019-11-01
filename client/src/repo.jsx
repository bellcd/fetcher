import React from 'react';

const Repo = ({ repo }) => {
  console.log('repo: ', repo);
  return (
    <>
      <div>
      <span>{repo.name}</span>
      <span>{repo.updated_at}</span>
      </div>
    </>
  );
}

export default Repo;