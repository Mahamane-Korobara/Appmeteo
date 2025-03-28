/**
 * @author <korobaramahamane311@gmail.com>
 */


'use strict';

export const jourSemaine = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
];


export const nomMois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];


/**
 * 
 * @param {number} dateUnix //le nombre de seconde depuis le 1 janvier 1970
 * @param {number} fuseauHoraire le UTC exemple = pour le mali c'est 0
 * @returns {string} la date en format "jour date"
 */

export const getDate = function(dateUnix, fuseauHoraire){
    const date = new Date((dateUnix + fuseauHoraire) * 1000);
    const jour = jourSemaine[date.getUTCDay()];//returne jour de la semaine 0 à 6 0=dimanche
    const Mois = nomMois[date.getUTCMonth()];// mêmes chose pour les mois 0 à 11

    return `${jour} ${date.getUTCDate()} ${Mois}`; // exemple de valeur retourner est = Vendredi 17 Septembre
}


/**
 * 
 * @param {number} dateUnix 
 * @param {number} fuseauHoraire 
 * @returns temps en format "heures:minutes AM/PM"
 */

export const getTemps = function(dateUnix, fuseauHoraire) {
    const date = new Date((dateUnix + fuseauHoraire) * 1000);
    const heures = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const periode = heures >= 12 ? "PM" : "AM";

    return `${heures % 12 || 12}: ${minutes} ${periode}`;
}


/**
 * 
 * @param {number} dateUnix 
 * @param {number} fuseauHoraire 
 * @returns temps en format "heures AM/PM"
 */

export const getheures = function(dateUnix, fuseauHoraire) {
    const date = new Date((dateUnix + fuseauHoraire) * 1000);
    const heures = date.getUTCHours();
    const periode = heures >= 12 ? "PM" : "AM";

    return `${heures % 12 || 12} ${periode}`;
}

/**
 * 
 * @param {number} mps mettre par seconde
 * @returns {number} retourne la vitesse en km/h
 */

export const mps_a_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}


//Qualité de l'air

export const qualiteAir = {
    1: {
        niveau: "Bon",
        message: "La qualité de l'air est jugée satisfaisante, la pollution de l'air pose peu ou pas de risque"
    },

    2: {
        niveau: "Acceptable",
        message: "La qualité de l'air est acceptable, cependant pour certains polluants, il peut y avoir un problème de santé modéré pour un très petit nombre de personnes qui sont particulièrement sensibles à la pollution de l'air."
    },

    3: {
        niveau: "Modéré",
        message: "Les membres des groupes sensibles peuvent ressentir des effets sur la santé. Le public en général n'est pas susceptible d'être affecté."
    },

    4: {
        niveau: "Pauvre",
        message: "Tout le monde peut commencer à ressentir des effets sur la santé; les membres des groupes sensibles peuvent ressentir des effets de santé plus"
    },

    5: {
        niveau: "Très pauvre",
        message: "Avertissements de santé de conditions d'urgence. Toute la population est plus susceptible d'être affectée."
    }
}