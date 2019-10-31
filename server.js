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

    db.get({ login: 'christian' }, 'users', (err, rows) => {
      // TODO: save repos to the db ...
      if (err) { res.status(400).send(err); }

      // TODO: need to return either a positive or negative status code

      console.log(`rows`, rows);
    });
  });
});

app.listen(PORT, () => { console.log(`App is running on port ${PORT}`)});