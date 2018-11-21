/* eslint-disable no-unused-expressions */
// console.log('test')

// -----------------------test PostgreSQL
// const cn = {
//   host: '127.0.0.1', // 'localhost' is the default;
//   port: 5432, // 5432 is the default;
//   database: 'postgres',
//   user: 'postgres',
//   password: 'xxxxx',
//   connect (client, dc, useCount) {
//     const cp = client.connectionParameters
//     console.log('Connected to database:', cp.database)
//   }
// }
//
// var db = require('pg-promise')(cn)
//
// db.one('SELECT $1 AS value', 123)
//   .then(function (data) {
//     console.log('DATA:', data.value)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   })

// -------------------------mySql test
// var mysql = require('mysql')
// let connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'pool',
//   password: 'xxxxxxx'
// })
// connection.connect()
// connection.query('SELECT * FROM mydb', function (err, rows, fields) {
//   if (err) throw err
//   console.log('The solution is: ', rows[0].solution)
// })
// connection.end()
//

// -----------------------------sqlite test
// var sqlite3 = require('sqlite3').verbose()
// var db = new sqlite3.Database(':memory:')
//
// db.serialize(function () {
//   db.run('CREATE TABLE lorem (info TEXT)')
//   var stmt = db.prepare('INSERT INTO lorem VALUES (?)')
//
//   for (var i = 0; i < 10; i++) {
//     stmt.run('Ipsum ' + i)
//   }
//
//   stmt.finalize()
//
//   db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
//     console.log(row.id + ': ' + row.info)
//   })
// })
//
// db.close()
//
// // ----------------------------test MSSQL
// const sql = require('mssql')
//
// async () => {
//   try {
//     await sql.connect('mssql://username:password@localhost/database')
//     const result = await sql.query`select * from mytable`
//     console.dir(result)
//   } catch (err) {
//     console.log(err)
//   }
// }
