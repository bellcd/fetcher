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

const get = (fieldToMatch, table, callback) => {
  const entries = Object.entries(fieldToMatch); // TODO: assumes we're matching on only one field ...

  const field = entries[0][0];
  const value = entries[0][1];

  connection.query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value], (err, rows, fields) => {
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
const addRecord = (dataToAdd, table, callback) => {
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

  connection.query(`INSERT INTO ${table} (${joinedFieldNames}) VALUES (${joinedQuestionMarks})`, values, (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  });
}

// dataToMatchOn is an object with the field and value to match on. Assumes only ONE value
// dataThatWillOverwrite is an object of the { fieldNames: data } you want to overwrite existing data in those fields. ie, { name: 'Christian', id: 1, fav_food: 'tacos' }
// table is the name of the table in question
const updateRecord = (dataThatWillOverwrite, table, callback, dataToMatchOn) => {
  const field = Object.keys(dataToMatchOn)[0];
  const valueForMatch = Object.values(dataToMatchOn)[0];

  // col_name = value
  // handling strings, integers, & Date objects, NOT handling booleans, undefined, null // TODO: how to improve this ??

  // Do NOT need to escape this, b/c it was data from the github API
  let assignmentList = '';
  let value = null;
  for (let field in dataThatWillOverwrite) {
    value = dataThatWillOverwrite[field];

    if (typeof value === 'string') {
      value = `'${value}'`
    } else if (Number(value) === value) {
      // value stays as it is ...
    } else if (!Number.isNaN(Date.parse(value))) { // TODO: better way than using Date.parse ??
      value = new Date(value);
    }

    assignmentList += `, ${field} = ${value}`
  }

  // remove the first comma from assignmentList
  assignmentList = assignmentList.slice(1);

  console.log(`UPDATE ${table} SET ${assignmentList} WHERE ${field} = ?`);
  console.log(valueForMatch);

  connection.query(`UPDATE ${table} SET ${assignmentList} WHERE ${field} = ${valueForMatch}`, null, (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  });
}

// callback is called with the matching rows from dataToMatch. if row length is > 0, that record exists
const doesRecordExist = (dataToMatch, table, callback) => {
  const field = Object.keys(dataToMatch)[0];
  const value = Object.values(dataToMatch)[0];

  connection.query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value], (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  });
}

// TODO: change this to accept any ???
const addOrUpdateUser = (user, table, callback) => {
  if (table === 'user') {
    ({ id, login, avatar_url, html_url } = user);
  } else if (table = 'repo') {
    ({ id, name, html_url, description, updated_at, language } = repo);
    var id_owner = repo.owner.id;
  }

  // check if a record with this id exists
  connection.query(`SELECT id FROM ${table} WHERE id = ?`, [id], (err, rows, fields) => {
    if (err) { throw err; }

    if (rows.length > 0) {
      // this id already exists, so update their record
      connection.query(`UPDATE ${table}
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
      connection.query(`INSERT INTO ${table} (id, login, avatar_url, html_url) values (?, ?, ?, ?)`, [id, login, avatar_url, html_url], (err, rows, fields) => {
        if (err) { throw err; }
        callback(null, rows);
      });
    }
  });
}

// TODO: make this functions more generic
const addOrUpdateRepo = (repo, table, callback) => {
  ({ id, name, html_url, description, updated_at, language } = repo);
  const id_owner = repo.owner.id;

  connection.query(`INSERT INTO ${table} (id, name, html_url, description, updated_at, language, id_owner) values (?, ?, ?, ?, ?, ?, ?)`, [id, name, html_url, description, new Date(updated_at), language, id_owner], (err, rows, fields) => {
    if (err) { throw err; }
    callback(null, rows);
  });
}

// collectionToAddOrUpdate is an array of objects to add / update into the db
// table is the name of the table in quesion
// finalCallback is a callback to invoke after every element in the collection has been checked against the db
const addOrUpdateManyRecords = (collectionToAddOrUpdate, table, finalCallback) => {
  // const fn = table = 'user' ? addOrUpdateUser : addOrUpdateRepo; // TODO: remove
  let fn = null;

  // base case
  // collectionToAddOrUpdate length is 0, invoke finalCallback
  if (collectionToAddOrUpdate.length === 0) {
    return finalCallback();
  }

  // recursive case
  // save & remove from collectionToAddOrUpdate the first user in collectionToAddOrUpdate
  const element = collectionToAddOrUpdate.shift();


  const dataToMatchOn = {
    id: element.id
  }

  doesRecordExist(dataToMatchOn, table, (err, rows) => {
    if (err) { throw err; }

    if (rows.length === 0) {
      // record does NOT exist, invoke addRecord
      fn = addRecord;
    } else {
      // record exists, invoke updateRecord
      fn = updateRecord;
    }

    // invoke fn with that element. fn's callback will be addOrUpdateManyRecords with - the now 1 shorter - collectionToAddOrUpdate array
    fn(element, table, (err, rows) => {
      if (err) { throw err; }
      addOrUpdateManyRecords(collectionToAddOrUpdate, table, finalCallback);
    }, dataToMatchOn);
  })
}

module.exports = {
  connection: connection,
  get,
  addOrUpdateUser,
  addOrUpdateRepo,
  addOrUpdateManyRecords
}