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

// TODO: make this function more generic
const addOrUpdateUser = (user, tableToMatch, callback) => {
  ({ id, login, avatar_url, html_url } = user);

  // check if a record with this id exists
  connection.query(`SELECT id FROM ${tableToMatch} WHERE id = ?`, [id], (err, rows, fields) => {
    if (err) { throw err; }

    if (rows.length > 0) {
      // this user already exists, so update their record
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
const addRepo = (repo, tableToMatch, callback) => {
  ({ id, name, html_url, description, updated_at, language } = repo);
  const id_owner = repo.owner.id;

  connection.query(`INSERT INTO ${tableToMatch} (id, name, html_url, description, updated_at, language, id_owner) values (?, ?, ?, ?, ?, ?, ?)`, [id, name, html_url, description, new Date(updated_at), language, id_owner], (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  });
}

const addOrUpdateManyUsers = (usersToAdd, tableToMatch, finalCallback) => {
  // base case
    // usersToAdd length is 0, invoke finalCallback
    if (usersToAdd.length === 0) {
      return finalCallback();
    }
  // recursive case
    // save & remove from usersToAdd the first user in usersToAdd
    const user = usersToAdd.shift();

    // invoke addOrUpdateUser with that user. addOrUpdateUser's callback will be addOrUpdateManyUsers with - the now 1 shorter - usersToAdd array
    addOrUpdateUser(user, tableToMatch, (err, rows) => {
      if (err) { throw err; }
      addOrUpdateManyUsers(usersToAdd, tableToMatch, finalCallback);
    });
}

module.exports = {
  connection: connection,
  get,
  addOrUpdateUser,
  addRepo,
  addOrUpdateManyUsers
}