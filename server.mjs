import * as dotenv from 'dotenv';
dotenv.config();

import AppSettings from "./modules/Storage/AppSettings.mjs";
const appSettings = new AppSettings();
appSettings.setMeteoVariables();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import DatabaseConnection from "./modules/Storage/DatabaseConnection.mjs";
import MariadbConnection from "./modules/Storage/MariadbConnection.mjs";

const database = new DatabaseConnection(new MariadbConnection());
database.setup().then((status) => {
    console.log("Database setup done");
});

const server = express();
const httpServer = createServer(server);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:8080',
    }
});
server.use(cors());
const port = 3000;

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    io.emit('temperature-updated', 'Hello World');
});



io.on("connection", (socket) => {
    socket.emit('temperature-updated', {msg: 'Hello World via io'});
});
io.on("get-settings", (socket) => {
    socket.emit('current-settings', appSettings.get());
});

server.get('/', (req, res) => {
    // srfMeteo.requestForecast();
    // console.log(srfMeteo.getForecast());
    let weatherData = {};
    database.getForecastForLocationId(process.env.METEO_LOCATIONID).then((rows) => {
        weatherData = rows[0];
        res.send(weatherData);
    }).catch((err) => {
        console.log(err);
        res.json(weatherData);
    });

});