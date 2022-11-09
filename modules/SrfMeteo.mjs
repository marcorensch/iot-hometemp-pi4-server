import axios from "axios";
import nconf from "nconf";

class SrfMeteo {

    constructor(geolocationId) {
        this.options = {
            "method": "GET",
            "hostname": process.env.METEO_HOST,
            "port": null,
            "path": process.env.METEO_PATH + "/" + geolocationId,
            "headers": {}
        };
        this.forecast = null;
    }

    async requestForecast() {
        // Check Token validity
        if (!await this.tokenIsValid()) {
            await this.updateToken();
        }
        const config = {
            headers: {Authorization: `Bearer ${nconf.get("token")}`}
        };
        return axios.get("https://" + this.options.hostname + this.options.path, config).then((response) => {
            this.forecast = response.data;
            return this.forecast;
        }).catch((error) => {
            if (error.errno === -3008) {
                console.log("Could not connect to SRF Meteo API");
            } else {
                console.log(error);
            }
            return false;
        });
    }

    async tokenIsValid() {
        const token = nconf.get("token");
        if (!token) return false;
        const tokenExpirationDate = Number(nconf.get("tokenExpirationDate"));
        if (!tokenExpirationDate) return false;
        const currentDate = new Date().getTime();
        return currentDate <= tokenExpirationDate;

    }

    async updateToken() {
        if (process.env.METEO_CONSUMER_KEY && process.env.METEO_CONSUMER_SECRET) {
            axios.post("https://" + process.env.METEO_HOST + process.env.METEO_OAUTH_PATH, {}, {
                auth: {
                    username: process.env.METEO_CONSUMER_KEY,
                    password: process.env.METEO_CONSUMER_SECRET
                }
            })
                .then((response) => {
                    nconf.set("token", response.data.access_token);
                    nconf.set("tokenExpirationDate", (Number(response.data.expires_in) * 1000) + new Date().getTime());
                    nconf.save(function (err) {
                        if (err) {
                            console.error(err.message);
                            return;
                        }
                        console.log('Configuration saved successfully.');
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    getForecast() {
        return this.forecast;
    }
}

export default SrfMeteo;