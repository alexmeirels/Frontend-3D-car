import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import {
  getStopPointCoordinate,
  getGpsPosition,
  getGpsLength,
  getPoints,
  getGeoJson,
} from "./utils/dataHandler";

import { useTranslation } from "react-i18next";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleG1laXJlbHMiLCJhIjoiY2w1MGF0YzZwMGtxaTNwcWwwbjFjZWxldCJ9.NuJ9ynxJsImQYRschzqUkg";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [points, setPoints] = useState(getPoints(0));
  const [lng, setLng] = useState(getPoints(0)[0].long);
  const [lat, setLat] = useState(getPoints(0)[0].late);
  const [zoom, setZoom] = useState(12);
  const [time, setTime] = useState(0);
  const [routes, setRoutes] = useState(0);
  const [geoJson, setGeoJson] = useState(getGeoJson(0));
  const [execution, setExcution] = useState(0);

  useEffect(() => {
    // seta as novas rotas e remove os carrinhos da rota anterior
    const currentTime = time;
    let counterRemover = 0;
    while (counterRemover < 10) {
      const olderPosition = document.getElementById(
        `marker${currentTime - counterRemover}-${execution - 1}`
      );
      if (olderPosition)
        document.getElementById(
          `marker${currentTime - counterRemover}-${execution - 1}`
        ).style.display = "none";
      counterRemover = counterRemover + 1;
    }
    setLng(getPoints(routes)[0].long);
    setLat(getPoints(routes)[0].late);
    setTime(0);
    setGeoJson(getGeoJson(routes));
  }, [routes]);

  useEffect(() => {
    const counter = setInterval(() => {
      setTime((prevCount) => prevCount + 1);
    }, 2000);
  }, []);

  useEffect(() => {
    // remove a ultima aparição e adiciona a nova.
    if (getGpsPosition(routes, time)) {
      const el = document.createElement("div");
      el.className = "marker";
      el.id = `marker${time}-${execution}`;

      if (time >= 1 && time < getGpsLength(routes)) {
        const olderPosition = document.getElementById(
          `marker${time - 1}-${execution}`
        );
        if (olderPosition)
          document.getElementById(
            `marker${time - 1}-${execution}`
          ).style.display = "none";
      }

      const newPointCoordinates = [
        getGpsPosition(routes, time).longitude,
        getGpsPosition(routes, time).latitude,
      ];

      map.current &&
        new mapboxgl.Marker(el)
          .setLngLat(newPointCoordinates)
          .addTo(map.current);
    }
  }, [time]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    // adiciona as marcas inicial e final de cada rota
    let positionCount = 0;
    for (const feature of geoJson.features) {
      const currentMarker = new mapboxgl.Marker({
        color: positionCount > 0 ? "red" : "blue",
      })
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
          )
        )
        .addTo(map.current);
      positionCount = positionCount + 1;
    }
  }, [geoJson]);

  const changeRoute = (route) => {
    setRoutes(route);
    setExcution(execution + 1);
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <div className="App">
        <button onClick={() => changeLanguage("en")}>EN</button>
        <button onClick={() => changeLanguage("pt")}>PT</button>
        <button onClick={() => changeLanguage("es")}>ES</button>
        <div>{t("description.part1")}</div>
        <hr />
        <div>
          <h1>{t("title")}</h1>
          <button onClick={() => changeRoute(1)}>{t("routes.routes1")}</button>
          <button onClick={() => changeRoute(2)}>{t("routes.routes2")}</button>
          <button onClick={() => changeRoute(3)}>{t("routes.routes3")}</button>
          <button onClick={() => changeRoute(4)}>{t("routes.routes4")}</button>
          <button onClick={() => changeRoute(5)}>{t("routes.routes5")}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
