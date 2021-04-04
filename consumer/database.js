const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Sjw2pBufpvGfh6*V',
  server: 'localhost',
  database: 'staff',
  options: {
    enableArithAbort: true
  },
  pool: {
    max: 100,
    min: 1, //don't close all the connections.
    idleTimeoutMillis: 1000,
    evictionRunIntervalMillis: 1500000
  }
}

const pool = new sql.ConnectionPool(config, (err) => {
  if (err) {
    console.log("SQL Connection Establishment ERROR: %s", err);
  } else {
    console.log('SQL Connection established...');
  }
});

sql.on('error', err => {
  console.log(err);
})

const insertEmployeeQuery = () => {
  let query = `INSERT INTO employees (name, last_name, position) `;
  query += `VALUES (@name, @last_name, @position)`;

  return query;
};

const insertEmployee = (name, last_name, position) => {

  const request = new sql.Request(pool);
  let query = insertEmployeeQuery();

  request
    .input('name', sql.VarChar(50), name)
    .input('last_name', sql.VarChar(50), last_name)
    .input('position', sql.VarChar(50), position)
    .query(query)
    .then((result) => {
      console.log(result.recordset);
    }).catch(err => {
      //childSpan.recordException(err);
      console.log(err);
    }).finally();
};

exports.insertEmployee = insertEmployee;
