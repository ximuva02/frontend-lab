import { cloneValue, inferFeatureType } from "./geojson-utils.js";

export class GeoJsonMapController {
  constructor(options) {
    this.options = options;
    this.map = L.map("map").setView([54.3233, 10.1228], 12);
    this.drawnItems = new L.FeatureGroup();

    this.initializeMap();
    this.bindEvents();
  }

  initializeMap() {
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap-Mitwirkende",
    }).addTo(this.map);

    this.map.addLayer(this.drawnItems);
    this.map.addControl(
      new L.Control.Draw({
        edit: {
          featureGroup: this.drawnItems,
          remove: true,
        },
        draw: {
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: {
            repeatMode: false,
          },
          polyline: {
            shapeOptions: {
              weight: 4,
            },
          },
          polygon: {
            allowIntersection: false,
            showArea: true,
          },
        },
      }),
    );
  }

  bindEvents() {
    this.map.on(L.Draw.Event.CREATED, (event) => {
      const feature = this.layerToFeature(event.layer);
      this.options.onFeatureCreated(feature);
    });

    this.map.on(L.Draw.Event.EDITED, (event) => {
      const updatedFeatures = [];

      event.layers.eachLayer((layer) => {
        updatedFeatures.push(this.layerToFeature(layer));
      });

      this.options.onFeaturesUpdated(updatedFeatures);
    });

    this.map.on(L.Draw.Event.DELETED, (event) => {
      const deletedFeatureIds = [];

      event.layers.eachLayer((layer) => {
        if (layer.__featureId) {
          deletedFeatureIds.push(layer.__featureId);
        }
      });

      this.options.onFeaturesDeleted(deletedFeatureIds);
    });
  }

  render(geojson) {
    this.drawnItems.clearLayers();

    geojson.features.forEach((feature) => {
      const layerGroup = L.geoJSON(feature, {
        pointToLayer(_innerFeature, latlng) {
          return L.marker(latlng);
        },
      });

      layerGroup.eachLayer((layer) => {
        layer.__featureId = feature.id;
        layer.feature = cloneValue(feature);
        this.bindLayerPopup(layer, feature);
        this.drawnItems.addLayer(layer);
      });
    });

    const bounds = this.drawnItems.getBounds();
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [20, 20] });
    }
  }

  bindLayerPopup(layer, feature) {
    const label =
      feature?.properties?.label ||
      feature?.properties?.featureType ||
      "Feature";

    layer.bindPopup(label);
  }

  layerToFeature(layer) {
    const feature = layer.toGeoJSON();

    if (layer.__featureId) {
      feature.id = layer.__featureId;
    }

    feature.properties = {
      ...(feature.properties || {}),
      featureType:
        feature.properties?.featureType ||
        inferFeatureType(feature.geometry?.type),
    };

    return feature;
  }
}
