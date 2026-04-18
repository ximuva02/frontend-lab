import { sampleGeojson } from "./sample-geojson.js";
import { GeoJsonStore } from "./geojson-store.js";
import { GeoJsonEditorPanel } from "./editor-panel.js";
import { GeoJsonMapController } from "./map-controller.js";
import { cloneValue, createEmptyFeatureCollection } from "./geojson-utils.js";

class GeoJsonEditorApp {
  constructor() {
    this.store = new GeoJsonStore(createEmptyFeatureCollection());
    this.panel = new GeoJsonEditorPanel({
      onLoadSample: () => {
        this.handleLoadSample();
      },
      onApplyJson: (parsedGeojson) => {
        this.handleApplyJson(parsedGeojson);
      },
      onClearAll: () => {
        this.handleClearAll();
      },
    });
    this.mapController = new GeoJsonMapController({
      onFeatureCreated: (feature) => {
        this.handleFeatureCreated(feature);
      },
      onFeaturesUpdated: (features) => {
        this.handleFeaturesUpdated(features);
      },
      onFeaturesDeleted: (featureIds) => {
        this.handleFeaturesDeleted(featureIds);
      },
    });

    window.appState = {
      geojson: createEmptyFeatureCollection(),
    };

    this.store.subscribe((geojson) => {
      window.appState.geojson = cloneValue(geojson);
      this.panel.render(geojson);
      this.mapController.render(geojson);
    });

    this.panel.setStatus("Bereit", false);
  }

  handleLoadSample() {
    this.store.setGeojson(sampleGeojson);
    this.panel.setStatus("Beispiel geladen.", false);
  }

  handleApplyJson(parsedGeojson) {
    this.store.setGeojson(parsedGeojson);
    this.panel.setStatus("JSON erfolgreich angewendet.", false);
  }

  handleClearAll() {
    this.store.reset();
    this.panel.setStatus("Alle Features entfernt.", false);
  }

  handleFeatureCreated(feature) {
    const normalizedFeature = this.store.addFeature(feature);
    this.panel.setStatus(
      `Feature erstellt: ${normalizedFeature.properties.featureType}`,
      false,
    );
  }

  handleFeaturesUpdated(features) {
    if (!features.length) {
      return;
    }

    this.store.updateFeatures(features);
    this.panel.setStatus("Änderungen übernommen.", false);
  }

  handleFeaturesDeleted(featureIds) {
    if (!featureIds.length) {
      return;
    }

    this.store.removeFeatures(featureIds);
    this.panel.setStatus("Feature entfernt.", false);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new GeoJsonEditorApp();
});
