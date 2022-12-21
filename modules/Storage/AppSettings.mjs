import nconf from 'nconf';
import SrfMeteo from "../SrfMeteo.mjs";

class AppSettings {

    constructor() {
        nconf.use('file', {file: './config.json'});
        nconf.load();
        this.meteo = new SrfMeteo();
    }

    async setMeteoVariables() {
        console.log(process.env)
        if (!nconf.get("consumer_key")) {
            nconf.set("consumer_key", process.env.METEO_CONSUMER_KEY);
        }
        if (!nconf.get("consumer_secret")) {
            nconf.set("consumer_secret", process.env.METEO_CONSUMER_SECRET);
        }
        if (!nconf.get("meteo_location_zip")) {
            nconf.set("meteo_location_zip", process.env.METEO_LOCATION_ZIP);
        }

        // Set new Token if needed
        if (!this.meteo.checkTokenStatus()) {
            const data = await this.meteo.getNewToken();
            console.log(data);
            if (data) {
                nconf.set("token", data.access_token);
                nconf.set("tokenExpirationDate", (Number(data.expires_in) * 1000) + new Date().getTime());
            } else {
                console.log( "Could not update Token in settings" );
            }
        }

        if(!nconf.get("meteo_location")) {
            const location = await this.meteo.getLocationDataForZip(nconf.get("meteo_location_zip"));
            if (location) {
                nconf.set("meteo_location", location[0].geolocation);
            } else {
                console.log("Could not get location data for zip " + nconf.get("meteo_location_zip"));
            }
        }

        this.saveSettings(false);
    }

    storeSettings(data) {
        Object.keys(data).forEach((key) => {
            nconf.set(key, data[key]);
        });
        this.saveSettings();
    }

    getSetting(key) {
        return nconf.get(key);
    }

    getSettings() {
        return nconf.get();
    }

    saveSettings(log) {
        nconf.save(function (err) {
            if (err) {
                console.error(err.message);
                return;
            }
            if (log) {
                if (typeof log === "string") {
                    console.log(log);
                } else {
                    console.log("Settings saved");
                }
            }
            ;
        })
    }
}

export default AppSettings;