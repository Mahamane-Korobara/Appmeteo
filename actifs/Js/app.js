/**
 * @author <korobaramahamane311@gmail.com>
 */


'use strict';

// import { fetchData } from "./api.js";
import { fetchData, url } from "./api.js";
import * as module from "./module.js"; // Importation de tout ce que le module js exporte 


//Ajout d'evenements multiple aux elements
/**
 * 
 * @param {NodeList} elements tableau d'element
 * @param {string} eventType type d'evenement
 * @param {Function} callback callback function
 */
const ajoutEventSurElements = function(elements, eventType, callback) {
    for(const element of elements) element.addEventListener(eventType, callback);
}

let marker; //Pour le marker du map


/*****************Activation de recherche sur les appareils mobiles***********************/

const vueRecherche = document.querySelector("[data-vue-recherche]");
const basculeRecherche = document.querySelectorAll("[data-recherche-bascule]");


const activeRecherche = () => vueRecherche.classList.toggle("active");
ajoutEventSurElements(basculeRecherche, "click", activeRecherche);


/********************Recherche integration *******************************/

const rechercheChamp = document.querySelector("[data-champ-recherche]");
const rechercheResultat = document.querySelector('[data-recherche-resultat]');

let delaiRechercheExpire = null;
let durerTempsRecherche = 500;

rechercheChamp.addEventListener("input", function() {  // Evénement déclenché à chaque fois que user tape dans le champs


    if(delaiRechercheExpire) clearTimeout(delaiRechercheExpire);
    // delaiRechercheExpire ?? clearTimeout(delaiRechercheExpire);   //st destinée à annuler le timer précédent si l'utilisateur tape de nouveau avant que le délai soit


    //Vérification du contenu du champ de recherche
    if(!rechercheChamp.value){

        rechercheResultat.classList.remove("active");
        rechercheResultat.innerHTML = "";
        rechercheChamp.classList.remove("rechercher");
    } else {
        rechercheChamp.classList.add("rechercher");
    }

    if(rechercheChamp.value) {  //Délai avant de lancer la requête
        delaiRechercheExpire = setTimeout(() => {
            fetchData(url.geo(rechercheChamp.value), function(locations) {

                //Traitement de la reponse
                // Supprime l'indicateur de recherche et prépare l'affichage
                rechercheChamp.classList.remove("rechercher");
                rechercheResultat.classList.add("active");
                rechercheResultat.innerHTML = `
                    <ul class="vue-liste" data-recherche-liste></ul>`;
                
                const /**{NodeList} */ items = [];
                // Parcourt chaque location retournée par l'API
                for(const {name, lat, lon, country, state} of locations) {
                    // Ici, on itère sur chaque résultat (chaque location) pour potentiellement les afficher ou les traiter
                    const rechercheItem = document.createElement("li");
                    rechercheItem.classList.add("vue-item");
                    
                    rechercheItem.innerHTML = `
                        <span class="m-icon">location_on</span>
                        <div>
                            <p class="titre-item">${name}</p>
                            <p class="label-2 item-sous-titre">${state || ""} ${country}</p>
                        </div>

                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-lien etat" aria-label="${name} meteo" data-recherche-bascule></a>
                    `;
                    rechercheResultat.querySelector("[data-recherche-liste]").appendChild(rechercheItem);
                    items.push(rechercheItem.querySelector("[data-recherche-bascule]"))
                }

                ajoutEventSurElements(items, "click", function() {
                    activeRecherche();
                    rechercheResultat.classList.remove("active");
                })
            });
        }, durerTempsRecherche)
    }

});

const conteneur = document.querySelector("[data-conteneur]");
const chargement = document.querySelector("[data-chargement]");
const locationActuelBtn = document.querySelector("[data-acteul-location-btn]");
const erreur_contenu = document.querySelector("[data-erreur-contenu]");


/**
 * Afficher toutes mes données méteorologique dans la page html
 * 
 * @param {number} lat latitude
 * @param {number} lon longitude
 */
