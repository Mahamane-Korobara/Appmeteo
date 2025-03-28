/**
 * @author <korobaramahamane311@gmail.com>
 */


'use strict';

const api_key = "cb41d646f9fcede7abbabba8594939c2";


/**
 * 
 * @param {string} URL API URL 
 * @param {function} callback callback function
 */
export const fetchData = function(URL, callback) {
    fetch(`${URL}&appid=${api_key}`)
        .then(response => response.json())
        .then(data => callback(data))
        // .catch(error => console.error("Erreur lors de la récupération des données :", error));
}

export const url = {
    meteoActuelle(latitude, longitude) {
        return `https://api.openweathermap.org/data/2.5/weather?${latitude}&${longitude}&units=metric&lang=fr`
    },

    prevision(latitude, longitude) {
        return `https://api.openweathermap.org/data/2.5/forecast?${latitude}&${longitude}&units=metric&lang=fr`
    },

    pollutionAir(latitude, longitude) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${latitude}&${longitude}&units=metric&lang=fr`
    },

    geoInversion(latitude, longitude) { // géo inversion
        return `https://api.openweathermap.org/geo/1.0/reverse?${latitude}&${longitude}&limit=5&lang=fr`
    },

    /**
     * 
     * @param {string} query recherche avec  le nom de la ville
     * @returns 
     */
    geo(query){
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}