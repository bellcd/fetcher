const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 1128;

const helpers = require('./helpers/github.js');
const db = require('./db.js');

app.use(cors());
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(bodyParser.json());

app.post('/repos', (req, res, next) => {
  helpers.fetchRepos(req.body.username, (err, repos) => {
    if (err) { res.status(400).send(err); }

    // map repos to an array of users
    // TODO: move all of this logic elsewhere ??
    const users = repos.map(repo => {
      return {
        id: repo.owner.id,
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
        html_url: repo.owner.html_url
      }
    });

    // map repos to only the data I need
    repos = repos.map(repo => {
      return {
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description,
        updated_at: repo.updated_at,
        language: repo.language,
        id_owner: repo.owner.id
      }
    });

    db.addOrUpdateManyRecords(users, 'users', () => {
      console.log('finished adding or updating users');
      db.addOrUpdateManyRecords(repos, 'repos', () => {
        console.log('finished adding repos');
        res.status(200).send();
      })
    })

    // TODO: need to test code for updating repos ...
    // TODO: need to return either a positive or negative status code
  });
});

app.get('/repos', (req, res, next) => {
  db.connection.query(`SELECT * FROM repos`, null, (err, repos, fields) => {
    if (err) { throw err; }

    res.status(200).send(JSON.stringify(repos));
  })
});

app.listen(PORT, () => { console.log(`App is running on port ${PORT}`)});