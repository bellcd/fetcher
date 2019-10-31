const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 1128;

const helpers = require('./helpers/github.js');

app.use(cors());
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(bodyParser.json());

app.post('/repos', (req, res, next) => {
  helpers.fetchRepos(req.body.username);
})

app.listen(PORT, () => { console.log(`App is running on port ${PORT}`)});