export const miseAJourMeteo = function (lat, lon) {

    chargement.style.display = "grid";
    conteneur.style.overflowY = "hidden";
    if(conteneur.classList.contains("fade-in")) conteneur.classList.remove("fade-in");
    erreur_contenu.style.display = "none";

    const sectionMeteoActuelle = document.querySelector("[data-meteo-actuel]");
    const sectionPointsForts = document.querySelector("[data-points-forts]");
    const sectionPrevisionHoraire = document.querySelector("[data-prevision-horaire]");
    const sectionPrevision = document.querySelector("[data-5-jour-prevision]");

    sectionMeteoActuelle.innerHTML = "";
    sectionPointsForts.innerHTML = "";
    sectionPrevisionHoraire.innerHTML = "";
    sectionPrevision.innerHTML = "";

    if(window.location.hash === "#/current-location") {
        locationActuelBtn.setAttribute("disabled", "");
    } else {
        locationActuelBtn.removeAttribute("disabled")
    }


    /***********************Section meteo actuel**************************/

    fetchData(url.meteoActuelle(lat, lon), function(meteoActuelle) {

        // Vérifiez que meteoActuelle n'est pas undefined
        if (!meteoActuelle) {
            console.log("Aucune donnée météo reçue");
            return;
        }
        //Extraction des données avec la destructuration
        const {
            weather,
            dt: dateUnix,
            sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: {temp, feels_like, pressure, humidity},
            visibility,
            timezone
        } = meteoActuelle
        const [{ description, icon }] = weather;

        const card = document.createElement("div");
        card.classList.add("card", "card-lg" , "meteo-actuel-card");

        card.innerHTML = `
            <h2 class="titre card-titre">Maintenant</h2>
            <div class="emballage">
                <p class="heading">${parseInt(temp)}°<sup>c</sup></p>
                <img src="./actifs/images/weather_icons/${icon}.png" width="64" alt="${description}" class="meteo-icon">
            </div>

            <p class="body-3">${description}</p>
            <ul class="meta-liste">
                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>
                    <p class="titre-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
                </li>

                <li class="meta-item">
                    <span class="m-icon">location_on</span>
                    <p class="titre-3 meta-text" data-location></p>
                </li>
            </ul>
        `;

        fetchData(url.geoInversion(lat, lon), function([{ name, country }]){
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
        });

        sectionMeteoActuelle.appendChild(card)


        /*****************************************Point forts*******************************/

        fetchData(url.pollutionAir(lat, lon), function(pollutionAir) {

            // console.log(pollutionAir.list[0].components);
            // console.log(JSON.stringify(pollutionAir, null, 2));

            const [{
                main: { aqi },
                components: { no2, o3, so2, pm2_5 }
            }] = pollutionAir.list;

            const card = document.createElement("div");
            card.classList.add("card", "card-lg");

            card.innerHTML = `
               
               <h2 class="titre-2" id="points-forts-label">Aujourd'hui points forts</h2>

                        <div class="points-forts-liste">
                            <div class="card card-ms points-forts-card un">

                                <h3 class="titre-3">Indice de qualité d'air</h3>
                                <div class="wrapper">

                                    <span class="m-icon">air</span>
                                    <ul class="card-liste">
                                        <li class="card-item">
                                            <p class="titre-1">${pm2_5.toPrecision(3)}</p>
                                            <p class="label-1">PM <sub>2.5</sub></p>
                                        </li>
                                        <li class="card-item">
                                            <p class="titre-1">${so2.toPrecision(3)}</p>
                                            <p class="label-1">SO<sub>2</sub></p>
                                        </li>
                                        <li class="card-item">
                                            <p class="titre-1">${no2.toPrecision(3)}</p>
                                            <p class="label-1">NO<sub>2</sub></p>
                                        </li>
                                        <li class="card-item">
                                            <p class="titre-1">${o3.toPrecision(3)}</p>
                                            <p class="label-1">O<sub>3</sub></p>
                                        </li>

                                    </ul>
                                </div>

                                <span class="badge aqi-${aqi} label-${aqi}" title="${module.qualiteAir[aqi].message}">
                                ${module.qualiteAir[aqi].niveau}
                                </span>
                            </div>

                            <div class="card card-ms points-forts-card deux">
                                <h3 class="titre-3">Lever et coucher du soleil</h3>

                                <div class="card-liste">
                                    <div class="card-item">
                                        <span class="m-icon">clear_day</span>

                                        <div>
                                            <p class="label-1">Lever du soleil</p>
                                            <p class="titre-1">${module.getTemps(sunriseUnixUTC, timezone)}</p>
                                        </div>
                                    </div>

                                    <div class="card-item">
                                        <span class="m-icon">clear_night</span>

                                        <div>
                                            <p class="label-1">Coucher du soleil</p>
                                            <p class="titre-1">${module.getTemps(sunsetUnixUTC, timezone)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card card-ms points-forts-card">
                                <h3 class="titre-3">Humidité</h3>

                                <div class="wrapper">
                                    <span class="m-icon">humidity_percentage</span>

                                    <p class="titre-1">${humidity}<sub>%</sub></p>
                                </div>
                            </div>

                            <div class="card card-ms points-forts-card">
                                <h3 class="titre-3">Pression</h3>

                                <div class="wrapper">
                                    <span class="m-icon">airwave</span>

                                    <p class="titre-1">${pressure}<sub>hPa</sub></p>
                                </div>
                            </div>

                            <div class="card card-ms points-forts-card">
                                <h3 class="titre-3">Visibilité</h3>

                                <div class="wrapper">
                                    <span class="m-icon">Visibility</span>

                                    <p class="titre-1">${visibility / 1000}<sub>km</sub></p>
                                </div>
                            </div>

                            <div class="card card-ms points-forts-card">
                                <h3 class="titre-3">Ressenti </h3>

                                <div class="wrapper">
                                    <span class="m-icon">thermostat</span>

                                    <p class="titre-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                                </div>
                            </div>

                        </div>
            `;

            sectionPointsForts.appendChild(card);
        });



        /**************************************Prevision 24h et 5jours**************************/

        fetchData(url.prevision(lat, lon), function(prevision) { 

            const {
                list: previsionListe,
                city: { timezone }
            } = prevision;

            sectionPrevisionHoraire.innerHTML = `
            
               <h2 class="titre-2">Aujourd'hui à</h2>
                    <div class="slider-conteneur">
                        <ul class="slider-liste" data-temp>
                        
                        </ul>


                        <ul class="slider-liste" data-wind>

                        </ul>
                    </div>
            `;


            for(const [index, data] of previsionListe.entries()) {

                if(index > 7) break;

                const {
                    dt: dateTimeUnix,
                    main: { temp },
                    weather,
                    wind: { deg: windDirection, speed: windSpeed}
                } = data
                const [{ icon, description}] = weather

                const tempLi = document.createElement("li");
                tempLi.classList.add("slider-item");

                tempLi.innerHTML = `
                   
                    <div class="card card-ms slider-card">
                        <p class="body-3">${module.getheures(dateTimeUnix, timezone)}</p>
                        <img src="./actifs/images/weather_icons/${icon}.png" width="48" height="48" loading="lazy" alt="${description}" class="meteo-icon" title="${description}">
                        <p class="body-3">${parseInt(temp)}&deg;</p>
                    </div>
                `;

                sectionPrevisionHoraire.querySelector("[data-temp]").appendChild(tempLi);

                const windLi = document.createElement("li");
                windLi.classList.add("slider-item");

                windLi.innerHTML = `

                   <div class="card card-ms slider-card">
                        <p class="body-3">${module.getheures(dateTimeUnix, timezone)}</p>
                        <img src="./actifs/images/weather_icons/direction.png" width="48" height="48" loading="lazy" alt="direction" style="transform: rotate(${windDirection - 180}deg)" class="meteo-icon">
                        <p class="body-3">${parseInt(module.mps_a_kmh(windSpeed))} km/h</p>
                    </div>
                `;

                sectionPrevisionHoraire.querySelector("[data-wind]").appendChild(windLi);
            }


            /*************************************5 jours de prevision***************************/

            sectionPrevision.innerHTML = `
               
                <h2 class="titre-2",id="prevision-label">5 jours de prevision</h2>

                    <div class="card card-lg prevision-card">
                        <ul data-prevision-liste>
                           
                        </ul>
                    </div>
            `;

            for(let i = 7, len = previsionListe.length; i < len; i += 8) {

                const {
                    main: { temp_max },
                    weather,
                    dt_txt
                } = previsionListe[i];

                const [{ icon, description }] = weather
                const date = new Date(dt_txt);

                const li = document.createElement("li");
                li.classList.add("card-item");

                li.innerHTML = `
                   
                   <div class="icon-wrapper">
                        <img src="./actifs/images/weather_icons/${icon}.png" width="36" height="36" alt="${description}" class="meteo-icon" title="${description}">
                        <span class="span">
                            <p class="titre-2">${parseInt(temp_max)}&deg;</p>
                        </span>
                    </div>
                    <p class="label-1">${date.getDate()} ${module.nomMois[date.getUTCMonth()]}</p>
                    <p class="label-1">${module.jourSemaine[date.getUTCDay()]}</p>
                `;


                sectionPrevision.querySelector("[data-prevision-liste]").appendChild(li);
            }


            chargement.style.display = "none";
            conteneur.style.overflowY = "overlay";
            if(!conteneur.classList.contains("fade-in")) conteneur.classList.add("fade-in");
        });

         // La localisation 

    // Initialisation de la carte AVANT l'événement de soumission
    let map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Supprimer l'ancien marqueur s'il existe
    const latitude = parseFloat(lat.split('=')[1]);
    const longitude = parseFloat(lon.split('=')[1]);

    if(marker) {
        map.removeLayer(marker);
    }
    
    // Ajouter un nouveau marqueur et centrer la carte
    marker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Latitude: ${latitude}<br>Longitude: ${longitude}`)
        .openPopup();
    
    // Ajuster la vue de la carte
    map.setView([latitude, longitude], 10);
    });


   
};


export const erreur404 = () => erreur_contenu.style.display = "flex";
