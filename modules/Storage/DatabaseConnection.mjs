import SrfMeteo from "../SrfMeteo.mjs";

class DatabaseConnection {
    constructor(connection) {
        this.conn = connection;
        this.meteoTable = process.env.DB_METEOTABLENAME;
        this.sensorsTable = process.env.DB_SENSORSTABLENAME;
    }

    async insertForecast(forecastString, locationId) {
        const timestamp = Helper.getTimestamp();
        const sqlObj = this.conn.createQueryBuilder();
        sqlObj.setType('insert');
        sqlObj.setTable(this.meteoTable);
        sqlObj.setFields({
            location_id: locationId,
            created: timestamp,
            forecast: forecastString
        });
        const sql = sqlObj.getSql();
        // const sql = this.conn.createQueryString('INSERT', this.meteoTable, {created: timestamp, forecast: forecastString, location_id: locationId});
        return await this.conn.query(sql, [timestamp, forecastString, locationId]);
    }

    async insertSensorData(topic, data) {
        const timestamp = Helper.getTimestamp();
        const sqlObj = this.conn.createQueryBuilder();
        sqlObj.setType('insert');
        sqlObj.setTable(this.sensorsTable);
        sqlObj.setFields({
            topic: topic,
            created: timestamp,
            temperature: data.temperature,
            humidity: data.humidity,
            sensorId: data.sensorId
        });
        const sql = sqlObj.getSql();
        // const sql = this.conn.createQueryString('INSERT', this.sensorsTable, {topic: topic, created: timestamp, temperature: data.temperature, humidity: data.humidity, sensorId: data.sensorId});
        return await this.conn.query(sql, [topic, timestamp, data.temperature, data.humidity, data.sensorId]);
    }

    async getActiveSensors() {
        const lastWeekTimestamp = Helper.getDaysAgoTimestamp(7);
        const sqlObj = this.conn.createQueryBuilder();
        sqlObj.setType('select');
        sqlObj.setFields(['sensorId', 'MAX(topic) as topic']);
        sqlObj.setTable(this.sensorsTable);
        sqlObj.setWhere(`created > ?`);
        sqlObj.setGroup('sensorId');
        const sql = sqlObj.getSql();
        // const sql = this.conn.createQueryString('SELECT', this.sensorsTable, {topic: 'topic', created: lastWeekTimestamp}, 'created > ? GROUP BY topic');
        return await this.conn.query(sql, [lastWeekTimestamp]);
    }

    async getForecastForLocationId(locationId) {
        // const sql = this.conn.createQueryString('SELECT', this.meteoTable, {location_id: locationId}, ' ORDER BY created DESC LIMIT 1');
        const sqlObj = this.conn.createQueryBuilder();
        sqlObj.setType('select');
        sqlObj.setTable(this.meteoTable);
        sqlObj.setWhere(`location_id = ?`);
        sqlObj.setOrder('created DESC');
        sqlObj.setLimit(1);
        const sql = sqlObj.getSql();
        let rows = await this.conn.query(sql, [locationId]) ;
        if(rows && rows.length > 0) {
            const createdTimestamp = rows[0].created;
            if(Helper.forecastUpdateRequired(createdTimestamp)) {
                console.log('update required');
                rows = await this.getNewForecast(locationId);
            }
        }else{
            rows = await this.getNewForecast(locationId);
        }

        return rows;
    }

    async getForecastById(id) {
        const sqlObj = this.conn.createQueryBuilder();
        sqlObj.setType('select');
        sqlObj.setTable(this.meteoTable);
        sqlObj.setWhere(`id = ?`);
        const sql = sqlObj.getSql();
        return await this.conn.query(sql, [id]);
    }

    async getNewForecast(locationId) {
        console.log('update required');
        const srfMeteo = new SrfMeteo();
        srfMeteo.setLocationId(locationId);
        let forecast = await srfMeteo.requestForecast();

        if(forecast) {
            const forecastString = JSON.stringify(forecast);
            const insertStatus = await this.insertForecast(forecastString, locationId);
            return await this.getForecastById(insertStatus.insertId);
        }

    }

    async setup() {
        const createMeteoTableStatus = await this.createMeteoTable();
        const createSensorTableStatus = await this.createSensorTable();
        return { createMeteoTableStatus, createSensorTableStatus };
    }

    async createSensorTable() {
        const sqlObj = this.conn.createQueryBuilder();
        sqlObj.setType('createtable');
        sqlObj.setTable(this.sensorsTable);
        sqlObj.setFields({
            id: 'INT AUTO_INCREMENT PRIMARY KEY',
            topic: 'VARCHAR(255)',
            created: 'DATETIME',
            temperature: 'VARCHAR(10)',
            humidity: 'VARCHAR(10)',
            sensorId: 'VARCHAR(100)'
        });
        const sql = sqlObj.getSql();
        return await this.conn.query(sql);
        // const sql = 'CREATE TABLE IF NOT EXISTS '+this.sensorsTable+' (id INT AUTO_INCREMENT PRIMARY KEY, topic VARCHAR(255), created DATETIME, temperature VARCHAR(10), humidity VARCHAR(10), sensorId VARCHAR(100))';
    }
    async createMeteoTable() {
        // const sql = 'CREATE TABLE IF NOT EXISTS '+this.meteoTable+' (id INT AUTO_INCREMENT PRIMARY KEY, created DATETIME, forecast TEXT, location_id VARCHAR(255))';
        const sqlObj = this.conn.createQueryBuilder();
        sqlObj.setType('createtable');
        sqlObj.setTable(this.meteoTable);
        sqlObj.setFields({
            id: 'INT AUTO_INCREMENT PRIMARY KEY',
            created: 'DATETIME',
            forecast: 'TEXT',
            location_id: 'VARCHAR(255)'
        });
        const sql = sqlObj.getSql();
        return await this.conn.query(sql);
    }
}

class Helper {

    static getTimestamp() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    static getDaysAgoTimestamp(days) {
        const now = new Date();
        const weekAgo = new Date(now.setDate(now.getDate() - days));
        return weekAgo.toISOString().slice(0, 19).replace('T', ' ');
    }

    static forecastUpdateRequired(lastUpdate) {
        const lastUpdateTime = new Date(lastUpdate).getTime();
        const updateIntervalMs = process.env.DB_UPDATEINTERVALMS;
        const timeNow = new Date().getTime();
        const diff = timeNow - lastUpdateTime;

        console.log(diff);
        console.log(diff > updateIntervalMs);

        return diff > updateIntervalMs;

    }
}

export default DatabaseConnection;