import { defineConfig } from "orval";

export default defineConfig({
  shopApi: {
    input: {
      target: "./openapi/shop-api.yaml",
    },
    output: {
      target: "./src/api/generated/shop-api.ts",
      schemas: "./src/api/generated/models",
      client: "fetch",
      mode: "single",
      mock: {
        type: "msw",
        useExamples: true,
      },
    },
  },
});
