import * as dotenv from 'dotenv';
dotenv.config();

import AppSettings from "./modules/Storage/AppSettings.mjs";
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import DatabaseConnection from "./modules/Storage/DatabaseConnection.mjs";
import MariadbConnection from "./modules/Storage/MariadbConnection.mjs";
import MqttCommander from "./modules/Sensors/MqttCommander.mjs";

const appSettings = new AppSettings();
appSettings.setMeteoVariables().then(() => {
    console.log("Meteo variables set");
});

const database = new DatabaseConnection(new MariadbConnection());
database.setup().then((status) => {
    console.log("Database setup done");
});

const mqttCommander = new MqttCommander();
mqttCommander.subscribeTopic('/voyager/sensors/#');
mqttCommander.useDatabase('tbl_sensors', database);

const server = express();
const httpServer = createServer(server);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:8080',
    }
});
server.use(cors());
const port = 3000;



io.on("connection", (socket) => {
    socket.on('get:settings', () => {
        const settings = appSettings.getSettings();
        socket.emit('stored:settings', settings);
    });

    socket.on("store:settings", (data) => {
        appSettings.storeSettings(data);
    });

    socket.on('get:sensors', async () => {
        const sensors = await database.getActiveSensors();
        socket.emit('stored:sensors', sensors);
    });
});

server.get('/', (req, res) => {
    let weatherData = {};
    const currentLocation = appSettings.getSettings('meteo_location');
    console.log(currentLocation);
    if (currentLocation && currentLocation.hasOwnProperty('meteo_location')) {
        database.getForecastForLocationId(currentLocation.meteo_location.id).then((rows) => {
            res.send(rows[0]);
        }).catch((err) => {
            console.log(err);
            res.json(weatherData);
        });
    } else {
        console.log(currentLocation)
        res.send('No Location set');
    }
});

server.get('/sensors', (req, res) => {
    database.getActiveSensors().then((rows) => {
        console.log(rows);
        res.send(rows);
    }).catch((err) => {
        console.log(err);
        res.json({});
    });
});

server.get('/sensor/last', (req, res) => {
    console.log(req.query)
    database.getLastDataForSensor(req.query.sensor_id).then((row) => {
        res.send({temp: row[0].temperature, hum: row[0].humidity});
    }).catch((err) => {
        console.log(err);
        res.json({temp: 0, hum: 0});
    });
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});