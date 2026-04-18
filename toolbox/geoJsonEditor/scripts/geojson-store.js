import {
  cloneValue,
  createEmptyFeatureCollection,
  inferFeatureType,
  isFeatureCollection,
} from "./geojson-utils.js";

export class GeoJsonStore {
  constructor(initialGeojson) {
    this.listeners = new Set();
    this.featureIdCounter = 1;
    this.geojson = createEmptyFeatureCollection();

    this.setGeojson(initialGeojson || createEmptyFeatureCollection());
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getGeojson());

    return () => {
      this.listeners.delete(listener);
    };
  }

  getGeojson() {
    return cloneValue(this.geojson);
  }

  reset() {
    this.setGeojson(createEmptyFeatureCollection());
    this.featureIdCounter = 1;
    this.emit();
  }

  setGeojson(nextGeojson) {
    if (!isFeatureCollection(nextGeojson)) {
      throw new Error("JSON muss eine GeoJSON FeatureCollection sein.");
    }

    this.geojson = this.normalizeGeojson(nextGeojson);
    this.syncFeatureIdCounter();
    this.emit();
  }

  addFeature(feature) {
    const normalizedFeature = this.ensureFeatureDefaults(feature);

    this.geojson.features.push(cloneValue(normalizedFeature));
    this.syncFeatureIdCounter();
    this.emit();

    return cloneValue(normalizedFeature);
  }

  updateFeatures(updatedFeatures) {
    const featureMap = new Map(
      updatedFeatures.map((feature) => {
        const normalizedFeature = this.ensureFeatureDefaults(feature);
        return [normalizedFeature.id, normalizedFeature];
      }),
    );

    this.geojson.features = this.geojson.features.map((feature) => {
      if (!featureMap.has(feature.id)) {
        return feature;
      }

      return cloneValue(featureMap.get(feature.id));
    });

    this.emit();
  }

  removeFeatures(featureIds) {
    const featureIdSet = new Set(featureIds);

    this.geojson.features = this.geojson.features.filter(
      (feature) => !featureIdSet.has(feature.id),
    );

    this.emit();
  }

  ensureFeatureDefaults(feature) {
    const nextFeature = cloneValue(feature);

    if (!nextFeature.id) {
      nextFeature.id = this.getNextFeatureId();
    }

    nextFeature.properties = nextFeature.properties || {};

    if (!nextFeature.properties.featureType && nextFeature.geometry?.type) {
      nextFeature.properties.featureType = inferFeatureType(
        nextFeature.geometry.type,
      );
    }

    return nextFeature;
  }

  normalizeGeojson(nextGeojson) {
    return {
      type: "FeatureCollection",
      features: nextGeojson.features.map((feature) =>
        this.ensureFeatureDefaults(feature),
      ),
    };
  }

  getNextFeatureId() {
    const featureId = `feature-${this.featureIdCounter}`;
    this.featureIdCounter += 1;
    return featureId;
  }

  syncFeatureIdCounter() {
    const numericIds = this.geojson.features
      .map((feature) => String(feature.id || ""))
      .map((featureId) => Number(featureId.replace("feature-", "")))
      .filter((value) => Number.isFinite(value));

    const maxId = numericIds.length ? Math.max(...numericIds) : 0;
    this.featureIdCounter = maxId + 1;
  }

  emit() {
    const snapshot = this.getGeojson();

    this.listeners.forEach((listener) => {
      listener(snapshot);
    });
  }
}
