# Appmeteo

Appmeteo est une application web moderne permettant d'afficher la météo actuelle, les prévisions sur 5 jours, la qualité de l'air et d'autres informations météorologiques pour n'importe quelle ville dans le monde. Elle utilise l'API OpenWeatherMap et propose une interface utilisateur responsive et interactive.
demo : https://mahamane-korobara.github.io/Appmeteo/

## Fonctionnalités

- **Recherche de ville** : Recherche dynamique avec suggestions et accès rapide à la météo d'une localisation.
- **Localisation actuelle** : Utilisation de la géolocalisation du navigateur pour afficher la météo de l'endroit où tu te trouves.
- **Météo actuelle** : Température, ressenti, pression, humidité, visibilité, lever/coucher du soleil, etc.
- **Qualité de l'air** : Affichage des indices de pollution (PM2.5, SO2, NO2, O3) et du niveau AQI.
- **Prévisions horaires** : Température et vent heure par heure pour la journée.
- **Prévisions sur 5 jours** : Aperçu des températures maximales et conditions météo pour les prochains jours.
- **Carte interactive** : Affichage de la localisation sur une carte OpenStreetMap avec marqueur dynamique.
- **Gestion des erreurs** : Page 404 personnalisée si la localisation n'est pas trouvée.

## Structure du projet

- `index.html` : Page principale de l'application.
- `actifs/Js/` : Scripts JavaScript modulaires (`app.js`, `api.js`, `module.js`, `route.js`).
- `actifs/css/style.css` : Feuille de style principale, responsive et personnalisée.
- `actifs/images/weather_icons/` : Icônes météo utilisées dans l'interface.
- `actifs/font/` : Police Material Symbols pour les icônes.
- `.vscode/settings.json` : Configuration du port pour Live Server.

## Installation & Lancement

1. **Cloner le projet**  
   ```sh
   git clone <url-du-repo>
   cd Appmeteo
   ```

2. **Lancer avec Live Server**  
   Ouvre le dossier dans VS Code et utilise l'extension Live Server (port configuré sur 5502).

3. **Accéder à l'application**  
   Ouvre [http://localhost:5502](http://localhost:5502) dans ton navigateur.

## Dépendances externes

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Leaflet.js](https://leafletjs.com/) pour la carte
- [Font Awesome](https://fontawesome.com/) pour les icônes
- [Google Fonts - Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans)

## Personnalisation

- Les couleurs, polices et styles sont définis dans `actifs/css/style.css`.
- Les icônes météo sont dans `actifs/images/weather_icons/`.
- Les clés API sont dans [`actifs/Js/api.js`](actifs/Js/api.js) (remplace la clé par la tienne si besoin).

## Auteur

Développé par Mahamane  
Contact : <korobaramahamane311@gmail.com>

---

© 2025 Dev Mahamane. Tous
