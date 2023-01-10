import mariadb from 'mariadb';
import QueryBuilder from './QueryBuilder.mjs';

class MariadbConnection {
  constructor(pooled = false) {
    this.pooled = pooled;
    if(pooled) {
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
    } else {

    }
  }

  createConnection() {
    return mariadb.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
    });
  }

  async query(sql, params) {
    let conn;
    try {
      conn = this.pooled ? await this.pool.getConnection() : await this.createConnection();
      return await conn.query(sql, params);
    } catch (err) {
      console.log("Could not execute query Database might not be reachable");
      throw err;
    } finally {
      if (conn) await conn.end();
    }
  }

  createQueryBuilder() {
    return new QueryBuilder();
  }

  // createQueryString(type, table, data) {
  //   switch (type) {
  //       case "SELECT":
  //           return `SELECT * FROM ${table} WHERE ${Object.keys(data).map(key => `${key} = ?`).join(" AND ")}`;
  //       case "INSERT":
  //           return `INSERT INTO ${table} (${Object.keys(data).join(",")}) VALUES (${Object.keys(data).map((key) => "?").join(",")})`;
  //       case "UPDATE":
  //           return `UPDATE ${table} SET ${Object.keys(data).map((key) => `${key} = ?`).join(",")} WHERE id = ?`;
  //       case "DELETE":
  //           return `DELETE FROM ${table} WHERE id = ?`;
  //       default:
  //           return false;
  //   }
  // };
}

export default MariadbConnection;