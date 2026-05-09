import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

async function enableMocking() {
  const shouldEnableMocking =
    import.meta.env.DEV && import.meta.env.VITE_USE_MSW !== "false";

  if (!shouldEnableMocking) {
    return;
  }

  const { worker } = await import("../mockData/mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
