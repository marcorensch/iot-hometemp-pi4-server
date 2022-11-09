import SrfMeteo from "../SrfMeteo.mjs";

class DatabaseConnection {
    constructor(connection) {
        this.conn = connection;
    }

    async insertForecast(forecastString, locationId) {
        const timestamp = Helper.getTimestamp();
        const sql = 'INSERT INTO '+process.env.DB_METEOTABLENAME+' (created, forecast, location_id) value (?, ?, ?)';
        return await this.conn.query(sql, [timestamp, forecastString, locationId]);
    }

    async getForecastForLocationId(locationId) {
        let rows = null;
        try {
            const sql = 'SELECT * FROM '+process.env.DB_METEOTABLENAME+' WHERE location_id = ? order by created desc limit 1';
            rows = await this.conn.query(sql, [locationId]) ;
        }catch (err) {
            console.log(err);
        }
        if(rows && rows.length > 0) {
            const createdTimestamp = rows[0].created;
            if(Helper.updateRequired(createdTimestamp)) {
                rows = await this.updateForecast(locationId);
            }
        }else{
            rows = await this.updateForecast(locationId);
        }

        return rows;
    }

    async getForecastById(id) {
        const sql = 'SELECT * FROM '+process.env.DB_METEOTABLENAME+' WHERE id = ?';
        return await this.conn.query(sql, [id]);
    }

    async updateForecast(locationId) {
        console.log('update required');
        const srfMeteo = new SrfMeteo(locationId);
        let forecast = await srfMeteo.requestForecast();

        if(forecast) {
            const forecastString = JSON.stringify(forecast);
            const insertStatus = await this.insertForecast(forecastString, locationId);
            return await this.getForecastById(insertStatus.insertId);
        }

    }

    async setup() {
        const createMeteoTableStatus = await this.createMeteoTable();
        return { createMeteoTableStatus };
    }

    async createMeteoTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS tbl_meteo (id INT AUTO_INCREMENT PRIMARY KEY, created DATETIME, forecast TEXT, location_id VARCHAR(255))';
        return await this.conn.query(sql);
    }
}

class Helper {

    static getTimestamp() {
        return new Date().getTime();
    }

    static updateRequired(lastUpdate) {
        const updateIntervalMs = process.env.DB_UPDATEINTERVALMS;
        const now = new Date().getTime();
        const diff = now - Number(lastUpdate);

        return diff > updateIntervalMs;

    }
}

export default DatabaseConnection;