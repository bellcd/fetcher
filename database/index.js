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

  // map to a new array of objects with only the properties I want
  // recursive fn
    // base case, array of objects to check is empty, call final callback
    // recursive case
      // invoke findOne() with if conditionals for updateOne()
        // if data is null, document does NOT exist
          // invoke create() with the current document
          // in create's callback, invoke recursiveFn with the array of objects minus the one we just dealt with
        // else if data is a document
          // if document's updated_at property is NOT equal to this obj's updated_at property, the document needs to be updated
            // invoke update() with the current document
            // in update's callback, invoke recursiveFn with the array of objects minus the one we just dealt with
          // else if updated both updated_at properties are equal, the obj is a duplicate of an already existing document
            // invoke recursiveFn with the array of objects minus the one we just dealt with


  const recursiveFn = () => {

  }

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


    Repo.findOne({ id: doc.id }, (err, data) => {
      if (err) { return console.log(err); }

      // the db doesn't already contain a document for that repo, so add it to the array that will get added to the db
      if (data === null) {
        docs.push(doc);

      // TODO: Refactor to use a Mongo composite key
      } else {
        // the repo already exists in the db, check if the updated_at date of the document in the db matches the updated_at date of the object coming in from the API call
        if (data.updated_at === doc.updated_at) {
          // it's the same repo, do nothing
        } else {
          // the repo has been updated, replace the document in the db with the new document from the API call
          Repo.updateOne({ id: doc.id }, data) ;
        }
      }

      // we've filtered the list of repos to only non-duplicates, so now we can add them to the db
      if (i === repos.length - 1) {
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