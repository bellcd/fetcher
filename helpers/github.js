const rp = require('request-promise');
const config = require('../config.js');

module.exports = {
  fetchRepos: (username) => {
    // TODO: remember to return a promise with the results!

    const options = {
      uri: `https://api.github.com/users/${username}/repos`,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise', // TODO: is this header needed?
        'Authorization': `token ${config.TOKEN}`
      }
    };

    return rp(options)
      .then(repos => {
        return repos;
      })
      .catch(err => {
        throw err;
      })
  }
}