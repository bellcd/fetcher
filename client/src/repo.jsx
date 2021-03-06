import React from 'react';

const Repo = ({ repo, i }) => {
  return (
    <>
      <span className="repo">
        <span className="card-title"><a href={repo.html_url}><h3>{repo.name}</h3></a></span>
        <span>Last Update At: {repo.updated_at}</span>
        <span className="number-of-repos">{i + 1}</span>
      </span>
    </>
  );
}

export default Repo;