const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  databse: 'fetcher',
});

connection.connect((err) => {
  if (err) { throw(err); }

  console.log(`Connected to MySQL as id ${connection.threadId}`);
});

module.exports.connection = connection;
