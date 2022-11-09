import mariadb from 'mariadb';

class MariadbConnection {
  constructor() {
    try {
      this.pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        connectionLimit: process.env.DB_CONNECTION_LIMIT,
      });
    } catch (err) {
      console.log("Could not create Database connection pool");
      // console.log(err);
    }
  }

  async query(sql, params) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      return await conn.query(sql, params);
    } catch (err) {
      console.log("Could not execute query Database might not be reachable");
      throw err;
    } finally {
      if (conn) await conn.end();
    }
  }
}

export default MariadbConnection;