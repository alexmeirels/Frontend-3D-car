import data from "../data/frontend_data_gps.json";

export const getStopPointCoordinate = (index) => {
  return data.courses[index].stop_points.coordinates;
};

export const getGpsPosition = (index, time) => {
  return data.courses[index].gps[time];
};

export const getGpsLength = (index) => {
  return data.courses[index].gps.length;
};

export const getPoints = (routes) => {
  return getStopPointCoordinate(routes).map((e) => {
    return { long: e[0], late: e[1] };
  });
};

export const getGeoJson = (routes) => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [getPoints(routes)[0].long, getPoints(routes)[0].late],
        },
        properties: {
          title: `Route ${routes}`,
          description: "Start",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [getPoints(routes)[1].long, getPoints(routes)[1].late],
        },
        properties: {
          title: `Route ${routes}`,
          description: "End",
        },
      },
    ],
  };
};
