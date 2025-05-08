import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import packageJson from "../package.json";

console.log(`${packageJson.name} ${packageJson.version}`);

createRoot(document.getElementById("app")!).render(<App />);
