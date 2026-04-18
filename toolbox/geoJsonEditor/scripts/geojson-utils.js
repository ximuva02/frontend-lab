export function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createEmptyFeatureCollection() {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

export function isFeatureCollection(value) {
  return Boolean(
    value &&
    value.type === "FeatureCollection" &&
    Array.isArray(value.features),
  );
}

export function inferFeatureType(geometryType) {
  if (geometryType === "Point") {
    return "point";
  }

  if (geometryType === "LineString") {
    return "route";
  }

  if (geometryType === "Polygon") {
    return "geofence";
  }

  return "feature";
}
