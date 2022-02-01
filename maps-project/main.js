require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/rest/locator",
  "esri/Graphic",
  "esri/widgets/Locate",
  "esri/widgets/Track",
  "esri/rest/route",
  "esri/rest/support/RouteParameters",
  "esri/rest/support/FeatureSet",
], function (
  esriConfig,
  Map,
  MapView,
  Search,
  locator,
  Graphic,
  Locate,
  Track,
  route,
  RouteParameters,
  FeatureSet
) {
  esriConfig.apiKey =
    "AAPK6a1ddfbf1fa845be8e35b6290b61fefaupnfKJsTUdoaoS80H9dlK9j7nJK24WYfx7BbRzrkHNDIrDlqr8WmZy3sa5id3uab";
  const map = new Map({
    basemap: "arcgis-navigation",
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-40, 28],
    zoom: 2,
  });

  const search = new Search({
    view: view,
  });
  view.ui.add(search, "top-right");

  const places = [
    "Choose a place type...",
    "Parks and Outdoors",
    "Coffee Shop",
    "Gas Station",
    "Food",
    "Hotel",
  ];

  const select = document.createElement("select", "");
  select.setAttribute("class", "esri-widget esri-select");
  select.setAttribute(
    "style",
    "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em"
  );

  places.forEach(function (p) {
    const option = document.createElement("option");
    option.value = p;
    option.innerHTML = p;
    select.appendChild(option);
  });
  view.ui.add(select, "top-right");

  const locatorUrl =
    "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

  function findPlaces(category, pt) {
    locator
      .addressToLocations(locatorUrl, {
        location: pt,
        categories: [category],
        maxLocations: 25,
        outFields: ["Place_addr", "PlaceName"],
      })
      .then(function (results) {
        view.popup.close();
        view.graphics.removeAll();

        results.forEach(function (result) {
          view.graphics.add(
            new Graphic({
              attributes: result.attributes,
              geometry: result.location,
              symbol: {
                type: "simple-marker",
                color: "#000000",
                size: "12px",
                outline: {
                  color: "#ffffff",
                  width: "2px",
                },
              },

              popupTemplate: {
                title: "{PlaceName}",
                content: "{Place_addr}",
              },
            })
          );
        });
      });
  }

  view.watch("stationary", function (val) {
    if (val) {
      findPlaces(select.value, view.center);
    }
  });
  select.addEventListener("change", function (event) {
    findPlaces(event.target.value, view.center);
  });

  const track = new Track({
    view: view,
    graphic: new Graphic({
      symbol: {
        type: "simple-marker",
        size: "12px",
        color: "green",
        outline: {
          color: "#efefef",
          width: "1.5px",
        },
      },
    }),
    useHeadingEnabled: false,
  });
  view.ui.add(track, "top-left");
});
