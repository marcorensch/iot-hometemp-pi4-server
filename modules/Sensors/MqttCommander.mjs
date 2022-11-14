import mqtt from 'mqtt';

class MqttCommander{
    host = process.env.MQTT_HOST;
    port = process.env.MQTT_PORT;
    connectUrl = "";
    clientId = null;
    client = null;
    topic = [];
    saveToDatabase = false;
    tableName = null;
    db = null;

    constructor(){
        this.connectUrl = `mqtt://${this.host}:${this.port}`;
        this.clientId = `mqttjs_${Math.random().toString(16).substr(2, 8)}`;
        this.client = mqtt.connect(this.connectUrl, {
            clientId: this.clientId,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
        })
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('connect', this.onConnect.bind(this));
    }

    useDatabase(tableName, db){
        this.saveToDatabase = !!tableName;
        this.tableName = tableName;
        this.db = db;
    };

    async saveMessage(topic, data){
        console.log('Save message to database');
        console.log(data);
        await this.db.insertSensorData(topic, data);
    }

    subscribeTopic(topic){
        this.topic.push( topic );
        this.subscribe(topic);
    }

    removeTopic(topic){
        this.unsubscribe(topic);
        this.topic = this.topic.filter((item) => item !== topic);
    }

    async onMessage(topic, payload){
        console.log('Received MQTT Message:', topic, payload.toString())
        if(this.saveToDatabase){
            const data = this.createDatabaseObject(payload);
            await this.saveMessage(topic, data);
        }
    }

    createDatabaseObject(payload){
        const data = JSON.parse(payload.toString());
        const temperature = parseFloat(data.temperature).toFixed(2);
        const humidity = parseFloat(data.humidity).toFixed(2);
        const sensorId = data.sensorId;
        return { temperature, humidity, sensorId };
    }

    onConnect(){
        this.client.on('connect', () => {
            this.subscribe()
        })
    }

    subscribe(topic){
        this.client.subscribe([topic], () => {
            console.log(`Subscribe to topic '${topic}'`)
            console.log(`Suscribed topics: ${this.getSuscribedTopics()}`)
        })
    }
    unsubscribe(topic){
        this.client.unsubscribe([topic], () => {
            console.log(`Unsubscribe from topic '${topic}'`)
            console.log(`Suscribed topics: ${this.getSuscribedTopics()}`)
        })
    }
    getSuscribedTopics(){
        return this.topic.toString();
    }
}

export default MqttCommander;

