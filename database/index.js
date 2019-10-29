const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

// TODO: add handling for a database connection error

// TODO: is the keyword new needed here??
let repoSchema = mongoose.Schema({
  // TODO: your schema here!

  id: Number,
  name: String,
  updated_at: { type: Date }, // TODO: this will be the value to filter top25 most recent repos on ...
  html_url: String,
  description: String,

  // information about the owner of the repo, will be the same for repos that have the same owner
  owner_login: String,
  owner_id: Number,
  owner_html_url: String,
  owner_avatar_url: String

});

let Repo = mongoose.model('Repo', repoSchema);

let save = (repos) => {
  // TODO: Your code here
  // This function should save a repo or repos to the MongoDB

  // iterate over repos, saving each to the MongoDB database

}

module.exports.save = save;