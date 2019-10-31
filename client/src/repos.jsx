import React from 'react';

const Repos = ({ repos }) => {
  const repoList = repos.map(repo => {
    return <Repo repo={repo}></Repo>
  });

  return (
    <>
    <div>There are {repos.length} repos</div>
    {repoList}
    </>

  );
}

export default Repos;