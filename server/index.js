const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const helpers = require('../helpers/github.js');
const db = require('../database/index.js');

let app = express();


app.use(express.static(__dirname + '/../client/dist'));
app.use(cors());
app.use(bodyParser());

// This route should take the github username provided and get the repo information from the github API, then save the repo information in the database
app.post('/repos', function (req, res) {
  console.log(`req.body: `, req.body);
  const term = req.body.term;

  // ({ term } = { req.body }) // TODO: why does this syntax not work ??

  helpers.getReposByUsername(term, (err, data) => {
    if (err) { return console.log(err); }
    db.save(data, (err, data) => {
      if (err) { return console.log(err); }
      console.log('data saved!'); // TODO: send some response to the client? to let it know the data was saved??
    });
  });
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos

  // so we can log the documents that were just added
  db.find((err, repos) => {
    if (err) { return console.log(err); }

    // sorting in place without making a copy, acceptable here??
    repos.sort((a, b) => {
      return b.updated_at - a.updated_at;
    });

    // slice the top 25 repos
    const top25Repos = repos.slice(0, 26);

    res.send(JSON.stringify(top25Repos));
  })
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

