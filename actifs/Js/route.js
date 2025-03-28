/**
 * 
 * @author <korobaramahamane311@gmail.com>
 */

'use strict';

import {miseAJourMeteo, erreur404} from "./app.js";

const localisationDefaut = "#/weather?lat=51.5073219&lon=-0.1276474";//Londre



const localisationActuelle = function() {

    window.navigator.geolocation.getCurrentPosition(res => {
        const {latitude, longitude} = res.coords;

        miseAJourMeteo(`lat=${latitude}`, `lon=${longitude}`);
    },err => {
        window.location.hash = localisationDefaut;
    },

    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
};


/**
 * 
 * @param {string} query 
 */

const rechercheLocalisation = query => miseAJourMeteo(...query.split("&"));
//miseAJourMeteo("lat=51.5073219", "lon=-0.1276474")  lat=51.5073219&lon=-0.1276474 = query

// Map des routes de l'application :
// Chaque clé représente une route spécifique (par exemple, "/current-location" ou "/weather").
// Chaque valeur est une fonction associée qui gère la logique pour cette route.

const routes = new Map([
    ["/current-location", localisationActuelle],// route pour la localisation et meteo actuelle
    ["/weather", rechercheLocalisation], // route pour la recherche de la meteo d'une localisation specifique
]);


//Gerer URL de hash
const verifierHashage = function() {

    const requeteURL = window.location.hash.slice(1); //Elle récupère la partie de l'URL après le # avec window.location.hash.slice(1)

    const [route, query] = requeteURL.includes ? requeteURL.split("?"): [requeteURL];

    routes.get(route) ? routes.get(route)(query) : erreur404();
};

// Lorsque une partie de URL change ici le hashage, on vérifie si la route existe dans la map des routes et par defaut c'est la route de la localisation actuelle
window.addEventListener("hashchange", verifierHashage);

window.addEventListener("load", function() {

    if(!window.location.hash){
        window.location.hash = "#/current-location";
    } else {
        verifierHashage();
    }
});


