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

  connection.query(`SELECT * from ${table} WHERE ${field} = ?`, [value], (err, rows, fields) => {
    if (err) { return callback(err, null); }
    callback(null, rows);
  });
}

// dataToAdd is an object of the { fieldNames: data } you want to add to the table. ie, { name: 'Christian', id: 1, fav_food: 'tacos' }
// table is the string name of the table to add this data to
const addRecord = (dataToAdd, table, callback) => {
  const fieldNames = [];
  const values = [];
  const questionMarks = [];

  for (let key in dataToAdd) {
    fieldNames.push(key);

    if (key === 'updated_at') {
      values.push(new Date(dataToAdd[key]));
    } else {
      values.push(dataToAdd[key]);
    }

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

  // handling strings, integers, & Date objects, NOT handling booleans, undefined, null // TODO: how to improve this ??

  // Do NOT need to escape this, b/c it was data from the github API
  let assignmentList = '';
  let value = null;
  for (let field in dataThatWillOverwrite) {
    value = dataThatWillOverwrite[field];

    if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) { // TODO: better way of handling this date??
      value = `'${value.slice(0,10)}'`;
    } else if (typeof value === 'string') {
      value = `${connection.escape(value)}`
    } else if (Number(value) === value) {
      // value stays as it is ...
    }

    assignmentList += `, ${field} = ${value}`
  }

  // remove the first comma from assignmentList
  assignmentList = assignmentList.slice(1);

  console.log('assignmentList: ', assignmentList);

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

// collectionToAddOrUpdate is an array of objects to add / update into the db
// table is the name of the table in quesion
// finalCallback is a callback to invoke after every element in the collection has been checked against the db
const addOrUpdateManyRecords = (collectionToAddOrUpdate, table, finalCallback) => {
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
  addOrUpdateManyRecords
}