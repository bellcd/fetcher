import React from 'react';

const Repo = ({ repo }) => {
  return (
    <>
      <div className="repo">
      <div className="card-title"><a href={repo.html_url}>{repo.name}</a></div>
      <div>Last Update At: {repo.updated_at}</div>
      </div>
    </>
  );
}

export default Repo;