export const sampleGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "feature-1",
      properties: {
        featureType: "point",
        label: "Kiel",
      },
      geometry: {
        type: "Point",
        coordinates: [10.1228, 54.3233],
      },
    },
    {
      type: "Feature",
      id: "feature-2",
      properties: {
        featureType: "route",
        label: "Beispielroute",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [10.1228, 54.3233],
          [10.15, 54.33],
          [10.18, 54.34],
        ],
      },
    },
    {
      type: "Feature",
      id: "feature-3",
      properties: {
        featureType: "geofence",
        label: "Beispielzone",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [10.09, 54.31],
            [10.14, 54.31],
            [10.14, 54.34],
            [10.09, 54.34],
            [10.09, 54.31],
          ],
        ],
      },
    },
  ],
};
