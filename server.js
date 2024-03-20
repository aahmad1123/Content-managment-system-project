const { Pool } = require("pg");

const pool = new Pool ({
    host: "localhost",
    user: "postgres",
    password: "bootcamp",
    database: "cms"
});
pool.connect();
module.exports = pool