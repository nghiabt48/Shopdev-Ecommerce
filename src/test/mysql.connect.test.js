const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'shopDEV'
})
const batchSize = 100000
const totalSize = 1_000_000
let currentId = 1
const insertBatch = async() => {
  const values = []
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`
    const age = currentId
    const address = `address-${currentId}`
    values.push([currentId, name, age, address])
    currentId++
  }
  if (!values.length) {
    pool.end(err => {
      if (err) console.error(err)
    })
    return
  }
  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
  pool.query(sql, [values], async function (err, result) {
    if (err) console.error(err)
    console.log(`Inserted ${result.affectedRows} records`)
    await insertBatch()
  })
}
insertBatch().catch(console.error)