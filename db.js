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
const addUser = (user, tableToMatch, callback) => {
  ({ id, login, avatar_url, html_url } = user);

  connection.query(`INSERT INTO ${tableToMatch} (id, login, avatar_url, html_url) values (?, ?, ?, ?)`, [id, login, avatar_url, html_url], (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  })
}

// TODO: make this functions more generic
const addRepo = (repo, tableToMatch, callback) => {
  ({ id, name, html_url, description, updated_at, language } = repo);
  const id_owner = repo.owner.id;

  // const id = repo.id;
  // const name = repo.name;
  // const html_url = html_url

  connection.query(`INSERT INTO ${tableToMatch} (id, name, html_url, description, updated_at, language, id_owner) values (?, ?, ?, ?, ?, ?, ?)`, [id, name, html_url, description, updated_at, language, id_owner], (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  });
}

module.exports = {
  connection: connection,
  get,
  addUser,
  addRepo
}