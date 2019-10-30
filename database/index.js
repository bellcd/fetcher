const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('mongoose connection established!')
});


// TODO: add handling for a database connection error
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
  let docs = [];

  // TODO: feels like Mongoose would have a prebuilt solution for checking for duplicates when adding a collection of documents ...
  for (let i = 0; i < repos.length; i++) {
    let repo = repos[i];

    let doc = {
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

    // OPTION 1, possible to send responses back to the front end after each callback finishes??
    // OPTION 2, can the array that Mongoose's Repo.create() accepts handle null OR {} as elements??
    // OPTION 3 ???

    // TODO: Use a Mongo composite key so that it cheks the id along with the updated_at date as the unique identifier
    Repo.findOne({ id: doc.id }, (err, data) => {
      if (err) { return console.log(err); }

      // the db doesn't already contain a document for that repo, so add it to the array that will get added to the db
      if (data === null) {
        docs.push(doc);
      } else {
        // the repo already exists in the db, do DO NOT add it
      }

      // we've filtered the list of repos to only non-duplicates, so now we can add them to the db
      if (i === repos.length - 1) { // TODO: need to change this such that the counter accessible to all of the callbacks is the same number, that gets incremented after each repo is either found or not in the db
        Repo.create(docs, (err, ...docs) => {
          if (err) { return callback(err, null); }
          callback(null, docs);
        });
      };
    });
  }
}

let find = (callback) => {
  Repo.find((err, data) => {
    if (err) { return callback(err, null) }
    callback(null, data);
  })
}

module.exports.save = save;
module.exports.find = find;