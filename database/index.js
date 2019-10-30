const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('mongoose connection established!')
});


// TODO: add handling for a database connection error
let repoSchema = mongoose.Schema({
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
  const objects = repos.map(repo => {
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

  // recursive fn
  // TODO: this fn mutates the objects array that it is passed ... better workflow???
  const recursiveFn = (objects, callback) => {
    // base case, array of objects to check is empty, call final callback
    if (objects.length === 0) {
      callback(); // TODO: what to send back to the POST route??
    } else {
      // recursive case

      // invoke findOne() for the first element in the objects array
      Repo.findOne({ id: objects[0].id }, (err, data) => {
        if (err) {
          console.log(err);
          recursiveFn(objects.slice(1), callback);
          return;
        }

        // if data is null, document does NOT exist
        if (data === null) {
          // invoke create() with the current object
          Repo.create(objects[0], (err) => {
            if (err) console.log(err);

            // in create's callback, invoke recursiveFn with the array of objects minus the one we just dealt with
            recursiveFn(objects[0].slice(1), callback);
          });

        // TODO: Refactor to use a Mongo composite key
        } else {
          // else if data is a document
          // if document's updated_at property is NOT equal to this obj's updated_at property, the document needs to be updated
          if (data.updated_at !== objects[0].updated_at) {
            // invoke updateOne() with the current document
            Repo.updateOne({ id: objects[0].id }, objects[0], (err) => {
              if (err) console.log(err);

              // in updateOne's callback, invoke recursiveFn with the array of objects minus the one we just dealt with
              recursiveFn(objects.slice(1), callback);
            });
          } else {
            // else, both updated_at properties are equal, the obj is a duplicate of an already existing document
            // invoke recursiveFn with the array of objects minus the one we just dealt with
            recursiveFn(obejcts.slice(1), callback);
          }
        }
      });
    }
  }

  recursiveFn(objects, callback);
}

let find = (callback) => {
  Repo.find((err, data) => {
    if (err) { return callback(err, null) }
    callback(null, data);
  })
}

module.exports.save = save;
module.exports.find = find;