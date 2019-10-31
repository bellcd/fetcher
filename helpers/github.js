// TODO: refactor to use request-promise package??

const request = require('request');
const config = require('../config.js');

module.exports = {
  fetchRepos: (username, callback) => {
    const options = {
      uri: `https://api.github.com/users/${username}/repos`,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise', // TODO: is this header needed?
        'Authorization': `token ${config.TOKEN}`
      }
    };

    request(options, (err, repos) => {
      if (err) { return callbak(err, null); }
      callback(null, repos);
    });
  }
}