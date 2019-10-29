const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const helpers = require('../helpers/github.js');
const db = require('../database/index.js');

let app = express();


app.use(express.static(__dirname + '/../client/dist'));
app.use(cors());
app.use(bodyParser());

app.post('/repos', function (req, res) {
  console.log(`req.body: `, req.body);
  const term = req.body.term;

  // ({ term } = { req.body })

  helpers.getReposByUsername(term, (err, data) => {
    if (err) { return console.log(err); }
    db.save(data, (err, data) => {
      if (err) { return console.log(err); }
      console.log('data saved!'); // TODO: send some response to the client? to let it know the data was saved??
      db.find((err, data) => {
        if (err) { return console.log(err); }
        console.log(data);
      })
    });
  });

  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

