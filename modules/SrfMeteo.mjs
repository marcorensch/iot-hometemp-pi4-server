import axios from "axios";
import nconf from "nconf";

class SrfMeteo {
    constructor() {
        this.options = {
            "method": "GET",
            "hostname": process.env.METEO_HOST,
            "port": null,
            "path": process.env.METEO_PATH + "/",
            "geolocationUrl": "https://api.srgssr.ch/srf-meteo/geolocationNames?zip=",
            "locationId": null,
            "headers": {}
        };
        this.forecast = null;
    }

    setLocationId(locationId) {
        this.options.locationId = locationId;
    }

    async requestForecast() {
        // Check Token validity
        if (!this.checkTokenStatus()) {
            await this.updateToken();
        }
        const config = {
            headers: {Authorization: `Bearer ${nconf.get("token")}`}
        };
        return axios.get("https://" + this.options.hostname + this.options.path + this.options.locationId, config).then((response) => {
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

    checkTokenStatus() {
        if (!nconf.get("token") || !nconf.get("tokenExpirationDate")){
            console.log("Token not set");
            return false;
        }
        const tokenExpirationDate = Number(nconf.get("tokenExpirationDate"));
        if (!tokenExpirationDate) {
            console.log("Token expiration date not set");
            return false;
        }
        const currentDate = new Date().getTime();
        if(currentDate > tokenExpirationDate) {
            console.log("Token expired");
            return false;
        }else {
            return true;
        }
    }

    async getNewToken() {
        if (process.env.METEO_CONSUMER_KEY && process.env.METEO_CONSUMER_SECRET) {
            console.log("https://" + process.env.METEO_HOST + process.env.METEO_OAUTH_PATH)
            return axios.post("https://" + process.env.METEO_HOST + process.env.METEO_OAUTH_PATH, {}, {
                auth: {
                    username: process.env.METEO_CONSUMER_KEY,
                    password: process.env.METEO_CONSUMER_SECRET
                }
            }).then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("Could not update Token Consumer Key or Consumer Secret not set")
        }
    }

    async getLocationDataForZip(zip) {
        if (!zip) return false;
        const config = {
            headers: {Authorization: `Bearer ${nconf.get("token")}`}
        };
        return axios.get(this.options.geolocationUrl + zip, config).then((response) => {
            this.location = response.data;
            return this.location;
        }).catch((error) => {
            if (error.errno === -3008) {
                console.log("Could not connect to SRF Meteo API");
            } else {
                console.log(error);
            }
            return false;
        });
    }

    getForecast() {
        return this.forecast;
    }
}

export default SrfMeteo;