// Before anything that reads the enabled country sections.
import "./app/lib/initSections";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";

console.log(`${__APP_NAME__} ${__APP_VERSION__} (${__APP_COMMIT__})`);

createRoot(document.getElementById("app")!).render(<App />);
