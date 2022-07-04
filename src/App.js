import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import {
  getStopPointCoordinate,
  getGpsPosition,
  getGpsLength,
} from "./utils/dataHandler";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleG1laXJlbHMiLCJhIjoiY2w1MGF0YzZwMGtxaTNwcWwwbjFjZWxldCJ9.NuJ9ynxJsImQYRschzqUkg";

function App() {
  const points = getStopPointCoordinate(0).map((e) => {
    return { long: e[0], late: e[1] };
  });

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(points[0].long);
  const [lat, setLat] = useState(points[0].late);
  const [zoom, setZoom] = useState(9);
  const [time, setTime] = useState(0);

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [points[0].long, points[0].late],
        },
        properties: {
          title: "Mapbox",
          description: "Initial",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [points[1].long, points[1].late],
        },
        properties: {
          title: "Mapbox",
          description: "End",
        },
      },
    ],
  };

  useEffect(() => {
    setInterval(() => {
      if (time < getGpsLength(0)) setTime((prevCount) => prevCount + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    //console.log("entrou");
    //console.log(time);
    if (getGpsPosition(0, time)) {
      const el = document.createElement("div");
      el.className = "marker";
      el.id = `marker${time}`;

      if (time >= 1 && time < getGpsLength(0)) {
        document.getElementById(`marker${time - 1}`).style.display = "none";
      }

      const newPosition = {
        type: "NewPosition",
        coordinates: [
          getGpsPosition(0, time).longitude,
          getGpsPosition(0, time).latitude,
        ],
      };
      map.current &&
        new mapboxgl.Marker(el)
          .setLngLat(newPosition.coordinates)
          .addTo(map.current);
    }
  }, [time]);

  //console.log(points[0].long, points[0].late)

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
    for (const feature of geojson.features) {
      new mapboxgl.Marker()
        .setLngLat(feature.geometry.coordinates)
        .addTo(map.current);
    }
  }, []);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
