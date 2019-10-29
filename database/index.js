const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('mongoose connection established!')
});


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

let save = (repos, callback) => {
  // TODO: Your code here
  // This function should save a repo or repos to the MongoDB

  let docs = repos.map(repo => {
    // console.log('repo: ', repo);

    return {
      id: repo.id,
      name: repo.name,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      description: repo.description,
      owner_login: repo.owner.login,
      owner_id: repo.owner.id,
      owner_html_url: repo.owner.html_url,
      owner_avatar_url: repo.owner.avatar_url
    }
  });

  // console.log('docs: ', docs);

  Repo.create(docs, (err, ...docs) => {
    if (err) { return callback(err, null); }
    callback(null, docs);
  });
}

let find = (callback) => {
  Repo.find((err, data) => {
    if (err) { return callback(err, data) }
    console.log(null, data);
  })
}

module.exports.save = save;
module.exports.find = find;