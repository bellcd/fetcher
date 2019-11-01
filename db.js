// TODO: change to use promise based mysql package??

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'fetcher',
});

connection.connect((err) => {
  if (err) { throw err; }
  console.log(`Connected to MySQL as id ${connection.threadId}`)
});

const get = (fieldToMatch, tableToMatch, callback) => {
  const entries = Object.entries(fieldToMatch); // TODO: assumes we're matching on only one field ...

  const field = entries[0][0];
  const value = entries[0][1];

  connection.query(`SELECT * FROM ${tableToMatch} WHERE ${field} = ?`, [value], (err, rows, fields) => {
    if (err) { return callback(err, null); }
    callback(null, rows);
  });
}

// TODO: add seperate functions for
  // adding a record
  // updating the fields in an existing record
// use these new functions instead of / in addition to the below functions ...

// dataToAdd is an object of the { fieldNames: data } you want to add to the table. ie, { name: 'Christian', id: 1, fav_food: 'tacos' }
// table is the string name of the table to add this data to
const addRecord = (dataToAdd, table) => {
  const fieldNames = [];
  const values = [];
  const questionMarks = [];

  for (let key in dataToAdd) {
    fieldNames.push(key);
    values.push(dataToAdd[key]);
    questionMarks.push('?');
  }

  // join fieldNames & questionMarks on ", "
  const joinedFieldNames = fieldNames.join(', ');
  const joinedQuestionMarks = questionMarks.join(', ');

  connection.query(`INSERT INTO ${table} (${joinedFieldNames}) VALUES (${joinedQuestionMarks})`, [values], (err, rows, fields) => {
    if (err) { throw err; }

  });
}

const updateRecord =


// TODO: change this to accept any ???
const addOrUpdateUser = (user, tableToMatch, callback) => {
  if (tableToMatch === 'user') {
    ({ id, login, avatar_url, html_url } = user);
  } else if (tableToMatch = 'repo') {
    ({ id, name, html_url, description, updated_at, language } = repo);
    var id_owner = repo.owner.id;
  }

  // check if a record with this id exists
  connection.query(`SELECT id FROM ${tableToMatch} WHERE id = ?`, [id], (err, rows, fields) => {
    if (err) { throw err; }

    if (rows.length > 0) {
      // this id already exists, so update their record
      connection.query(`UPDATE ${tableToMatch}
        SET
          login = ?,
          avatar_url = ?,
          html_url = ?
        WHERE id = ?`,
        [login, avatar_url, html_url, id], (err, rows, fields) => {
          if (err) { throw err; }
          callback(null, rows);
        })
    } else {
      // the user doesn't exist, so create a record
      connection.query(`INSERT INTO ${tableToMatch} (id, login, avatar_url, html_url) values (?, ?, ?, ?)`, [id, login, avatar_url, html_url], (err, rows, fields) => {
        if (err) { throw err; }
        callback(null, rows);
      });
    }
  });
}

// TODO: make this functions more generic
const addOrUpdateRepo = (repo, tableToMatch, callback) => {
  ({ id, name, html_url, description, updated_at, language } = repo);
  const id_owner = repo.owner.id;

  connection.query(`INSERT INTO ${tableToMatch} (id, name, html_url, description, updated_at, language, id_owner) values (?, ?, ?, ?, ?, ?, ?)`, [id, name, html_url, description, new Date(updated_at), language, id_owner], (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  });
}

const addOrUpdateManyUsers = (collectionToAddOrUpdate, tableToMatch, finalCallback) => {
  const fn = tableToMath = 'user' ? addOrUpdateUser : addOrUpdateRepo;

  // base case
    // collectionToAddOrUpdate length is 0, invoke finalCallback
    if (collectionToAddOrUpdate.length === 0) {
      return finalCallback();
    }
  // recursive case
    // save & remove from collectionToAddOrUpdate the first user in collectionToAddOrUpdate
    const element = collectionToAddOrUpdate.shift();

    // invoke fn with that element. fn's callback will be addOrUpdateManyUsers with - the now 1 shorter - collectionToAddOrUpdate array
    fn(element, tableToMatch, (err, rows) => {
      if (err) { throw err; }
      addOrUpdateManyUsers(collectionToAddOrUpdate, tableToMatch, finalCallback);
    });
}

module.exports = {
  connection: connection,
  get,
  addOrUpdateUser,
  addOrUpdateRepo,
  addOrUpdateManyUsers
}