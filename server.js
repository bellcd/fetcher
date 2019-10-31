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
  helpers.fetchRepos(req.body.username)
    .then(repos => {
      // TODO: save repos to the db ...
    })
    .catch(err => {
      console.log(err);
      res.status(400);
      res.send(err); // TODO: this doesn't seem to be sending the error object to the client ...
    })

    // TODO: need to return either a positive or negative status code
})

app.listen(PORT, () => { console.log(`App is running on port ${PORT}`)});