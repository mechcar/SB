import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import data from "./Modules/data";
import { Game } from "./Modules/Game";

function SB() {
	return (
		<section className="wrapper">
			<Game {...data} />
		</section>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<SB />
	// </React.StrictMode>
);
