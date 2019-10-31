const rp = require('request-promise');
const config = require('./config.js');

module.exports = {
  fetchRepos: (username) => {
    // TODO: remember to return a promise with the results!

    const options = {
      uri: `https://api.github.com/users/${username}/repos`,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise', // TODO: is this header needed?
        'Authorization: token': config.PERSONAL_ACCESS_TOKEN
      }
    ;}

    rp(options)
      .then(repos => {

      })
      .catch(err => {
        console.log(err);
      })
  }
}