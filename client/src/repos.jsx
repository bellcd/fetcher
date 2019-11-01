import React from 'react';
import Repo from './repo.jsx';

const Repos = ({ repos }) => {
  const repoList = repos.map(repo => <Repo key={repo.id} repo={repo}></Repo>);

  return (
    <>
    <div>There are {repos.length} repos</div>
    {repoList}
    </>

  );
}

export default Repos;