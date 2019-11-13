// TODO: refactor to use request-promise package??

const request = require('request');

module.exports = {
  fetchRepos: (username, callback) => {
    const options = {
      uri: `https://api.github.com/users/${username}/repos`,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise', // TODO: remove and confirm still works.
        'Authorization': `token ${process.env.TOKEN}`
      }
    };

    request(options, (err, response, body) => {
      if (err) { return callback(err, null); }
      callback(null, body);
    });
  }
}