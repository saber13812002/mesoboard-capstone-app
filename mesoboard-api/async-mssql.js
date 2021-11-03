const sql = require('mssql');

// const config = {
//   // server: 'localhost\\MSSQLSERVER',
//   server: '127.0.0.1',
//   port: 1433,


//   // user: 'NewSA',
//   // password: 'Mesoboard!8',
//   user: 'sa',
//   password: 'Igonnect!123456',
//   // user: 'kevjr',
//   // password: 'Igonnect!123456',


//   // database: 'mesoboard-first',
//   // database: 'MesoboardFirst',
//   database: 'MesoboardSecond',
//   options: {
//     trustedconnection: true,
//     enableArithAbort: true,
//     instancename: 'MSSQLSERVER'
//   },
//   connectionTimeout: 150000,
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 300000
//   }
// }

const config = {
  // server: 'localhost\\SQLEXPRESS01',
  // server: 'LAPTOP-DMALRFEE\\SQLEXPRESS01',
  server: 'localhost',
  user: 'sa',
  password: 'Mesoboard!123456',

  // port: 1433,
  // port: 57987,
  // database: 'Mesoboard',
  // database: 'MesoboardFirst',
  // database: 'MesoboardSecond',
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS01',
    port: 57987,
    database: 'Mesoboard',
  },
  connectionTimeout: 15000
}


/**
  config properties
  driver?: string | undefined;
  user?: string | undefined;
  password?: string | undefined;
  server: string;
  port?: number | undefined;
  domain?: string | undefined;
  database?: string | undefined;
  connectionTimeout?: number | undefined;
  requestTimeout?: number | undefined;
  stream?: boolean | undefined;
  parseJSON?: boolean | undefined;
  options?: {
    beforeConnect?: void | undefined;
    connectionString?: string | undefined;
    enableArithAbort?: boolean | undefined;
    instanceName?: string | undefined;
    trustedConnection?: boolean | undefined;
    useUTC?: boolean | undefined;
  };
  pool?: PoolOpts<Connection> | undefined;
  arrayRowMode?: boolean | undefined;
 */

async function getUsers() {
  console.log('trying to connect...')
  try {
    let pool = await sql.connect(config)
    console.log('connect!')
    let users = await pool.request().query('select * from Users')
    console.log('users.recordsets', users.recordsets)
    return users.recordsets
  } catch (err) {
    console.log(err.message)
  }
}

getUsers().then(res => {
  console.log('res', res)
}).catch(err => {
  console.log('-', err)
})

// console.log('trying to connect...')

// sql.connect(config).then(pool => {
//   // sql.connect('Server=localhost\\MSSQLSERVER,1433;Database=mesoboard-first;User Id=NewSA;Password=Mesoboard!8;Encrypt=true').then(pool => {
//   console.log('is connected')
//   return pool.request()
//     .query('select * from Users');
// }).then(res => {
//   console.log(res.recordset)
//   sql.close()
// }).catch(err => {
//   console.log('-', err.message)
//   sql.close()
// })


//169.254.127.182