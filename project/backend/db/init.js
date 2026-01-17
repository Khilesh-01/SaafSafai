const pool = require("../config/db")
// Create users table with role field
const intdb = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,           
    email VARCHAR(100) UNIQUE,
    password TEXT,
    role VARCHAR(10) DEFAULT 'user'
); 
`).catch(err => console.error('Error creating table:', err));
}
module.exports=intdb;