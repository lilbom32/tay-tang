import { render } from "preact";
import "./styles/tokens.css";
import "./styles/app.css";
import { App } from "./app.tsx";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

render(<App />, document.getElementById("app")!);
