import React from 'react';
import Repo from './repo.jsx';

const Repos = ({ repos }) => {
  const repoList = repos.map(repo => <Repo key={repo.id} repo={repo}></Repo>);

  return (
    <>
      <h4>There are {repos.length} repos</h4>
      <div className="repos">
        {repoList}
      </div>
    </>

  );
}

export default Repos;