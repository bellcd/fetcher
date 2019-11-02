import React from 'react';

const Repo = ({ repo }) => {
  return (
    <>
      <div className="repo">
      <span><a href={repo.html_url}>{repo.name}</a></span>
      <span>{repo.updated_at}</span>
      </div>
    </>
  );
}

export default Repo;