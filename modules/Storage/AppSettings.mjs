import nconf from 'nconf';

class AppSettings{

    constructor() {
        nconf.use('file', { file: './config.json' });
        nconf.load();
    }

    setMeteoVariables(){
        console.log(process.env)
        if(!nconf.get("consumer_key")) {
            nconf.set("consumer_key", process.env.METEO_CONSUMER_KEY);
        }
        if(!nconf.get("consumer_secret")) {
            nconf.set("consumer_secret", process.env.METEO_CONSUMER_SECRET);
        }
    }

    saveSettings(){
        nconf.save(function (err) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Configuration saved successfully.');
        })
    }
}

export default AppSettings;