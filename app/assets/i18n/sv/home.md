# Välkommen

Denna Ringa JS Application Template är utformad som utgångspunkt för att bygga ett SPA genom att använda:

* React
* Ringa JS ([ringa](http://www.ringajs.com/ringa-js/ringa))
* React Ringa Plugin ([react-ringa](http://www.ringajs.com/ringa-js/react-ringa))
* Ringa JS Component Library ([ringa-fw-react](http://www.ringajs.com/ringa-js/ringa-fw-react))

# Funktioner

1. Integrerad `BUILD_INFO` i byggnaden (se versionen i` Footer.jsx` till exempel)
    * Uppdateras automatiskt varje gång du kör
    * Informationen visas i webbläsarkonsolen på körning för enkel debugging
2. NPM Build Scripts
    * `start`: kör en lokal utveckling instans på `http://localhost:8080`
    * `prod`: kör en full produktion byggnad, minifierad med CSS extraherad, in i `dist`
    * `analyze`: köra Webpack `BundleAnalyzerPlugin` på produktionsbyggnaden
3. Internationalisering
    * Inbyggd internationalisering redo att gå så att du enkelt kan utöka din ansökan till en större publik
4. Debugging Inspector
    * Inbyggd debug inspektör för att hjälpa dig att räkna ut hur applikationen är konstruerad
    * Visar bifogade kontroller
    * Visar vilka Modeller som är anslutna till vilka controllers
    * Håll ner ALT + SHIFT och flytta musen runt skärmen för att inspektera komponenter

# Komma igång

* Inkörsport: `app/src/index.js`
* Internationell inställning: `app/src/i18n.js`
* Layout: `app/src/layout/ApplicationLayout.jsx`